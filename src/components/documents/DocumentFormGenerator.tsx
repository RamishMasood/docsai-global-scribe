import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Document } from "@/hooks/useDocuments";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, Save } from "lucide-react";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { toast } from "sonner";

interface DocumentFormGeneratorProps {
  document: Document;
  onSave: (content: any) => void;
  readOnly?: boolean;
}

export function DocumentFormGenerator({ document, onSave, readOnly = false }: DocumentFormGeneratorProps) {
  const [formContent, setFormContent] = useState<any>(document.content || {});

  useEffect(() => {
    setFormContent(document.content || {});
  }, [document]);

  const handleInputChange = (section: string, field: string, value: string) => {
    if (readOnly) return;
    
    setFormContent((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleDateChange = (section: string, field: string, date: Date | undefined) => {
    if (readOnly) return;
    
    setFormContent((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: date ? date.toISOString().split('T')[0] : ''
      }
    }));
  };

  const handleItemsChange = (items: any[]) => {
    if (readOnly) return;
    
    setFormContent((prev: any) => ({
      ...prev,
      items
    }));
  };

  const handleSave = () => {
    onSave(formContent);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add document title
    doc.setFontSize(20);
    doc.text(document.title, 20, 20);
    
    // Add company info if available
    doc.setFontSize(12);
    doc.text(document.description, 20, 30);
    
    let yPos = 50;
    
    // Add document content
    Object.keys(formContent).forEach(section => {
      // Add section title
      doc.setFontSize(14);
      doc.text(section.charAt(0).toUpperCase() + section.slice(1), 20, yPos);
      yPos += 10;
      
      // Add section content
      doc.setFontSize(10);
      const sectionData = formContent[section];
      
      if (section === 'items' && Array.isArray(sectionData)) {
        const tableData = sectionData.map(item => [
          item.description || '',
          item.quantity || '',
          item.price || '',
          ((parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2))
        ]);
        
        (doc as any).autoTable({
          startY: yPos,
          head: [['Description', 'Quantity', 'Price', 'Total']],
          body: tableData,
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 10;
      } else if (typeof sectionData === 'object') {
        Object.keys(sectionData).forEach(field => {
          const fieldText = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${sectionData[field] || ''}`;
          doc.text(fieldText, 20, yPos);
          yPos += 6;
          
          // Add new page if needed
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      yPos += 10;
    });
    
    // Save document
    doc.save(`${document.title}.pdf`);
    toast(`${document.title}.pdf has been downloaded`);
  };

  const renderNdaForm = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Parties & Purpose</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="parties">Parties Involved</Label>
              <Input
                id="parties"
                placeholder="Enter names of all parties involved"
                value={formContent.details?.parties || ''}
                onChange={(e) => handleInputChange('details', 'parties', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <DatePicker
                value={formContent.details?.effectiveDate ? new Date(formContent.details.effectiveDate) : undefined}
                onChange={(date) => handleDateChange('details', 'effectiveDate', date)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Describe the purpose of this NDA"
                value={formContent.details?.purpose || ''}
                onChange={(e) => handleInputChange('details', 'purpose', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="scope">Scope of Confidential Information</Label>
              <Textarea
                id="scope"
                placeholder="Define what is considered confidential information"
                value={formContent.details?.scope || ''}
                onChange={(e) => handleInputChange('details', 'scope', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Terms</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="obligations">Obligations</Label>
              <Textarea
                id="obligations"
                placeholder="Describe obligations of receiving party"
                value={formContent.terms?.obligations || ''}
                onChange={(e) => handleInputChange('terms', 'obligations', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="restrictions">Restrictions</Label>
              <Textarea
                id="restrictions"
                placeholder="List any restrictions on use of information"
                value={formContent.terms?.restrictions || ''}
                onChange={(e) => handleInputChange('terms', 'restrictions', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="Duration of the agreement (e.g., 3 years)"
                value={formContent.terms?.duration || ''}
                onChange={(e) => handleInputChange('terms', 'duration', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="termination">Termination Conditions</Label>
              <Textarea
                id="termination"
                placeholder="Conditions under which the agreement can be terminated"
                value={formContent.terms?.termination || ''}
                onChange={(e) => handleInputChange('terms',  'termination', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Signatures</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="party1">Party 1</Label>
              <Input
                id="party1"
                placeholder="Full name of first party"
                value={formContent.signatures?.party1 || ''}
                onChange={(e) => handleInputChange('signatures', 'party1', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="party2">Party 2</Label>
              <Input
                id="party2"
                placeholder="Full name of second party"
                value={formContent.signatures?.party2 || ''}
                onChange={(e) => handleInputChange('signatures', 'party2', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                id="witnesses"
                placeholder="Names of witnesses (if any)"
                value={formContent.signatures?.witnesses || ''}
                onChange={(e) => handleInputChange('signatures', 'witnesses', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="date">Signature Date</Label>
              <DatePicker
                value={formContent.signatures?.date ? new Date(formContent.signatures.date) : undefined}
                onChange={(date) => handleDateChange('signatures', 'date', date)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEmploymentContractForm = () => (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Contract Details</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="employer">Employer</Label>
              <Input
                id="employer"
                placeholder="Employer name"
                value={formContent.details?.employer || ''}
                onChange={(e) => handleInputChange('details', 'employer', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Input
                id="employee"
                placeholder="Employee name"
                value={formContent.details?.employee || ''}
                onChange={(e) => handleInputChange('details', 'employee', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="Job title/position"
                value={formContent.details?.position || ''}
                onChange={(e) => handleInputChange('details', 'position', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                value={formContent.details?.startDate ? new Date(formContent.details.startDate) : undefined}
                onChange={(date) => handleDateChange('details', 'startDate', date)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Terms of Employment</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="duties">Duties and Responsibilities</Label>
              <Textarea
                id="duties"
                placeholder="Detailed description of job duties"
                value={formContent.terms?.duties || ''}
                onChange={(e) => handleInputChange('terms', 'duties', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="compensation">Compensation</Label>
              <Textarea
                id="compensation"
                placeholder="Salary, payment terms, etc."
                value={formContent.terms?.compensation || ''}
                onChange={(e) => handleInputChange('terms', 'compensation', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="Health insurance, retirement plans, etc."
                value={formContent.terms?.benefits || ''}
                onChange={(e) => handleInputChange('terms', 'benefits', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="termination">Termination Conditions</Label>
              <Textarea
                id="termination"
                placeholder="Notice periods, grounds for termination, etc."
                value={formContent.terms?.termination || ''}
                onChange={(e) => handleInputChange('terms', 'termination', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Signatures</h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="employer">Employer Signature</Label>
              <Input
                id="employer"
                placeholder="Employer name/signature"
                value={formContent.signatures?.employer || ''}
                onChange={(e) => handleInputChange('signatures', 'employer', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="employee">Employee Signature</Label>
              <Input
                id="employee"
                placeholder="Employee name/signature"
                value={formContent.signatures?.employee || ''}
                onChange={(e) => handleInputChange('signatures', 'employee', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                id="witnesses"
                placeholder="Names of witnesses (if any)"
                value={formContent.signatures?.witnesses || ''}
                onChange={(e) => handleInputChange('signatures', 'witnesses', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="date">Signature Date</Label>
              <DatePicker
                value={formContent.signatures?.date ? new Date(formContent.signatures.date) : undefined}
                onChange={(date) => handleDateChange('signatures', 'date', date)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoiceForm = () => {
    // Calculate totals for invoice items
    const items = formContent.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0)), 0);
    const taxRate = parseFloat(formContent.terms?.taxRate || 0) / 100;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="from">From</Label>
                <Textarea
                  id="from"
                  placeholder="Your business name and address"
                  value={formContent.details?.from || ''}
                  onChange={(e) => handleInputChange('details', 'from', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Textarea
                  id="to"
                  placeholder="Client name and address"
                  value={formContent.details?.to || ''}
                  onChange={(e) => handleInputChange('details', 'to', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  placeholder="Invoice number"
                  value={formContent.details?.invoiceNumber || ''}
                  onChange={(e) => handleInputChange('details', 'invoiceNumber', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="date">Invoice Date</Label>
                <DatePicker
                  value={formContent.details?.date ? new Date(formContent.details.date) : undefined}
                  onChange={(date) => handleDateChange('details', 'date', date)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Items</h3>
              {!readOnly && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const newItems = [...(formContent.items || []), { description: '', quantity: 1, price: 0 }];
                    handleItemsChange(newItems);
                  }}
                >
                  Add Item
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {(formContent.items || []).map((item: any, index: number) => (
                <div key={index} className="grid gap-3 md:grid-cols-12 items-end border-b pb-3">
                  <div className="md:col-span-6">
                    <Label htmlFor={`item-${index}-desc`}>Description</Label>
                    <Input
                      id={`item-${index}-desc`}
                      placeholder="Item description"
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...(formContent.items || [])];
                        newItems[index].description = e.target.value;
                        handleItemsChange(newItems);
                      }}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`item-${index}-qty`}>Quantity</Label>
                    <Input
                      id={`item-${index}-qty`}
                      type="number"
                      placeholder="Qty"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const newItems = [...(formContent.items || [])];
                        newItems[index].quantity = e.target.value;
                        handleItemsChange(newItems);
                      }}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`item-${index}-price`}>Price</Label>
                    <Input
                      id={`item-${index}-price`}
                      type="number"
                      placeholder="Price"
                      value={item.price || ''}
                      onChange={(e) => {
                        const newItems = [...(formContent.items || [])];
                        newItems[index].price = e.target.value;
                        handleItemsChange(newItems);
                      }}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-right font-medium">
                      ${(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}
                    </p>
                  </div>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        const newItems = [...(formContent.items || [])];
                        newItems.splice(index, 1);
                        handleItemsChange(newItems);
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-2 text-right">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax Rate</span>
                <div className="w-20">
                  <Input
                    type="number"
                    placeholder="0%"
                    value={formContent.terms?.taxRate || '0'}
                    onChange={(e) => handleInputChange('terms', 'taxRate', e.target.value)}
                    disabled={readOnly}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Terms</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  placeholder="Payment due within 30 days"
                  value={formContent.terms?.paymentTerms || ''}
                  onChange={(e) => handleInputChange('terms', 'paymentTerms', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="latePayment">Late Payment Policy</Label>
                <Textarea
                  id="latePayment"
                  placeholder="Late payment penalties or interest charges"
                  value={formContent.terms?.latePayment || ''}
                  onChange={(e) => handleInputChange('terms', 'latePayment', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or information"
                  value={formContent.terms?.notes || ''}
                  onChange={(e) => handleInputChange('terms', 'notes', e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderForm = () => {
    switch (document.document_type) {
      case 'nda':
        return renderNdaForm();
      case 'employment_contract':
        return renderEmploymentContractForm();
      case 'invoice':
        return renderInvoiceForm();
      default:
        // For other document types, provide a generic form
        return (
          <div>
            <p className="text-center text-gray-500 my-8">
              This document type is currently in development. A generic form is shown below.
            </p>
            {Object.entries(formContent).map(([section, fields]: [string, any]) => (
              <Card key={section} className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                  <div className="grid gap-4">
                    {Object.entries(fields).map(([field, value]: [string, any]) => (
                      <div key={field}>
                        <Label htmlFor={`${section}-${field}`}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                        <Input
                          id={`${section}-${field}`}
                          value={value || ''}
                          onChange={(e) => handleInputChange(section, field, e.target.value)}
                          disabled={readOnly}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderForm()}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={generatePDF}
        >
          <Download size={16} />
          Download PDF
        </Button>
        
        {!readOnly && (
          <Button onClick={handleSave} className="bg-docsai-blue hover:bg-docsai-darkBlue gap-2">
            <Save size={16} />
            Save Document
          </Button>
        )}
      </div>
    </div>
  );
}
