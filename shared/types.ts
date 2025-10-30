import { z } from 'zod';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export const CATEGORIES = ['Salads', 'Soups', 'Pasta', 'Pizza', 'Main Courses', 'Desserts', 'Beverages', 'Appetizers'] as const;
export type Category = typeof CATEGORIES[number];
export const menuItemSchema = z.object({
  id: z.string().optional(), // Optional for creation
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  category: z.enum(CATEGORIES),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  isActive: z.boolean().optional().default(true),
});
export type MenuItem = z.infer<typeof menuItemSchema> & { id: string };
export interface CartItem extends MenuItem {
  quantity: number;
}
export const customerInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
});
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: CustomerInfo;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: number;
}