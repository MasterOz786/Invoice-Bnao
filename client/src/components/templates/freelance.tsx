import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface FreelanceTemplateProps {
  invoiceData: Partial<InsertInvoice>;
  currency: string;
}

export default function FreelanceTemplate({ invoiceData, currency }: FreelanceTemplateProps) {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  const lineItems = invoiceData.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount - (invoiceData.discount || 0);

  return (
    <div className="bg-green-50 min-h-full">
      {/* Header */}
      <div className="bg-green-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Invoice</h1>
              <p className="text-green-100">#{invoiceData.number || "INV-001"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">Acme Freelance</p>
            <p className="text-green-100 text-sm">Creative Professional</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-3">FROM</h3>
              <p className="font-semibold">John Doe</p>
              <p className="text-gray-600 text-sm">Freelance Designer</p>
              <p className="text-gray-600 text-sm">123 Creative St</p>
              <p className="text-gray-600 text-sm">San Francisco, CA 94105</p>
              <p className="text-gray-600 text-sm">john@acmefreelance.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-green-600 mb-3">BILL TO</h3>
              <p className="font-semibold">TechStart Inc.</p>
              <p className="text-gray-600 text-sm">456 Client Ave</p>
              <p className="text-gray-600 text-sm">New York, NY 10001</p>
              <p className="text-gray-600 text-sm">billing@techstart.com</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-green-600 font-medium text-sm">ISSUE DATE</p>
            <p className="font-semibold">{invoiceData.issueDate || "Dec 15, 2024"}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-green-600 font-medium text-sm">DUE DATE</p>
            <p className="font-semibold">{invoiceData.dueDate || "Jan 15, 2025"}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-green-600 font-medium text-sm">PROJECT</p>
            <p className="font-semibold">Website Design</p>
          </div>
        </div>
        
        {/* Services */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-500 text-white p-4">
            <h3 className="font-semibold">Services Provided</h3>
          </div>
          
          <div className="p-6">
            {lineItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium">{item.description || "Design Service"}</p>
                  <p className="text-sm text-gray-500">{item.quantity} × {currencySymbol}{item.rate.toFixed(2)}</p>
                </div>
                <div className="font-semibold text-green-600">
                  {currencySymbol}{item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total */}
        <div className="bg-green-500 text-white rounded-lg p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-green-100">
              <span>Subtotal:</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-100">
              <span>Tax ({invoiceData.taxRate || 0}%):</span>
              <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            {(invoiceData.discount || 0) > 0 && (
              <div className="flex justify-between text-green-100">
                <span>Discount:</span>
                <span>-{currencySymbol}{(invoiceData.discount || 0).toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-green-400 pt-4">
            <span>Total Amount:</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Thank You Note */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h4 className="font-semibold text-green-600 mb-2">Thank You!</h4>
          <p className="text-gray-600 text-sm">
            I appreciate your business and look forward to working with you again.
          </p>
          {invoiceData.notes && (
            <div className="mt-4 p-4 bg-green-50 rounded text-left">
              <p className="font-medium text-green-600 mb-1">Additional Notes:</p>
              <p className="text-sm text-gray-600">{invoiceData.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
