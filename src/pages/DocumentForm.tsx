import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useSubscription } from "@/hooks/useSubscription";
import { DocumentFormGenerator } from "@/components/documents/DocumentFormGenerator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export default function DocumentForm() {
  const { id } = useParams<{ id: string }>();
  const [documentData, setDocumentData] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { getDocumentById, createDocument, updateDocument, documents, fetchUserDocuments } = useDocuments();
  const { hasAccess, subscription } = useSubscription(user?.id);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Load document data
  useEffect(() => {
    const loadDocument = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const doc = await getDocumentById(id);
        
        if (doc) {
          setDocumentData(doc);
        } else {
          setError("Document not found");
          toast.error("Document not found");
        }
      } catch (err) {
        console.error("Error loading document:", err);
        setError("Failed to load document");
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id, getDocumentById]);

  // Ensure user documents are loaded (for document count)
  useEffect(() => {
    if (user) {
      fetchUserDocuments(user.id);
    }
  }, [user, fetchUserDocuments]);

  const handleSaveDocument = async (content: any) => {
    if (!user) {
      toast.error("Please sign in to save this document");
      navigate("/login");
      return;
    }

    if (!documentData) return;

    setIsSaving(true);

    // Check if premium access is required
    if (documentData.is_premium && !hasAccess(documentData.pricing_tier)) {
      setIsSaving(false);
      toast.error("Subscription required", {
        description: `This is a ${documentData.pricing_tier} document. Please upgrade your subscription.`
      });
      navigate("/pricing");
      return;
    }

    // Check free user document limit (only for new documents)
    const isNewDocumentFromTemplate = documentData.user_id === "00000000-0000-0000-0000-000000000000";
    if (isNewDocumentFromTemplate && subscription?.tier === "free" && documents.length >= 3) {
      setIsSaving(false);
      toast.error("Free plan limit reached", {
        description: "You can only create up to 3 documents with the free plan. Please upgrade to create more."
      });
      navigate("/pricing");
      return;
    }

    try {
      // If document belongs to template (public user), create new document
      if (isNewDocumentFromTemplate) {
        const newDoc = await createDocument({
          title: documentData.title,
          description: documentData.description,
          document_type: documentData.document_type,
          content,
          regions: documentData.regions,
          is_premium: false, // User's created document is not premium
        }, user.id);

        if (newDoc) {
          toast.success("Document created successfully!");
          navigate(`/documents/${newDoc.id}`);
        } else {
          toast.error("Failed to create document");
        }
      } else {
        // Otherwise update existing document
        const updatedDoc = await updateDocument(documentData.id, { content });
        if (updatedDoc) {
          setDocumentData(updatedDoc);
          toast.success("Document saved successfully!");
        } else {
          toast.error("Failed to save document");
        }
      }
    } catch (err) {
      console.error("Error saving document:", err);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!documentData) return;
    toast.success("Document downloaded successfully!");
  };

  const isPremiumLocked = documentData?.is_premium && user && !hasAccess(documentData.pricing_tier);

  if (error && !loading && !documentData) {
    return (
      <Layout>
        <div className="container py-8">
          <Button 
            variant="ghost" 
            className="gap-2 mb-8"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft size={16} />
            Back to Documents
          </Button>
          
          <div className="py-12 text-center">
            <p className="text-lg text-red-500">{error}</p>
            <Button 
              onClick={() => navigate("/documents")} 
              className="mt-4"
            >
              View All Documents
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button 
            variant="ghost" 
            className="gap-2 self-start"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft size={16} />
            Back to Documents
          </Button>
          
          <div className="flex gap-2">
            {!loading && documentData && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleDownload}
                  disabled={loading || !documentData}
                >
                  <Download size={16} />
                  Download
                </Button>
                <Button 
                  className="gap-2 bg-docsai-blue hover:bg-docsai-darkBlue"
                  onClick={() => documentData && handleSaveDocument(documentData.content)}
                  disabled={loading || !documentData || !user || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Document
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="mb-8">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : documentData ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{documentData.title}</h1>
              <p className="text-gray-600">{documentData.description}</p>
              {documentData.regions && documentData.regions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {documentData.regions.map((region) => (
                    <span key={region} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {region}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {isPremiumLocked ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-md text-center">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">Premium Document</h2>
                <p className="mb-4 text-amber-800">
                  This document requires a {documentData.pricing_tier} subscription to edit and save.
                </p>
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade Subscription
                </Button>
              </div>
            ) : (
              <DocumentFormGenerator 
                document={documentData} 
                onSave={handleSaveDocument}
                readOnly={!user}
              />
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">Document not found or failed to load.</p>
            <Button 
              onClick={() => navigate("/documents")} 
              className="mt-4"
            >
              Browse Documents
            </Button>
          </div>
        )}
        
        {!user && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-2">Sign in to save your document</h2>
            <p className="text-gray-600 mb-4">
              You're currently in preview mode. Sign in or create an account to save your changes.
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button 
                className="bg-docsai-blue hover:bg-docsai-darkBlue"
                onClick={() => navigate("/register")}
              >
                Create Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
