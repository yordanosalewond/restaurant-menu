import { Hono } from "hono";
import type { Env } from './core-utils';
import { MenuItemEntity, OrderEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { CartItem, CustomerInfo, MenuItem, Order } from "@shared/types";
import { customerInfoSchema, menuItemSchema } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET all menu items
  app.get('/api/menu', async (c) => {
    await MenuItemEntity.ensureSeed(c.env);
    const page = await MenuItemEntity.list(c.env, null, 100); // Fetch up to 100 items
    // Filter out invalid items (items with no name or price 0)
    const validItems = page.items.filter(item => item.name && item.name.trim() !== '');
    return ok(c, validItems);
  });
  // POST a new menu item
  app.post('/api/menu', async (c) => {
    const body = await c.req.json();
    const validation = menuItemSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, 'Invalid menu item data.');
    }
    const newItem: MenuItem = {
      ...validation.data,
      id: crypto.randomUUID(),
    };
    await MenuItemEntity.create(c.env, newItem);
    return ok(c, newItem);
  });
  // PUT (update) a menu item
  app.put('/api/menu/:id', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    const validation = menuItemSchema.safeParse(body);
    if (!validation.success) {
      return bad(c, 'Invalid menu item data.');
    }
    const itemEntity = new MenuItemEntity(c.env, id);
    if (!(await itemEntity.exists())) {
      return notFound(c, 'Menu item not found.');
    }
    const updatedItem: MenuItem = { ...validation.data, id };
    await itemEntity.save(updatedItem);
    return ok(c, updatedItem);
  });
  // DELETE a menu item
  app.delete('/api/menu/:id', async (c) => {
    const { id } = c.req.param();
    const existed = await MenuItemEntity.delete(c.env, id);
    if (!existed) {
      return notFound(c, 'Menu item not found.');
    }
    return ok(c, { id });
  });

  // Clean up invalid menu items (admin only)
  app.post('/api/menu/cleanup', async (c) => {
    try {
      // First, clean up orphaned index entries
      const orphanedCount = await MenuItemEntity.cleanupIndex(c.env);
      
      // Then, get the list of valid items and remove any with invalid data
      const page = await MenuItemEntity.list(c.env, null, 1000);
      const invalidItems = page.items.filter(item => !item.name || item.name.trim() === '' || item.price === 0);
      const idsToDelete = invalidItems.map(item => item.id);
      
      let deletedCount = 0;
      if (idsToDelete.length > 0) {
        deletedCount = await MenuItemEntity.deleteMany(c.env, idsToDelete);
      }
      
      return ok(c, { 
        orphanedIndexEntries: orphanedCount, 
        invalidDocuments: deletedCount,
        total: orphanedCount + deletedCount,
        message: `Cleaned up ${orphanedCount} orphaned index entries and ${deletedCount} invalid documents`
      });
    } catch (error) {
      console.error('[CLEANUP ERROR]', error);
      return c.json({ success: false, error: 'Cleanup failed' }, 500);
    }
  });
  // GET all orders
  app.get('/api/orders', async (c) => {
    const page = await OrderEntity.list(c.env, null, 1000); // Fetch up to 1000 orders
    return ok(c, page.items);
  });
  // POST a new order
  app.post('/api/orders', async (c) => {
    const body = await c.req.json<{ items: CartItem[], total: number, customer: CustomerInfo }>();
    const validation = customerInfoSchema.safeParse(body.customer);
    if (!validation.success) {
      return bad(c, 'Invalid customer information.');
    }
    if (!body.items || body.items.length === 0) {
      return bad(c, 'Cannot create an empty order.');
    }
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items: body.items,
      total: body.total,
      customer: validation.data,
      status: 'confirmed' as const,
      createdAt: Date.now(),
    };
    await OrderEntity.create(c.env, newOrder);
    return ok(c, newOrder);
  });
  // GET an order by ID
  app.get('/api/orders/:id', async (c) => {
    const { id } = c.req.param();
    const orderEntity = new OrderEntity(c.env, id);
    if (!(await orderEntity.exists())) {
      return notFound(c, 'Order not found.');
    }
    const order = await orderEntity.getState();
    return ok(c, order);
  });

  // PATCH order status
  app.patch('/api/orders/:id/status', async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json<{ status: Order['status'] }>();
    
    if (!body.status || !['pending', 'confirmed', 'completed'].includes(body.status)) {
      return bad(c, 'Invalid status value.');
    }

    const orderEntity = new OrderEntity(c.env, id);
    if (!(await orderEntity.exists())) {
      return notFound(c, 'Order not found.');
    }

    const order = await orderEntity.getState();
    const updatedOrder: Order = { ...order, status: body.status };
    await orderEntity.save(updatedOrder);
    
    return ok(c, updatedOrder);
  });

  // POST payment checkout
  app.post('/api/payments/checkout', async (c) => {
    try {
      const body = await c.req.json<{
        phone: string;
        email: string;
        nonce: string;
        paymentMethods: string[];
        items: Array<{ name: string; price: number; quantity: number }>;
        lang?: string;
      }>();

      const { phone, email, nonce, paymentMethods, items, lang = 'EN' } = body;

      if (!phone || !email || !nonce || !paymentMethods || !items) {
        return bad(c, 'phone, email, nonce, paymentMethods, items are required');
      }

      // Validate environment variables
      if (!c.env.ARIFPAY_API_KEY || !c.env.ARIFPAY_BASE_URL || !c.env.ARIFPAY_MERCHANT_ID) {
        console.error('[CONFIG ERROR] Missing ArifPay configuration');
        return bad(c, 'Payment system not configured');
      }

      // Calculate total from items
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const expireDate = new Date(Date.now() + 20 * 60 * 1000).toISOString();

      // Build the payload for ArifPay
      const payload = {
        merchant_id: c.env.ARIFPAY_MERCHANT_ID,
        cancelUrl: c.env.CANCEL_URL || '',
        successUrl: c.env.SUCCESS_URL || '',
        errorUrl: c.env.ERROR_URL || '',
        notifyUrl: c.env.NOTIFY_URL || '',
        phone,
        email,
        nonce,
        paymentMethods,
        expireDate,
        items,
        lang,
        beneficiaries: [
          {
            accountNumber: c.env.BENEFICIARY_ACCOUNT || '',
            bank: c.env.BENEFICIARY_BANK || '',
            amount: totalAmount,
          },
        ],
      };

      console.log('[PAYMENT REQUEST]', {
        merchant_id: c.env.ARIFPAY_MERCHANT_ID,
        api_key: c.env.ARIFPAY_API_KEY ? '***' + c.env.ARIFPAY_API_KEY.slice(-4) : 'MISSING',
        base_url: c.env.ARIFPAY_BASE_URL,
        total: totalAmount,
        items_count: items.length
      });

      // Send the checkout request to ArifPay
      const response = await fetch(`${c.env.ARIFPAY_BASE_URL}/checkout/session`, {
        method: 'POST',
        headers: {
          'x-arifpay-key': c.env.ARIFPAY_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ARIFPAY ERROR]', { 
          status: response.status, 
          statusText: response.statusText,
          body: errorText 
        });
        return bad(c, `Payment gateway error: ${response.status}`);
      }

      const result = await response.json<{ data: { sessionId: string; paymentUrl: string } }>();
      console.log('[ARIFPAY SUCCESS]', { sessionId: result.data.sessionId });

      return ok(c, {
        checkoutId: result.data.sessionId,
        checkoutUrl: result.data.paymentUrl,
      });
    } catch (error) {
      console.error('[PAYMENT CHECKOUT ERROR]', error);
      return c.json({ success: false, error: error instanceof Error ? error.message : 'Payment processing failed' }, 500);
    }
  });

  // POST webhook notification from ArifPay
  app.post('/api/payments/notify', async (c) => {
    try {
      const body = await c.req.json<{
        id: string;
        status: string;
        totalAmount: number;
        sessionId: string;
        transactionRef?: string;
      }>();

      console.log('[ARIFPAY WEBHOOK]', body);

      // Verify webhook authenticity (optional but recommended)
      const signature = c.req.header('x-arifpay-signature');
      const webhookSecret = (c.env as any).ARIFPAY_WEBHOOK_SECRET;
      if (signature && webhookSecret) {
        // TODO: Implement signature verification if needed
        // For now, we'll accept all webhooks in sandbox mode
      }

      // Update order status based on payment status
      if (body.status === 'success') {
        // Payment successful - you can update order status to 'completed' here
        console.log('[PAYMENT SUCCESS]', body.sessionId);
      } else if (body.status === 'failed') {
        // Payment failed
        console.log('[PAYMENT FAILED]', body.sessionId);
      }

      return ok(c, { received: true });
    } catch (error) {
      console.error('[WEBHOOK ERROR]', error);
      return c.json({ success: false, error: 'Webhook processing failed' }, 500);
    }
  });
}