
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

const regions = [
  "Global",
  "North America",
  "Europe",
  "Asia",
  "Australia",
  "Africa",
  "South America",
];

interface RegionFilterProps {
  selectedRegion: string;
  onChange: (region: string) => void;
}

export function RegionFilter({ selectedRegion, onChange }: RegionFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="truncate max-w-[120px]">{selectedRegion || "All Regions"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange("")}>
          {!selectedRegion && <span className="mr-2">✓</span>}
          <span>All Regions</span>
        </DropdownMenuItem>
        {regions.map((region) => (
          <DropdownMenuItem key={region} onClick={() => onChange(region)}>
            {selectedRegion === region && <span className="mr-2">✓</span>}
            <span>{region}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
