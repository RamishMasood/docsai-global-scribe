
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Define the valid document types from the database schema
export type DocumentType = 
  | "nda"
  | "employment_contract"
  | "partnership_agreement"
  | "rent_agreement"
  | "invoice"
  | "consulting_contract"
  | "business_contract"
  | "legal_notice";

// Define the valid subscription tiers
export type PricingTier = "free" | "basic" | "premium";

export interface Document {
  id: string;
  title: string;
  description: string;
  document_type: DocumentType;
  content: any;
  regions: string[];
  is_premium: boolean;
  pricing_tier: PricingTier;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface DocumentInsert {
  title: string;
  description: string;
  document_type: DocumentType;
  content?: any;
  regions?: string[];
  is_premium?: boolean;
  pricing_tier?: PricingTier;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        throw error;
      }

      setPublicTemplates(data as Document[] || []);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching public templates:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchUserDocuments = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .neq("user_id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        throw error;
      }

      setDocuments(data as Document[] || []);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching user documents:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getDocumentById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data as Document;
    } catch (error: any) {
      console.error("Error fetching document:", error);
      toast.error("Error fetching document", {
        description: error.message
      });
      return null;
    }
  };

  const createDocument = async (newDocument: DocumentInsert, userId: string) => {
    try {
      // Ensure the document type is valid
      const documentType = newDocument.document_type as DocumentType;
      
      const documentToInsert = {
        title: newDocument.title,
        description: newDocument.description,
        document_type: documentType,
        content: newDocument.content || {},
        regions: newDocument.regions || ['Global'],
        is_premium: newDocument.is_premium || false,
        pricing_tier: (newDocument.pricing_tier as PricingTier) || 'free',
        user_id: userId
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(documentToInsert)
        .select();

      if (error) {
        throw error;
      }

      setDocuments((prev) => [...prev, data[0] as Document]);
      toast.success("Document created successfully");
      
      return data[0] as Document;
    } catch (error: any) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document", {
        description: error.message
      });
      return null;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, ...data[0] } as Document : doc))
      );
      
      toast.success("Document updated successfully");
      
      return data[0] as Document;
    } catch (error: any) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document", {
        description: error.message
      });
      return null;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      
      toast.success("Document deleted successfully");
      
      return true;
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document", {
        description: error.message
      });
      return false;
    }
  };

  // Function to filter documents by tier
  const getDocumentsByTier = (tier: PricingTier) => {
    return publicTemplates.filter(doc => doc.pricing_tier === tier);
  };

  // Function to filter documents by region
  const getDocumentsByRegion = (region: string) => {
    if (!region) return publicTemplates;
    return publicTemplates.filter(doc => doc.regions.includes(region));
  };

  return {
    documents,
    publicTemplates,
    loading,
    error,
    fetchUserDocuments,
    fetchPublicTemplates,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByTier,
    getDocumentsByRegion,
  };
}
