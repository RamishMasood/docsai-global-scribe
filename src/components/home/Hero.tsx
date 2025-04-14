
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Globe } from "lucide-react";

export function Hero() {
  return (
    <div className="bg-gradient-to-b from-docsai-lightBlue to-white py-16 lg:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              <span className="text-docsai-blue">AI-Powered</span> Document Automation
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl">
              Generate professional business and legal documents for any region by answering a few simple questions. Save time and ensure compliance.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/documents">
                <Button className="w-full gap-2 bg-docsai-blue px-6 py-6 text-base hover:bg-docsai-darkBlue sm:w-auto">
                  <FileText className="h-5 w-5" />
                  Create Documents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full gap-2 border-docsai-blue px-6 py-6 text-base text-docsai-blue hover:bg-docsai-lightBlue hover:text-docsai-blue sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-20 w-20 rounded-full bg-docsai-blue/20"></div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-docsai-blue/20"></div>
              <div className="rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-docsai-blue p-1">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="font-medium">Non-Disclosure Agreement</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-docsai-darkGray" />
                    <span className="text-sm text-docsai-darkGray">United States</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">Party One:</p>
                    <p className="font-medium">Acme Corporation, Inc.</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">Party Two:</p>
                    <p className="font-medium">XYZ Ventures, LLC</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">Effective Date:</p>
                    <p className="font-medium">April 14, 2025</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">Term Length:</p>
                    <p className="font-medium">2 Years</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button className="bg-docsai-blue hover:bg-docsai-darkBlue">
                    Generate Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
