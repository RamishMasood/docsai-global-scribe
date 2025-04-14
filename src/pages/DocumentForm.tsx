import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, FileText, Globe, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock document data
const documents = {
  nda: {
    title: "Non-Disclosure Agreement",
    description: "Protect your confidential information when sharing with other parties.",
    regions: ["United States", "European Union", "United Kingdom", "Canada", "Australia", "India"],
    fields: [
      { id: "partyOne", label: "Party One (Disclosing Party)", type: "text", required: true },
      { id: "partyOneAddress", label: "Party One Address", type: "textarea", required: true },
      { id: "partyTwo", label: "Party Two (Receiving Party)", type: "text", required: true },
      { id: "partyTwoAddress", label: "Party Two Address", type: "textarea", required: true },
      { id: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true },
      { id: "term", label: "Term Length (Years)", type: "select", options: ["1", "2", "3", "5", "10"], required: true }
    ]
  },
  employment: {
    title: "Employment Contract",
    description: "Standard employment agreement for hiring new employees.",
    regions: ["United States", "Canada", "United Kingdom", "Australia", "India"],
    fields: [
      { id: "employerName", label: "Employer Name", type: "text", required: true },
      { id: "employerAddress", label: "Employer Address", type: "textarea", required: true },
      { id: "employeeName", label: "Employee Name", type: "text", required: true },
      { id: "employeeAddress", label: "Employee Address", type: "textarea", required: true },
      { id: "position", label: "Job Title/Position", type: "text", required: true },
      { id: "startDate", label: "Start Date", type: "date", required: true },
      { id: "salary", label: "Annual Salary", type: "text", required: true },
      { id: "benefits", label: "Benefits", type: "textarea", required: false },
      { id: "workHours", label: "Work Hours", type: "text", required: true },
      { id: "terminationNotice", label: "Termination Notice Period (Months)", type: "select", options: ["1", "2", "3", "6"], required: true }
    ]
  },
  partnership: {
    title: "Partnership Agreement",
    description: "Define the terms of a business partnership between two or more parties.",
    regions: ["Global", "United States", "Canada", "United Kingdom"],
    fields: [
      { id: "partnershipName", label: "Partnership Name", type: "text", required: true },
      { id: "partnerOneName", label: "Partner One Name", type: "text", required: true },
      { id: "partnerOneAddress", label: "Partner One Address", type: "textarea", required: true },
      { id: "partnerTwoName", label: "Partner Two Name", type: "text", required: true },
      { id: "partnerTwoAddress", label: "Partner Two Address", type: "textarea", required: true },
      { id: "businessPurpose", label: "Business Purpose", type: "textarea", required: true },
      { id: "capitalContributionOne", label: "Capital Contribution (Partner One)", type: "text", required: true },
      { id: "capitalContributionTwo", label: "Capital Contribution (Partner Two)", type: "text", required: true },
      { id: "profitSharingOne", label: "Profit Sharing % (Partner One)", type: "text", required: true },
      { id: "profitSharingTwo", label: "Profit Sharing % (Partner Two)", type: "text", required: true },
      { id: "startDate", label: "Partnership Start Date", type: "date", required: true },
      { id: "term", label: "Partnership Term (Years)", type: "select", options: ["1", "2", "3", "5", "10", "Indefinite"], required: true }
    ]
  },
  rent: {
    title: "Rental Agreement",
    description: "Lease agreement for residential or commercial property rental.",
    regions: ["United States", "Canada", "United Kingdom", "Australia"],
    fields: [
      { id: "landlordName", label: "Landlord Name", type: "text", required: true },
      { id: "landlordAddress", label: "Landlord Address", type: "textarea", required: true },
      { id: "tenantName", label: "Tenant Name", type: "text", required: true },
      { id: "tenantAddress", label: "Tenant Address", type: "textarea", required: true },
      { id: "propertyAddress", label: "Property Address", type: "textarea", required: true },
      { id: "propertyType", label: "Property Type", type: "select", options: ["Residential", "Commercial"], required: true },
      { id: "leaseStart", label: "Lease Start Date", type: "date", required: true },
      { id: "leaseTerm", label: "Lease Term (Months)", type: "select", options: ["6", "12", "24", "36"], required: true },
      { id: "monthlyRent", label: "Monthly Rent", type: "text", required: true },
      { id: "securityDeposit", label: "Security Deposit", type: "text", required: true },
      { id: "paymentDue", label: "Rent Payment Due Day", type: "select", options: ["1st", "5th", "10th", "15th"], required: true },
      { id: "utilities", label: "Utilities Included", type: "textarea", required: false }
    ]
  },
  invoice: {
    title: "Invoice Template",
    description: "Professional invoice for billing clients and customers.",
    regions: ["Global", "United States", "European Union", "United Kingdom"],
    isPremium: true,
    fields: [
      { id: "companyName", label: "Your Company Name", type: "text", required: true },
      { id: "companyAddress", label: "Your Company Address", type: "textarea", required: true },
      { id: "companyContact", label: "Your Company Contact", type: "text", required: true },
      { id: "clientName", label: "Client Name", type: "text", required: true },
      { id: "clientAddress", label: "Client Address", type: "textarea", required: true },
      { id: "clientContact", label: "Client Contact", type: "text", required: false },
      { id: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
      { id: "invoiceDate", label: "Invoice Date", type: "date", required: true },
      { id: "dueDate", label: "Due Date", type: "date", required: true },
      { id: "paymentTerms", label: "Payment Terms", type: "select", options: ["Due on Receipt", "Net 15", "Net 30", "Net 60"], required: true },
      { id: "currency", label: "Currency", type: "select", options: ["USD", "EUR", "GBP", "CAD", "AUD", "INR"], required: true },
      { id: "items", label: "Invoice Items (Description, Quantity, Unit Price)", type: "textarea", required: true },
      { id: "taxRate", label: "Tax Rate (%)", type: "text", required: false },
      { id: "notes", label: "Additional Notes", type: "textarea", required: false }
    ]
  },
  consulting: {
    title: "Consulting Agreement",
    description: "Contract for providing consulting or professional services.",
    regions: ["Global", "United States", "Canada", "United Kingdom", "Australia"],
    isPremium: true,
    fields: [
      { id: "clientName", label: "Client Name", type: "text", required: true },
      { id: "clientAddress", label: "Client Address", type: "textarea", required: true },
      { id: "consultantName", label: "Consultant Name", type: "text", required: true },
      { id: "consultantAddress", label: "Consultant Address", type: "textarea", required: true },
      { id: "servicesDescription", label: "Services Description", type: "textarea", required: true },
      { id: "startDate", label: "Start Date", type: "date", required: true },
      { id: "endDate", label: "End Date", type: "date", required: false },
      { id: "compensationAmount", label: "Compensation Amount", type: "text", required: true },
      { id: "compensationType", label: "Compensation Type", type: "select", options: ["Hourly", "Fixed Fee", "Monthly Retainer"], required: true },
      { id: "paymentSchedule", label: "Payment Schedule", type: "select", options: ["Weekly", "Bi-Weekly", "Monthly", "Upon Completion"], required: true },
      { id: "expenses", label: "Expense Reimbursement Terms", type: "textarea", required: false },
      { id: "confidentiality", label: "Confidentiality Terms", type: "textarea", required: false },
      { id: "intellectualProperty", label: "Intellectual Property Terms", type: "select", options: ["Owned by Client", "Owned by Consultant", "Joint Ownership"], required: true },
      { id: "terminationNotice", label: "Termination Notice Period (Days)", type: "select", options: ["15", "30", "60", "90"], required: true }
    ]
  }
};

export default function DocumentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedRegion, setSelectedRegion] = useState("United States");
  const [activeTab, setActiveTab] = useState("form");
  
  // Default to the first document if ID is invalid
  const documentId = id && documents[id as keyof typeof documents] ? id : "nda";
  const document = documents[documentId as keyof typeof documents];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateDocument = () => {
    // In a real app, this would send the data to the backend to generate a document
    console.log("Generating document with:", { documentId, region: selectedRegion, ...formData });
    // Simulate document generation
    setActiveTab("preview");
  };

  const renderFormField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <div className="mb-4" key={field.id}>
            <Label htmlFor={field.id} className="mb-1 block">
              {field.label}{field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
      case "textarea":
        return (
          <div className="mb-4" key={field.id}>
            <Label htmlFor={field.id} className="mb-1 block">
              {field.label}{field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
      case "date":
        return (
          <div className="mb-4" key={field.id}>
            <Label htmlFor={field.id} className="mb-1 block">
              {field.label}{field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        );
      case "select":
        return (
          <div className="mb-4" key={field.id}>
            <Label htmlFor={field.id} className="mb-1 block">
              {field.label}{field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-4 gap-2 text-gray-600"
          onClick={() => navigate("/documents")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Documents
        </Button>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <p className="text-gray-600">{document.description}</p>
          </div>

          <div className="mt-4 flex items-center gap-2 md:mt-0">
            <Globe className="h-4 w-4 text-gray-500" />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {document.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="mt-0 border-none p-0 shadow-none">
            <Card>
              <CardContent className="pt-6">
                {document.fields.map(renderFormField)}

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={handleGenerateDocument}
                    className="bg-docsai-blue hover:bg-docsai-darkBlue"
                  >
                    Generate Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-0 border-none p-0 shadow-none">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-end gap-2">
                  <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                  <Button className="gap-2 bg-docsai-blue hover:bg-docsai-darkBlue">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold uppercase">{document.title}</h2>
                    <Separator className="mx-auto my-4 w-1/4" />
                  </div>

                  <div className="space-y-6">
                    <p className="mb-4">
                      <strong>THIS {document.title.toUpperCase()}</strong> is made as of{" "}
                      {formData.effectiveDate || formData.startDate || "[DATE]"} by and between:
                    </p>

                    {formData.partyOne && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.partyOne}</p>
                        <p>{formData.partyOneAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "First Party")
                        </p>
                      </div>
                    )}

                    {formData.partyTwo && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.partyTwo}</p>
                        <p>{formData.partyTwoAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "Second Party")
                        </p>
                      </div>
                    )}

                    {(formData.employerName || formData.clientName) && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.employerName || formData.clientName}</p>
                        <p>{formData.employerAddress || formData.clientAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "{formData.employerName ? "Employer" : "Client"}")
                        </p>
                      </div>
                    )}

                    {(formData.employeeName || formData.consultantName) && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.employeeName || formData.consultantName}</p>
                        <p>{formData.employeeAddress || formData.consultantAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "{formData.employeeName ? "Employee" : "Consultant"}")
                        </p>
                      </div>
                    )}

                    {formData.landlordName && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.landlordName}</p>
                        <p>{formData.landlordAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "Landlord")
                        </p>
                      </div>
                    )}

                    {formData.tenantName && (
                      <div className="mb-4">
                        <p className="font-semibold">{formData.tenantName}</p>
                        <p>{formData.tenantAddress || "[ADDRESS]"}</p>
                        <p className="mt-2 italic">
                          (hereinafter referred to as the "Tenant")
                        </p>
                      </div>
                    )}

                    {formData.purpose && (
                      <div className="mb-4">
                        <p className="font-semibold">Purpose:</p>
                        <p>{formData.purpose}</p>
                      </div>
                    )}

                    {formData.servicesDescription && (
                      <div className="mb-4">
                        <p className="font-semibold">Services Description:</p>
                        <p>{formData.servicesDescription}</p>
                      </div>
                    )}

                    {formData.term && (
                      <div className="mb-4">
                        <p className="font-semibold">Term:</p>
                        <p>{formData.term} {parseInt(formData.term) === 1 ? "year" : "years"}</p>
                      </div>
                    )}

                    <p className="text-gray-500">
                      [Additional clauses and sections would be generated based on the document type and provided information]
                    </p>

                    <div className="mt-8">
                      <p className="mb-4 font-semibold">IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</p>
                      
                      <div className="mt-12 grid grid-cols-2 gap-12">
                        <div>
                          <p className="mb-8 border-b border-gray-400 pb-2">Signature</p>
                          <p className="font-medium">
                            {formData.partyOne || formData.employerName || formData.landlordName || formData.clientName || "First Party"}
                          </p>
                        </div>
                        <div>
                          <p className="mb-8 border-b border-gray-400 pb-2">Signature</p>
                          <p className="font-medium">
                            {formData.partyTwo || formData.employeeName || formData.tenantName || formData.consultantName || "Second Party"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("form")}>
                    Back to Form
                  </Button>
                  <Button className="gap-2 bg-docsai-blue hover:bg-docsai-darkBlue">
                    <Download className="h-4 w-4" />
                    Download Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
