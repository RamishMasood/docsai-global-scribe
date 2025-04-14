
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md bg-docsai-blue p-1">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-docsai-blue">DocsAI</span>
          <span className="text-xl font-light text-docsai-darkGray">Global Scribe</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/documents">
                <Button variant="outline" className="gap-2">
                  My Documents
                </Button>
              </Link>
              <Button onClick={signOut} variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-docsai-blue hover:bg-docsai-darkBlue">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
