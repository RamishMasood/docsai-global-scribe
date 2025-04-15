
import { useState, useEffect } from "react";
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

// Extended list of regions
const regions = [
  "Global",
  "North America",
  "Europe",
  "Asia",
  "Australia",
  "Africa",
  "South America",
  "United States",
  "United Kingdom",
  "European Union",
  "Canada",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Middle East",
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
      <DropdownMenuContent className="w-56 max-h-[60vh] overflow-y-auto">
        <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("")} className="cursor-pointer">
          {!selectedRegion && <span className="mr-2">✓</span>}
          <span>All Regions</span>
        </DropdownMenuItem>
        {regions.map((region) => (
          <DropdownMenuItem key={region} onClick={() => handleSelect(region)} className="cursor-pointer">
            {selectedRegion === region && <span className="mr-2">✓</span>}
            <span>{region}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
