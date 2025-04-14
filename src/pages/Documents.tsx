
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { documents, publicTemplates, loading, fetchUserDocuments, fetchPublicTemplates } = useDocuments();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicTemplates();
    if (user) {
      fetchUserDocuments(user.id);
    }
  }, [user]);

  // Filter documents based on search query and selected category
  const filteredDocuments = [...documents, ...publicTemplates].filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.document_type.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <RequireAuth>
      <Layout>
        <div className="container py-8 md:py-12">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">My Documents</h1>
              <p className="text-lg text-gray-600">
                Manage your documents and create new ones from templates.
              </p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 bg-docsai-blue hover:bg-docsai-darkBlue flex gap-2 items-center"
              onClick={() => navigate("/documents/new")}
            >
              <Plus size={16} />
              Create New Document
            </Button>
          </div>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <TabsList className="w-full grid-cols-3 md:w-auto md:grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="hr">HR</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="real estate">Real Estate</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-docsai-blue"></div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    description={doc.description}
                    isPremium={doc.is_premium}
                    regions={doc.regions}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-gray-500">No documents found matching your search criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </RequireAuth>
  );
}
