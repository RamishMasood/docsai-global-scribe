
import { Layout } from "@/components/layout/Layout";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock document data
const documents = [
  {
    id: "nda",
    title: "Non-Disclosure Agreement",
    description: "Protect your confidential information when sharing with other parties.",
    regions: ["Global", "United States", "European Union", "United Kingdom"],
    category: "Legal"
  },
  {
    id: "employment",
    title: "Employment Contract",
    description: "Standard employment agreement for hiring new employees.",
    regions: ["United States", "Canada", "United Kingdom", "Australia", "India"],
    category: "HR"
  },
  {
    id: "partnership",
    title: "Partnership Agreement",
    description: "Define the terms of a business partnership between two or more parties.",
    regions: ["Global", "United States", "Canada", "United Kingdom"],
    category: "Business"
  },
  {
    id: "rent",
    title: "Rental Agreement",
    description: "Lease agreement for residential or commercial property rental.",
    regions: ["United States", "Canada", "United Kingdom", "Australia"],
    category: "Real Estate"
  },
  {
    id: "invoice",
    title: "Invoice Template",
    description: "Professional invoice for billing clients and customers.",
    regions: ["Global", "United States", "European Union", "United Kingdom"],
    category: "Financial",
    isPremium: true
  },
  {
    id: "consulting",
    title: "Consulting Agreement",
    description: "Contract for providing consulting or professional services.",
    regions: ["Global", "United States", "Canada", "United Kingdom", "Australia"],
    category: "Business",
    isPremium: true
  },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter documents based on search query and selected category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Document Templates</h1>
          <p className="text-lg text-gray-600">
            Select from our library of professional document templates designed for global compliance.
          </p>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                description={doc.description}
                isPremium={doc.isPremium}
                regions={doc.regions}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-gray-500">No documents found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
