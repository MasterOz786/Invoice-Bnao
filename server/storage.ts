import { 
  companies, clients, invoices, lineItems,
  type Company, type Client, type Invoice, type LineItem,
  type InsertCompany, type InsertClient, type InsertInvoice, type InsertLineItem,
  type InvoiceWithDetails
} from "@shared/schema";

export interface IStorage {
  // Companies
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  
  // Clients
  getClient(id: number): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Invoices
  getInvoice(id: number): Promise<InvoiceWithDetails | undefined>;
  getAllInvoices(): Promise<InvoiceWithDetails[]>;
  createInvoice(invoice: InsertInvoice): Promise<InvoiceWithDetails>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<InvoiceWithDetails | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
  
  // Line Items
  getLineItemsByInvoice(invoiceId: number): Promise<LineItem[]>;
  createLineItem(lineItem: InsertLineItem): Promise<LineItem>;
  updateLineItem(id: number, lineItem: Partial<InsertLineItem>): Promise<LineItem | undefined>;
  deleteLineItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company>;
  private clients: Map<number, Client>;
  private invoices: Map<number, Invoice>;
  private lineItems: Map<number, LineItem>;
  private companyId: number;
  private clientId: number;
  private invoiceId: number;
  private lineItemId: number;

  constructor() {
    this.companies = new Map();
    this.clients = new Map();
    this.invoices = new Map();
    this.lineItems = new Map();
    this.companyId = 1;
    this.clientId = 1;
    this.invoiceId = 1;
    this.lineItemId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Default company
    const defaultCompany: Company = {
      id: this.companyId++,
      name: "Your Company",
      address: "123 Business St\nSan Francisco, CA 94105",
      email: "contact@yourcompany.com",
      phone: "+1 (555) 123-4567",
      logo: null,
    };
    this.companies.set(defaultCompany.id, defaultCompany);

    // Sample client
    const sampleClient: Client = {
      id: this.clientId++,
      name: "Sample Client Inc.",
      address: "456 Client Ave\nNew York, NY 10001",
      email: "billing@sampleclient.com",
      phone: "+1 (555) 987-6543",
    };
    this.clients.set(sampleClient.id, sampleClient);
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = this.companyId++;
    const newCompany: Company = { ...company, id };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined> {
    const existing = this.companies.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...company };
    this.companies.set(id, updated);
    return updated;
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const newClient: Client = { ...client, id };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...client };
    this.clients.set(id, updated);
    return updated;
  }

  async getInvoice(id: number): Promise<InvoiceWithDetails | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    const company = await this.getCompany(invoice.companyId!);
    const client = await this.getClient(invoice.clientId!);
    const invoiceLineItems = await this.getLineItemsByInvoice(id);

    if (!company || !client) return undefined;

    return {
      ...invoice,
      company,
      client,
      lineItems: invoiceLineItems,
    };
  }

  async getAllInvoices(): Promise<InvoiceWithDetails[]> {
    const invoicesWithDetails: InvoiceWithDetails[] = [];
    
    for (const invoice of this.invoices.values()) {
      const details = await this.getInvoice(invoice.id);
      if (details) {
        invoicesWithDetails.push(details);
      }
    }
    
    return invoicesWithDetails;
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<InvoiceWithDetails> {
    const id = this.invoiceId++;
    const { lineItems: lineItemsData, ...invoiceWithoutLineItems } = invoiceData;
    
    const invoice: Invoice = {
      ...invoiceWithoutLineItems,
      id,
      createdAt: new Date(),
    };
    
    this.invoices.set(id, invoice);

    // Create line items
    for (const lineItemData of lineItemsData) {
      await this.createLineItem({
        ...lineItemData,
        invoiceId: id,
      });
    }

    const result = await this.getInvoice(id);
    if (!result) throw new Error("Failed to create invoice");
    
    return result;
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<InvoiceWithDetails | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;

    const { lineItems: lineItemsData, ...invoiceWithoutLineItems } = invoiceData;

    const updated = { ...existing, ...invoiceWithoutLineItems };
    this.invoices.set(id, updated);

    // Update line items if provided
    if (lineItemsData) {
      // Remove existing line items
      const existingLineItems = await this.getLineItemsByInvoice(id);
      for (const lineItem of existingLineItems) {
        await this.deleteLineItem(lineItem.id);
      }

      // Create new line items
      for (const lineItemData of lineItemsData) {
        await this.createLineItem({
          ...lineItemData,
          invoiceId: id,
        });
      }
    }

    return await this.getInvoice(id);
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const invoice = this.invoices.get(id);
    if (!invoice) return false;

    // Delete associated line items
    const lineItems = await this.getLineItemsByInvoice(id);
    for (const lineItem of lineItems) {
      await this.deleteLineItem(lineItem.id);
    }

    this.invoices.delete(id);
    return true;
  }

  async getLineItemsByInvoice(invoiceId: number): Promise<LineItem[]> {
    return Array.from(this.lineItems.values()).filter(
      item => item.invoiceId === invoiceId
    );
  }

  async createLineItem(lineItem: InsertLineItem): Promise<LineItem> {
    const id = this.lineItemId++;
    const newLineItem: LineItem = { ...lineItem, id };
    this.lineItems.set(id, newLineItem);
    return newLineItem;
  }

  async updateLineItem(id: number, lineItem: Partial<InsertLineItem>): Promise<LineItem | undefined> {
    const existing = this.lineItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...lineItem };
    this.lineItems.set(id, updated);
    return updated;
  }

  async deleteLineItem(id: number): Promise<boolean> {
    return this.lineItems.delete(id);
  }
}

export const storage = new MemStorage();
