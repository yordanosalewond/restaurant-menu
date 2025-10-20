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
    return ok(c, page.items);
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
}