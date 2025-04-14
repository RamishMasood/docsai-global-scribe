
import { useState } from "react";
import { Check, Globe } from "lucide-react";
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
        <Button variant="outline" className="flex gap-2">
          <Globe className="h-4 w-4" />
          {selectedRegion || "All Regions"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange("")}>
          {!selectedRegion && <Check className="mr-2 h-4 w-4" />}
          <span>All Regions</span>
        </DropdownMenuItem>
        {regions.map((region) => (
          <DropdownMenuItem key={region} onClick={() => onChange(region)}>
            {selectedRegion === region && <Check className="mr-2 h-4 w-4" />}
            <span>{region}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
