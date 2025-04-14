
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Document {
  id: string;
  title: string;
  description: string;
  document_type: string;
  content: any;
  regions: string[];
  is_premium: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", "00000000-0000-0000-0000-000000000000");

      if (error) {
        throw error;
      }

      setPublicTemplates(data as Document[] || []);
    } catch (error: any) {
      console.error("Error fetching public templates:", error);
      setError(error.message);
    }
  };

  const fetchUserDocuments = async (userId: string) => {
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
      toast({
        title: "Error",
        description: `Failed to fetch document: ${error.message}`,
      });
      return null;
    }
  };

  const createDocument = async (newDocument: Partial<Document>, userId: string) => {
    try {
      const documentToInsert = {
        ...newDocument,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert(documentToInsert)
        .select();

      if (error) {
        throw error;
      }

      setDocuments((prev) => [...prev, data[0] as Document]);
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      
      return data[0] as Document;
    } catch (error: any) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: `Failed to create document: ${error.message}`,
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
        prev.map((doc) => (doc.id === id ? { ...doc, ...(data[0] as Document) } : doc))
      );
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
      
      return data[0] as Document;
    } catch (error: any) {
      console.error("Error updating document:", error);
      toast({
        title: "Error",
        description: `Failed to update document: ${error.message}`,
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
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: `Failed to delete document: ${error.message}`,
      });
      return false;
    }
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
  };
}
