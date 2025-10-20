import { IndexedEntity } from "./core-utils";
import type { MenuItem, Order } from "@shared/types";
import { MOCK_MENU_ITEMS } from "@shared/mock-data";
export class MenuItemEntity extends IndexedEntity<MenuItem> {
  static readonly entityName = "menuItem";
  static readonly indexName = "menuItems";
  static readonly initialState: MenuItem = {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "Main Courses",
    imageUrl: "",
  };
  static seedData = MOCK_MENU_ITEMS;
}
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    items: [],
    total: 0,
    customer: { name: "", phone: "", email: "" },
    status: "pending",
    createdAt: 0,
  };
}