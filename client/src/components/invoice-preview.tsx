import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { type InsertInvoice } from "@shared/schema";
import MinimalistTemplate from "./templates/minimalist";
import GradientTemplate from "./templates/gradient";
import GridTemplate from "./templates/grid";
import ClassicTemplate from "./templates/classic";
import FreelanceTemplate from "./templates/freelance";

interface InvoicePreviewProps {
  invoiceData: Partial<InsertInvoice>;
  template: string;
  currency: string;
}

export default function InvoicePreview({ invoiceData, template, currency }: InvoicePreviewProps) {
  const renderTemplate = () => {
    const props = { invoiceData, currency };
    
    switch (template) {
      case "minimalist":
        return <MinimalistTemplate {...props} />;
      case "gradient":
        return <GradientTemplate {...props} />;
      case "grid":
        return <GridTemplate {...props} />;
      case "classic":
        return <ClassicTemplate {...props} />;
      case "freelance":
        return <FreelanceTemplate {...props} />;
      default:
        return <MinimalistTemplate {...props} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Preview</CardTitle>
            <p className="text-xs text-gray-500 mt-1">Real-time template preview</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm text-gray-500">100%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-4 max-h-[800px] overflow-auto">
          <div className="bg-white shadow-sm max-w-2xl mx-auto invoice-preview" style={{ aspectRatio: "8.5/11" }}>
            {renderTemplate()}
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-xs text-blue-700">
              💡 This is a live preview. Changes are reflected instantly as you edit.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Save functionality with database persistence coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
