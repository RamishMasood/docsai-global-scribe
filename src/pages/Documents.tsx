
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/context/AuthContext";
import { RegionFilter } from "@/components/documents/RegionFilter";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("");
  const { documents, publicTemplates, loading, fetchUserDocuments, fetchPublicTemplates } = useDocuments();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch public templates regardless of login state
    const loadData = async () => {
      await fetchPublicTemplates();
      if (user) {
        await fetchUserDocuments(user.id);
      }
    };
    
    loadData();
  }, [user]);

  // Filter documents based on search query, selected category, and selected region
  const filteredDocuments = [...documents, ...publicTemplates].filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.document_type === selectedCategory;
    const matchesRegion = !selectedRegion || doc.regions.includes(selectedRegion);
    return matchesSearch && matchesCategory && matchesRegion;
  });

  // Group documents by premium status
  const premiumDocuments = filteredDocuments.filter(doc => doc.is_premium);
  const freeDocuments = filteredDocuments.filter(doc => !doc.is_premium);

  // Loading skeletons for cards
  const SkeletonCards = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-64 rounded-md border p-4">
          <Skeleton className="h-8 w-8 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Document Templates</h1>
            <p className="text-lg text-gray-600">
              Browse our global document templates or create your own custom documents.
            </p>
          </div>
          {user && (
            <Button 
              className="mt-4 sm:mt-0 bg-docsai-blue hover:bg-docsai-darkBlue flex gap-2 items-center"
              onClick={() => navigate("/documents/new")}
            >
              <Plus size={16} />
              Create New Document
            </Button>
          )}
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
          
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
            <RegionFilter 
              selectedRegion={selectedRegion}
              onChange={setSelectedRegion}
            />
            
            <div className="overflow-x-auto w-full sm:w-auto">
              <Tabs 
                defaultValue="all" 
                className="w-full"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="nda">NDAs</TabsTrigger>
                  <TabsTrigger value="employment_contract">Employment</TabsTrigger>
                  <TabsTrigger value="partnership_agreement">Partnership</TabsTrigger>
                  <TabsTrigger value="rent_agreement">Rental</TabsTrigger>
                  <TabsTrigger value="invoice">Invoices</TabsTrigger>
                  <TabsTrigger value="consulting_contract">Consulting</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-amber-800">Access Premium Templates</h3>
              <p className="text-amber-700">Sign up to access all premium templates and save your documents.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Templates</h2>
              <SkeletonCards />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {freeDocuments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Free Templates</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {freeDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      isPremium={doc.is_premium}
                      regions={doc.regions}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {premiumDocuments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Premium Templates</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {premiumDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      isPremium={doc.is_premium}
                      regions={doc.regions}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {filteredDocuments.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-lg text-gray-500">No documents found matching your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
