
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-medium">DocsAI</h3>
            <p className="text-sm text-gray-600">
              Smart document automation for professionals and small businesses worldwide.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Documents</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/documents" className="hover:text-docsai-blue">NDA</Link></li>
              <li><Link to="/documents" className="hover:text-docsai-blue">Employment Contracts</Link></li>
              <li><Link to="/documents" className="hover:text-docsai-blue">Partnership Agreements</Link></li>
              <li><Link to="/documents" className="hover:text-docsai-blue">Rent Agreements</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-docsai-blue">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-docsai-blue">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-docsai-blue">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/terms" className="hover:text-docsai-blue">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-docsai-blue">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} DocsAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
