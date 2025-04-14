import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Share } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDocuments, Document } from "@/hooks/useDocuments";
import { useSubscription } from "@/hooks/useSubscription";
import { DocumentFormGenerator } from "@/components/documents/DocumentFormGenerator";
import { toast } from "sonner";

export default function DocumentForm() {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getDocumentById, createDocument, updateDocument } = useDocuments();
  const { hasAccess } = useSubscription(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      
      setLoading(true);
      const doc = await getDocumentById(id);
      
      if (doc) {
        setDocument(doc);
      } else {
        toast.error("Document not found");
        navigate("/documents");
      }
      setLoading(false);
    };

    loadDocument();
  }, [id]);

  const handleSaveDocument = async (content: any) => {
    if (!user) {
      toast.error("Please sign in to save this document");
      navigate("/login");
      return;
    }

    if (!document) return;

    // Check if premium access is required
    if (document.is_premium && !hasAccess(document.pricing_tier)) {
      toast.error("Subscription required", {
        description: `This is a ${document.pricing_tier} document. Please upgrade your subscription.`
      });
      navigate("/pricing");
      return;
    }

    // If document belongs to template (public user), create new document
    if (document.user_id === "00000000-0000-0000-0000-000000000000") {
      const newDoc = await createDocument({
        title: document.title,
        description: document.description,
        document_type: document.document_type,
        content,
        regions: document.regions,
        is_premium: false, // User's created document is not premium
      }, user.id);

      if (newDoc) {
        toast.success("Document created successfully!");
        navigate(`/documents/${newDoc.id}`);
      }
    } else {
      // Otherwise update existing document
      const updatedDoc = await updateDocument(document.id, { content });
      if (updatedDoc) {
        setDocument(updatedDoc);
        toast.success("Document saved successfully!");
      }
    }
  };

  const handleDownload = () => {
    if (!document) return;

    // Create a downloadable text file
    const content = JSON.stringify(document.content, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Document downloaded successfully!");
  };

  const isPremiumLocked = document?.is_premium && user && !hasAccess(document.pricing_tier);

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
              disabled={loading || !document}
            >
              <Download size={16} />
              Download
            </Button>
            <Button 
              className="gap-2 bg-docsai-blue hover:bg-docsai-darkBlue"
              onClick={() => document && handleSaveDocument(document.content)}
              disabled={loading || !document || !user}
            >
              <Save size={16} />
              Save Document
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-docsai-blue"></div>
          </div>
        ) : document ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
              <p className="text-gray-600">{document.description}</p>
            </div>
            
            {isPremiumLocked ? (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-md text-center">
                <h2 className="text-2xl font-bold text-amber-700 mb-4">Premium Document</h2>
                <p className="mb-4 text-amber-800">
                  This document requires a {document.pricing_tier} subscription to edit and save.
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
                document={document} 
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
