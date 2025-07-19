import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { CURRENCIES, TEMPLATES, type InvoiceWithDetails, type InsertInvoice } from "@shared/schema";
import TemplateGallery from "@/components/template-gallery";
import InvoiceForm from "@/components/invoice-form";
import LineItems from "@/components/line-items";
import InvoicePreview from "@/components/invoice-preview";
import { generatePDF } from "@/lib/pdf-generator";
import { 
  File, 
  Palette, 
  Users, 
  ChartLine, 
  Settings, 
  Plus, 
  Eye, 
  Download, 
  Save,
  ArrowLeft,
  Home
} from "lucide-react";

export default function InvoiceGenerator() {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");
  const [selectedTemplate, setSelectedTemplate] = useState("minimalist");
  const [invoiceData, setInvoiceData] = useState<Partial<InsertInvoice>>({
    number: `INV-${String(Date.now()).slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: "PKR",
    template: "minimalist",
    companyId: 1,
    clientId: 1,
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discount: 0,
    total: 0,
    lineItems: []
  });

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["/api/invoices", id],
    enabled: !!id,
  });

  const { data: currencyRates } = useQuery({
    queryKey: ["/api/currency/rates"],
  });

  const saveInvoiceMutation = useMutation({
    mutationFn: async (data: InsertInvoice) => {
      if (id) {
        const response = await apiRequest("PUT", `/api/invoices/${id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/invoices", data);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save invoice",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
      setSelectedTemplate(invoice.template);
      setSelectedCurrency(invoice.currency);
    }
  }, [invoice]);

  const handleSave = () => {
    // Save functionality disabled in preview mode
    toast({
      title: "Preview Mode",
      description: "Save functionality coming soon with database integration",
      variant: "default",
    });
  };

  const handlePreview = () => {
    // Implement preview modal functionality
    toast({
      title: "Preview",
      description: "Preview functionality coming soon",
    });
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(invoiceData as InvoiceWithDetails, selectedTemplate);
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <File className="text-white" size={16} />
            </div>
            <span className="text-xl font-semibold text-gray-900">InvoiceGen Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50 bg-blue-50 text-primary">
                <Home size={18} />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50">
                <File size={18} />
                <span>Invoices</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50">
                <Palette size={18} />
                <span>Templates</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50">
                <Users size={18} />
                <span>Clients</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50">
                <ChartLine size={18} />
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 text-gray-700 p-3 rounded-lg hover:bg-gray-50">
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button className="w-full" onClick={() => setInvoiceData({
            ...invoiceData,
            number: `INV-${String(Date.now()).slice(-6)}`,
            lineItems: []
          })}>
            <Plus className="mr-2" size={16} />
            New Invoice
          </Button>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">💡 Preview Mode</p>
            <p className="text-xs text-blue-600 mt-1">Save & database features coming soon</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Invoice Generator</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {TEMPLATES.length} Templates Available
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Preview Mode
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Invoices
                </Button>
                <div className="text-sm text-gray-500">
                  Live preview mode
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handlePreview}>
                  <Eye className="mr-2" size={16} />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="mr-2" size={16} />
                  Download PDF
                </Button>
                <Button 
                  size="sm" 
                  disabled={true}
                  className="opacity-50 cursor-not-allowed"
                  title="Save functionality coming soon - database integration planned"
                >
                  <Save className="mr-2" size={16} />
                  Save Invoice (Coming Soon)
                </Button>
              </div>
            </div>

            {/* Main Editor Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel */}
              <div className="space-y-6">
                <TemplateGallery 
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                />
                
                <InvoiceForm 
                  invoiceData={invoiceData}
                  onInvoiceDataChange={setInvoiceData}
                  selectedCurrency={selectedCurrency}
                />
                
                <LineItems 
                  lineItems={invoiceData.lineItems || []}
                  onLineItemsChange={(lineItems) => setInvoiceData({ ...invoiceData, lineItems })}
                  currency={selectedCurrency}
                />
              </div>

              {/* Right Panel */}
              <InvoicePreview 
                invoiceData={invoiceData}
                template={selectedTemplate}
                currency={selectedCurrency}
              />
            </div>

            {/* Template Gallery Section */}
            <div className="mt-12">
              <TemplateGallery 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={setSelectedTemplate}
                showFullGallery
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
