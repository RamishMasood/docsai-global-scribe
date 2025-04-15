import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Extended list of regions with additional countries
const regions = [
  "Global",
  // Continents
  "North America",
  "Europe",
  "Asia",
  "Australia",
  "Africa",
  "South America",
  // Western Countries
  "United States",
  "United Kingdom",
  "Canada",
  "European Union",
  // Middle East
  "Middle East",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Bahrain",
  "Kuwait",
  "Oman",
  // South Asia
  "India",
  "Pakistan",
  "Bangladesh",
  // East Asia
  "China",
  "Japan",
  "South Korea",
  // Southeast Asia
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Thailand",
  // Others
  "Russia",
  "Brazil",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Turkey",
  "Australia",
  "New Zealand",
];

interface RegionFilterProps {
  selectedRegion: string;
  onChange: (region: string) => void;
  loading?: boolean;
}

export function RegionFilter({ selectedRegion, onChange, loading = false }: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when selection is made
  const handleSelect = (region: string) => {
    onChange(region);
    setIsOpen(false);
  };

  if (loading) {
    return <Skeleton className="h-10 w-40" />;
  }

  // Group regions by area for better organization
  const continents = regions.filter(r => 
    ["Global", "North America", "Europe", "Asia", "Australia", "Africa", "South America", "Middle East"].includes(r));
  
  const majorCountries = regions.filter(r => 
    !["Global", "North America", "Europe", "Asia", "Australia", "Africa", "South America", "Middle East"].includes(r));

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="truncate max-w-[120px]">{selectedRegion || "All Regions"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[60vh] overflow-y-auto bg-white">
        <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("")} className="cursor-pointer">
          {!selectedRegion && <span className="mr-2">✓</span>}
          <span>All Regions</span>
        </DropdownMenuItem>
        
        <DropdownMenuLabel className="text-xs text-gray-500 mt-2">Continents & Regions</DropdownMenuLabel>
        {continents.filter(r => r !== "Global").map((region) => (
          <DropdownMenuItem key={region} onClick={() => handleSelect(region)} className="cursor-pointer">
            {selectedRegion === region && <span className="mr-2">✓</span>}
            <span>{region}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuLabel className="text-xs text-gray-500 mt-2">Countries</DropdownMenuLabel>
        {majorCountries.map((region) => (
          <DropdownMenuItem key={region} onClick={() => handleSelect(region)} className="cursor-pointer">
            {selectedRegion === region && <span className="mr-2">✓</span>}
            <span>{region}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
