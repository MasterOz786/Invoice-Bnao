import { CURRENCIES, type InsertInvoice } from "@shared/schema";

interface GridTemplateProps {
  invoiceData: Partial<InsertInvoice>;
  currency: string;
}

export default function GridTemplate({ invoiceData, currency }: GridTemplateProps) {
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || "₨";
  const lineItems = invoiceData.lineItems || [];
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * (invoiceData.taxRate || 0)) / 100;
  const total = subtotal + taxAmount - (invoiceData.discount || 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">INVOICE</h1>
        <p className="text-gray-600">#{invoiceData.number || "INV-001"}</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-2"></div>
      </div>

      {/* Company and Client in Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-600 mb-3">FROM</h3>
          <p className="font-semibold">TechCorp Solutions</p>
          <p className="text-gray-600 text-sm">Plot 123, DHA Phase 6</p>
          <p className="text-gray-600 text-sm">Karachi, Sindh 75500</p>
          <p className="text-gray-600 text-sm">contact@techcorp.pk</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-600 mb-3">BILL TO</h3>
          <p className="font-semibold">Innovate Business Ltd.</p>
          <p className="text-gray-600 text-sm">Office 456, Gulberg III</p>
          <p className="text-gray-600 text-sm">Lahore, Punjab 54660</p>
          <p className="text-gray-600 text-sm">accounts@innovate.pk</p>
        </div>
      </div>

      {/* Invoice Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-3 rounded text-center">
          <p className="text-blue-600 font-medium text-sm">ISSUE DATE</p>
          <p className="font-semibold">{invoiceData.issueDate || "Dec 15, 2024"}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded text-center">
          <p className="text-blue-600 font-medium text-sm">DUE DATE</p>
          <p className="font-semibold">{invoiceData.dueDate || "Jan 15, 2025"}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded text-center">
          <p className="text-blue-600 font-medium text-sm">CURRENCY</p>
          <p className="font-semibold">{currency}</p>
        </div>
      </div>
      
      {/* Line Items Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white">
          <div className="grid grid-cols-4 gap-4 p-4 font-medium">
            <div>DESCRIPTION</div>
            <div className="text-center">QUANTITY</div>
            <div className="text-right">RATE</div>
            <div className="text-right">AMOUNT</div>
          </div>
        </div>
        
        <div className="bg-white">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 last:border-b-0">
              <div className="font-medium">{item.description || "Service"}</div>
              <div className="text-center">{item.quantity}</div>
              <div className="text-right">{currencySymbol}{item.rate.toFixed(2)}</div>
              <div className="text-right font-semibold">{currencySymbol}{item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Totals Grid */}
      <div className="flex justify-end">
        <div className="w-80">
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Subtotal:</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-right">
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Tax ({invoiceData.taxRate || 0}%):</span>
            </div>
            <div className="bg-gray-50 p-3 rounded text-right">
              <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
            </div>
            
            {(invoiceData.discount || 0) > 0 && (
              <>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-medium">Discount:</span>
                </div>
                <div className="bg-gray-50 p-3 rounded text-right">
                  <span>-{currencySymbol}{(invoiceData.discount || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-600 text-white p-4 rounded font-bold">
              TOTAL:
            </div>
            <div className="bg-blue-600 text-white p-4 rounded text-right font-bold">
              {currencySymbol}{total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
          <p className="text-sm text-gray-600">{invoiceData.notes}</p>
        </div>
      )}
    </div>
  );
}
