
import { ArrowRight, Check, FileText, Globe, Languages, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Features() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-docsai-blue" />,
      title: "Multiple Document Types",
      description: "Access a variety of legal and business documents including NDAs, contracts, agreements, and more."
    },
    {
      icon: <Globe className="h-6 w-6 text-docsai-blue" />,
      title: "Global Compliance",
      description: "Documents tailored to comply with regulations across different countries and regions."
    },
    {
      icon: <Languages className="h-6 w-6 text-docsai-blue" />,
      title: "Multi-Language Support",
      description: "Generate documents in multiple languages to meet your international business needs."
    },
    {
      icon: <Shield className="h-6 w-6 text-docsai-blue" />,
      title: "Secure & Confidential",
      description: "Your data is encrypted and handled with the highest security standards."
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need for Document Automation</h2>
          <p className="text-lg text-gray-600">
            DocsAI simplifies the document creation process for professionals and businesses of all sizes worldwide.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="mb-4 rounded-full bg-docsai-lightBlue p-2 w-fit">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-docsai-blue p-8 text-white md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="mb-4 text-2xl font-bold md:text-3xl">Ready to streamline your document workflow?</h3>
            <p className="mb-6 text-blue-100">
              Join thousands of professionals and businesses saving time with DocsAI's document automation.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/documents">
                <Button className="w-full gap-2 bg-white px-6 py-6 text-base text-docsai-blue hover:bg-blue-50 sm:w-auto">
                  Explore Documents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full gap-2 border-white px-6 py-6 text-base text-white hover:bg-docsai-darkBlue sm:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
