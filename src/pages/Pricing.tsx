
import { Layout } from "@/components/layout/Layout";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

export default function Pricing() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right plan for your document management needs. Access premium templates and global legal coverage.
          </p>
        </div>
        <SubscriptionPlans />
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. Once canceled, you'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">How do I upgrade my plan?</h3>
              <p className="text-gray-600">You can upgrade your plan anytime from your account settings. The new pricing will be prorated for the remainder of your billing cycle.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Are the documents legally binding?</h3>
              <p className="text-gray-600">Our templates provide a solid foundation for legal documents, but we recommend having them reviewed by a legal professional in your jurisdiction before using them for critical business purposes.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">What regions do you support?</h3>
              <p className="text-gray-600">We support document templates for North America, Europe, Asia, Australia, and many other regions. Premium plans include wider regional coverage and jurisdiction-specific legal compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
