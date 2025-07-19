import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface GradientTemplateProps {
  invoiceData: Partial<InsertInvoice>;
  currency: string;
}

export default function GradientTemplate({ invoiceData, currency }: GradientTemplateProps) {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  const lineItems = invoiceData.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount - (invoiceData.discount || 0);

  return (
    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Header with gradient background */}
      <div className="p-8 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
            <p className="text-blue-100">#{invoiceData.number || "INV-001"}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">Acme Corporation</p>
            <p className="text-blue-100 text-sm">123 Business St</p>
            <p className="text-blue-100 text-sm">San Francisco, CA 94105</p>
          </div>
        </div>
      </div>

      {/* Main content with white background */}
      <div className="bg-white text-gray-900 p-8 rounded-t-3xl">
        {/* Dates and Client Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-purple-600">BILL TO</h3>
            <p className="font-semibold">TechStart Inc.</p>
            <p className="text-gray-600 text-sm">456 Client Ave</p>
            <p className="text-gray-600 text-sm">New York, NY 10001</p>
          </div>
          <div className="text-sm">
            <div className="mb-2">
              <span className="font-medium text-purple-600">Issue Date:</span>
              <span className="ml-2">{invoiceData.issueDate || "Dec 15, 2024"}</span>
            </div>
            <div>
              <span className="font-medium text-purple-600">Due Date:</span>
              <span className="ml-2">{invoiceData.dueDate || "Jan 15, 2025"}</span>
            </div>
          </div>
        </div>
        
        {/* Line Items */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
            <div className="grid grid-cols-4 gap-4 font-medium">
              <div>DESCRIPTION</div>
              <div className="text-center">QTY</div>
              <div className="text-right">RATE</div>
              <div className="text-right">AMOUNT</div>
            </div>
          </div>
          
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200">
              <div>{item.description || "Service"}</div>
              <div className="text-center">{item.quantity}</div>
              <div className="text-right">{currencySymbol}{item.rate.toFixed(2)}</div>
              <div className="text-right font-medium">{currencySymbol}{item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="space-y-2 text-sm mb-4">
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
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoiceData.notes && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
            <p className="text-sm text-gray-600">{invoiceData.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
