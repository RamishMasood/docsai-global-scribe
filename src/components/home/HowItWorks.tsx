
import { CheckCircle2, FileText, FormInput, MousePointerClick } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="h-8 w-8 text-docsai-blue" />,
      title: "Select Document Type",
      description: "Choose from a variety of document templates tailored for different purposes and regions."
    },
    {
      icon: <FormInput className="h-8 w-8 text-docsai-blue" />,
      title: "Fill the Form",
      description: "Answer a few simple questions relevant to your document type and requirements."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-docsai-blue" />,
      title: "Review & Generate",
      description: "Preview your document, make any necessary adjustments, and generate the final version."
    },
    {
      icon: <MousePointerClick className="h-8 w-8 text-docsai-blue" />,
      title: "Download & Use",
      description: "Download your document in PDF or Word format, ready for use in your business."
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How DocsAI Works</h2>
          <p className="text-lg text-gray-600">
            Create professional documents in minutes with our simple four-step process.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-docsai-lightBlue md:left-24 lg:left-36"></div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center md:flex-row md:items-start">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                  {step.icon}
                </div>
                <div className="mt-4 text-center md:ml-6 md:mt-0 md:text-left">
                  <h3 className="text-xl font-bold md:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
