import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@shared/schema";
import { ArrowRight } from "lucide-react";

interface TemplateGalleryProps {
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
  showFullGallery?: boolean;
}

export default function TemplateGallery({ selectedTemplate, onTemplateSelect, showFullGallery }: TemplateGalleryProps) {
  const displayTemplates = showFullGallery ? TEMPLATES : TEMPLATES.slice(0, 4);

  const renderTemplatePreview = (template: typeof TEMPLATES[0]) => {
    switch (template.id) {
      case "minimalist":
        return (
          <div className="aspect-[3/4] bg-white rounded border mb-2 p-2 text-xs">
            <div className="h-2 bg-gray-900 mb-1"></div>
            <div className="h-1 bg-gray-400 w-2/3 mb-2"></div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300"></div>
              <div className="h-1 bg-gray-300 w-3/4"></div>
            </div>
          </div>
        );
      case "gradient":
        return (
          <div className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded border mb-2 p-2 text-xs">
            <div className="h-2 bg-white bg-opacity-90 mb-1 rounded"></div>
            <div className="h-1 bg-white bg-opacity-70 w-2/3 mb-2 rounded"></div>
            <div className="space-y-1">
              <div className="h-1 bg-white bg-opacity-60 rounded"></div>
              <div className="h-1 bg-white bg-opacity-60 w-3/4 rounded"></div>
            </div>
          </div>
        );
      case "grid":
        return (
          <div className="aspect-[3/4] bg-white rounded border mb-2 p-2 text-xs">
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="h-1 bg-blue-600"></div>
              <div className="h-1 bg-blue-600"></div>
              <div className="h-1 bg-blue-600"></div>
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1">
                <div className="h-1 bg-gray-300"></div>
                <div className="h-1 bg-gray-300"></div>
                <div className="h-1 bg-gray-300"></div>
              </div>
            </div>
          </div>
        );
      case "classic":
        return (
          <div className="aspect-[3/4] bg-white rounded border mb-2 p-2 text-xs">
            <div className="text-center mb-2">
              <div className="h-1 bg-gray-800 w-1/2 mx-auto mb-1"></div>
              <div className="h-1 bg-gray-600 w-1/3 mx-auto"></div>
            </div>
            <div className="border-t border-gray-300 pt-1">
              <div className="h-1 bg-gray-300 mb-1"></div>
              <div className="h-1 bg-gray-300 w-3/4"></div>
            </div>
          </div>
        );
      case "freelance":
        return (
          <div className="aspect-[3/4] bg-green-50 rounded border border-green-200 mb-2 p-2 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="text-right">
                <div className="h-1 bg-green-600 w-4"></div>
              </div>
            </div>
            <div className="bg-white rounded p-1 shadow-sm">
              <div className="h-1 bg-gray-300"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (showFullGallery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All Invoice Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id}
                className={`template-showcase group cursor-pointer ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onTemplateSelect(template.id)}
              >
                <div className="group-hover:shadow-lg transition-shadow">
                  {renderTemplatePreview(template)}
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Compare Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Best for Tech/Startups</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Minimalist Corporate</li>
                  <li>• Modern Gradient</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Best for Enterprise</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Grid Tabular</li>
                  <li>• Classic Business</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Best for Freelancers</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Freelance/Service</li>
                  <li>• Modern Gradient</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {displayTemplates.map((template) => (
            <div 
              key={template.id}
              className={`template-card cursor-pointer border-2 rounded-lg p-3 transition-all hover:shadow-md ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              {renderTemplatePreview(template)}
              <span className="text-xs font-medium text-gray-900">{template.name}</span>
            </div>
          ))}
        </div>
        
        <Button variant="link" className="text-sm p-0">
          View all templates <ArrowRight className="ml-1" size={14} />
        </Button>
      </CardContent>
    </Card>
  );
}
