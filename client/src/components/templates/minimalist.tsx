import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface MinimalistTemplateProps {
  invoiceData: Partial<InsertInvoice>;
  currency: string;
}

export default function MinimalistTemplate({ invoiceData, currency }: MinimalistTemplateProps) {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  const lineItems = invoiceData.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount - (invoiceData.discount || 0);

  return (
    <div className="p-8 space-y-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-sm text-gray-600">Invoice #{invoiceData.number || "INV-001"}</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">Acme Corporation</p>
          <p className="text-gray-600">123 Business St</p>
          <p className="text-gray-600">San Francisco, CA 94105</p>
        </div>
      </div>
      
      {/* Dates and Client Info */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">BILL TO</h3>
          <p className="font-medium">TechStart Inc.</p>
          <p className="text-gray-600 text-sm">456 Client Ave</p>
          <p className="text-gray-600 text-sm">New York, NY 10001</p>
        </div>
        <div className="text-sm">
          <div className="mb-2">
            <span className="font-medium">Issue Date:</span>
            <span className="ml-2">{invoiceData.issueDate || "Dec 15, 2024"}</span>
          </div>
          <div>
            <span className="font-medium">Due Date:</span>
            <span className="ml-2">{invoiceData.dueDate || "Jan 15, 2025"}</span>
          </div>
        </div>
      </div>
      
      {/* Line Items Table */}
      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-2 font-medium">DESCRIPTION</th>
              <th className="text-center py-2 font-medium">QTY</th>
              <th className="text-right py-2 font-medium">RATE</th>
              <th className="text-right py-2 font-medium">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3">{item.description || "Service"}</td>
                <td className="text-center py-3">{item.quantity}</td>
                <td className="text-right py-3">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="text-right py-3">{currencySymbol}{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({invoiceData.taxRate || 0}%):</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          {(invoiceData.discount || 0) > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{currencySymbol}{(invoiceData.discount || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-900 pt-2">
            <span>TOTAL:</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
          <p className="text-sm text-gray-600">{invoiceData.notes}</p>
        </div>
      )}
    </div>
  );
}
