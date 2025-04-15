import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Share, Loader } from "lucide-react";
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
  const { user } = useAuth();
  const { getDocumentById, createDocument, updateDocument } = useDocuments();
  const { hasAccess, subscription } = useSubscription(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      
      setLoading(true);
      const doc = await getDocumentById(id);
      
      if (doc) {
        setDocumentData(doc);
      } else {
        toast.error("Document not found");
        navigate("/documents");
      }
      setLoading(false);
    };

    loadDocument();
  }, [id, getDocumentById, navigate]);

  const handleSaveDocument = async (content: any) => {
    if (!user) {
      toast.error("Please sign in to save this document");
      navigate("/login");
      return;
    }

    if (!documentData) return;

    // Check if premium access is required
    if (documentData.is_premium && !hasAccess(documentData.pricing_tier)) {
      toast.error("Subscription required", {
        description: `This is a ${documentData.pricing_tier} document. Please upgrade your subscription.`
      });
      navigate("/pricing");
      return;
    }

    // If document belongs to template (public user), create new document
    if (documentData.user_id === "00000000-0000-0000-0000-000000000000") {
      toast.loading("Creating document...");
      const newDoc = await createDocument({
        title: documentData.title,
        description: documentData.description,
        document_type: documentData.document_type,
        content,
        regions: documentData.regions,
        is_premium: false, // User's created document is not premium
      }, user.id);

      if (newDoc) {
        toast.dismiss();
        toast.success("Document created successfully!");
        navigate(`/documents/${newDoc.id}`);
      } else {
        toast.dismiss();
        toast.error("Failed to create document");
      }
    } else {
      // Otherwise update existing document
      toast.loading("Saving document...");
      const updatedDoc = await updateDocument(documentData.id, { content });
      toast.dismiss();
      if (updatedDoc) {
        setDocumentData(updatedDoc);
        toast.success("Document saved successfully!");
      } else {
        toast.error("Failed to save document");
      }
    }
  };

  const handleDownload = async () => {
    if (!documentData) return;
    
    // The download functionality is now handled by the DocumentFormGenerator component
    // This is kept for backwards compatibility
    toast.success("Document downloaded successfully!");
  };

  const isPremiumLocked = documentData?.is_premium && user && !hasAccess(documentData.pricing_tier);

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
              disabled={loading || !documentData || !user}
            >
              <Save size={16} />
              Save Document
            </Button>
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
            <p className="text-lg text-gray-500">Document not found.</p>
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
