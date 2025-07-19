import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface InvoiceFormProps {
  invoiceData: Partial<InsertInvoice>;
  onInvoiceDataChange: (data: Partial<InsertInvoice>) => void;
  selectedCurrency: string;
}

export default function InvoiceForm({ invoiceData, onInvoiceDataChange, selectedCurrency }: InvoiceFormProps) {
  const handleInputChange = (field: keyof InsertInvoice, value: any) => {
    onInvoiceDataChange({ ...invoiceData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">Invoice Number</Label>
            <Input
              id="number"
              placeholder="INV-001"
              value={invoiceData.number || ""}
              onChange={(e) => handleInputChange("number", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={invoiceData.issueDate || ""}
              onChange={(e) => handleInputChange("issueDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoiceData.dueDate || ""}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={invoiceData.currency || selectedCurrency} onValueChange={(value) => handleInputChange("currency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Company & Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">From (Your Company)</h4>
            <div className="space-y-3">
              <Input
                placeholder="Company Name"
                defaultValue="Acme Corporation"
              />
              <Textarea
                placeholder="Address"
                rows={3}
                defaultValue="123 Business St&#10;San Francisco, CA 94105"
              />
              <Input
                type="email"
                placeholder="Email"
                defaultValue="contact@acme.com"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Bill To (Client)</h4>
            <div className="space-y-3">
              <Input
                placeholder="Client Name"
                defaultValue="TechStart Inc."
              />
              <Textarea
                placeholder="Address"
                rows={3}
                defaultValue="456 Client Ave&#10;New York, NY 10001"
              />
              <Input
                type="email"
                placeholder="Email"
                defaultValue="billing@techstart.com"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes or payment terms"
            value={invoiceData.notes || ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
