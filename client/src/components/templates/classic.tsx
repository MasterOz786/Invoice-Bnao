import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface ClassicTemplateProps {
  invoiceData: Partial<InsertInvoice>;
  currency: string;
}

export default function ClassicTemplate({ invoiceData, currency }: ClassicTemplateProps) {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "₨";
  const lineItems = invoiceData.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount - (invoiceData.discount || 0);

  return (
    <div className="p-8 space-y-8 font-serif">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">INVOICE</h1>
        <p className="text-gray-600 text-lg">TechCorp Solutions</p>
        <p className="text-gray-500">Professional Services</p>
        <p className="text-sm text-gray-500 mt-2">Invoice #{invoiceData.number || "INV-001"}</p>
      </div>

      {/* Company and Client Information */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        <div>
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">FROM</h3>
          <p className="font-semibold text-lg">TechCorp Solutions</p>
          <p className="text-gray-600">Plot 123, DHA Phase 6</p>
          <p className="text-gray-600">Karachi, Sindh 75500</p>
          <p className="text-gray-600">Phone: +92-21-1234567</p>
          <p className="text-gray-600">Email: contact@techcorp.pk</p>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-800 mb-3 border-b border-gray-400 pb-1">BILL TO</h3>
          <p className="font-semibold text-lg">Innovate Business Ltd.</p>
          <p className="text-gray-600">Office 456, Gulberg III</p>
          <p className="text-gray-600">Lahore, Punjab 54660</p>
          <p className="text-gray-600">accounts@innovate.pk</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-8 mb-8 text-center">
        <div>
          <p className="font-bold text-gray-800">Issue Date</p>
          <p className="text-gray-600">{invoiceData.issueDate || "December 15, 2024"}</p>
        </div>
        <div>
          <p className="font-bold text-gray-800">Due Date</p>
          <p className="text-gray-600">{invoiceData.dueDate || "January 15, 2025"}</p>
        </div>
        <div>
          <p className="font-bold text-gray-800">Terms</p>
          <p className="text-gray-600">Net 30</p>
        </div>
      </div>
      
      {/* Line Items */}
      <div className="border-t border-gray-400 pt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-3 font-bold">DESCRIPTION</th>
              <th className="text-center py-3 font-bold">QTY</th>
              <th className="text-right py-3 font-bold">RATE</th>
              <th className="text-right py-3 font-bold">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-4">{item.description || "Professional Service"}</td>
                <td className="text-center py-4">{item.quantity}</td>
                <td className="text-right py-4">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="text-right py-4 font-semibold">{currencySymbol}{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80 space-y-3">
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <span className="font-semibold">Subtotal:</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <span className="font-semibold">Tax ({invoiceData.taxRate || 0}%):</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          {(invoiceData.discount || 0) > 0 && (
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold">Discount:</span>
              <span>-{currencySymbol}{(invoiceData.discount || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold border-t-2 border-gray-800 pt-3">
            <span>TOTAL DUE:</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="border-t border-gray-400 pt-6 mt-8">
        <h4 className="font-bold text-gray-800 mb-3">Payment Terms & Conditions</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Payment is due within 30 days of invoice date</p>
          <p>• Late payments may incur a 1.5% monthly service charge</p>
          <p>• Please remit payment to the address above</p>
          {invoiceData.notes && (
            <div className="mt-4">
              <p className="font-semibold">Additional Notes:</p>
              <p>{invoiceData.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
