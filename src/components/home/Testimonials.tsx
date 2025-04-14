
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      quote: "DocsAI has revolutionized our contract creation process. What used to take hours now takes minutes.",
      author: "Sarah Johnson",
      role: "HR Director, TechCorp Inc.",
      country: "United States"
    },
    {
      quote: "The regional compliance features ensure our documents meet local regulations, which is essential for our global business.",
      author: "Rajiv Patel",
      role: "Legal Advisor, Global Solutions Ltd.",
      country: "India"
    },
    {
      quote: "As a small business owner, DocsAI has given me access to professional legal documents without the high cost of a lawyer.",
      author: "Emma Williams",
      role: "Founder, Creative Studio",
      country: "United Kingdom"
    }
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Trusted by Professionals Worldwide</h2>
          <p className="text-lg text-gray-600">
            See how DocsAI is helping businesses across the globe streamline their document workflows.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardHeader>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-gray-600">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <CardDescription className="text-sm">
                    {testimonial.role} • {testimonial.country}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
