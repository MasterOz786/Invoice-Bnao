import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  logo: text("logo"),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  companyId: integer("company_id").references(() => companies.id),
  clientId: integer("client_id").references(() => clients.id),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date").notNull(),
  currency: text("currency").notNull().default("PKR"),
  template: text("template").notNull().default("minimalist"),
  subtotal: real("subtotal").notNull().default(0),
  taxRate: real("tax_rate").notNull().default(0),
  taxAmount: real("tax_amount").notNull().default(0),
  discount: real("discount").notNull().default(0),
  total: real("total").notNull().default(0),
  notes: text("notes"),
  customFields: jsonb("custom_fields").default({}),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lineItems = pgTable("line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => invoices.id),
  description: text("description").notNull(),
  quantity: real("quantity").notNull(),
  rate: real("rate").notNull(),
  amount: real("amount").notNull(),
});

// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
}).extend({
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    rate: z.number(),
    amount: z.number(),
  })),
});

export const insertLineItemSchema = createInsertSchema(lineItems).omit({
  id: true,
});

// Types
export type Company = typeof companies.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type LineItem = typeof lineItems.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InsertLineItem = z.infer<typeof insertLineItemSchema>;

export interface InvoiceWithDetails extends Invoice {
  company: Company;
  client: Client;
  lineItems: LineItem[];
}

export const CURRENCIES = [
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export const TEMPLATES = [
  { id: "minimalist", name: "Minimalist Corporate", description: "Clean, monochrome, tech-focused" },
  { id: "gradient", name: "Modern Gradient", description: "Creative, startup-friendly" },
  { id: "grid", name: "Grid Tabular", description: "Structured, enterprise-grade" },
  { id: "classic", name: "Classic Business", description: "Traditional, conservative" },
  { id: "freelance", name: "Freelance/Service", description: "Friendly, personal" },
];
