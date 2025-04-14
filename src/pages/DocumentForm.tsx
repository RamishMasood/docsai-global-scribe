
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function DocumentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocumentById, createDocument, updateDocument } = useDocuments();
  const [document, setDocument] = useState<Partial<Document>>({
    title: "",
    description: "",
    document_type: "legal",
    content: {},
    regions: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isNew = id === "new";

  useEffect(() => {
    async function loadDocument() {
      if (!isNew && id) {
        const doc = await getDocumentById(id);
        if (doc) {
          setDocument(doc);
        } else {
          navigate("/documents");
        }
      }
      setLoading(false);
    }

    loadDocument();
  }, [id, isNew]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (
    section: string,
    field: string,
    value: string
  ) => {
    setDocument((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [section]: {
          ...(prev.content?.[section] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save documents",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const newDoc = await createDocument(document, user.id);
        if (newDoc) {
          navigate(`/documents/${newDoc.id}`);
        }
      } else if (id) {
        await updateDocument(id, document);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderFormSection = (section: string, fields: { name: string; label: string }[]) => (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="grid gap-2">
          <Label htmlFor={`${section}-${field.name}`}>{field.label}</Label>
          <Textarea
            id={`${section}-${field.name}`}
            value={document.content?.[section]?.[field.name] || ""}
            onChange={(e) => handleContentChange(section, field.name, e.target.value)}
            rows={4}
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-docsai-blue"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <RequireAuth>
      <Layout>
        <div className="container py-8">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate("/documents")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">
              {isNew ? "Create New Document" : document.title}
            </h1>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 md:col-span-1">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={document.title}
                    onChange={handleInputChange}
                    placeholder="Enter document title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={document.description}
                    onChange={handleInputChange}
                    placeholder="Enter document description"
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full bg-docsai-blue hover:bg-docsai-darkBlue"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Document
                    </div>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6 md:col-span-2">
              <Tabs defaultValue="details">
                <TabsList className="mb-4 w-full grid grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="terms">Terms</TabsTrigger>
                  <TabsTrigger value="signatures">Signatures</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  {renderFormSection("details", [
                    { name: "parties", label: "Parties Involved" },
                    { name: "effectiveDate", label: "Effective Date" },
                    { name: "purpose", label: "Purpose" },
                    { name: "scope", label: "Scope" },
                  ])}
                </TabsContent>
                <TabsContent value="terms">
                  {renderFormSection("terms", [
                    { name: "obligations", label: "Obligations" },
                    { name: "restrictions", label: "Restrictions" },
                    { name: "duration", label: "Duration" },
                    { name: "termination", label: "Termination Conditions" },
                  ])}
                </TabsContent>
                <TabsContent value="signatures">
                  {renderFormSection("signatures", [
                    { name: "party1", label: "Party 1 Signature Block" },
                    { name: "party2", label: "Party 2 Signature Block" },
                    { name: "witnesses", label: "Witnesses" },
                    { name: "date", label: "Date of Signing" },
                  ])}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </Layout>
    </RequireAuth>
  );
}
