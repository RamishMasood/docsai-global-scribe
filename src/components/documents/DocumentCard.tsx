
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  isPremium?: boolean;
  regions: string[];
}

export function DocumentCard({ id, title, description, isPremium = false, regions }: DocumentCardProps) {
  return (
    <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="rounded-md bg-docsai-lightBlue p-2">
            <FileText className="h-5 w-5 text-docsai-blue" />
          </div>
          {isPremium && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-600">Premium</Badge>
          )}
        </div>
        <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
        <CardDescription className="line-clamp-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1">
          {regions.map((region) => (
            <Badge key={region} variant="outline" className="bg-white text-xs mb-1">
              {region}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/documents/${id}`} className="w-full">
          <Button className="w-full bg-docsai-blue hover:bg-docsai-darkBlue">
            Create Document
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
