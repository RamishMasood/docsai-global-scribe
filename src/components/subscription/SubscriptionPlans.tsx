
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SubscriptionPlans() {
  const { user } = useAuth();
  const { hasAccess, createSubscription } = useSubscription(user?.id);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (tier: 'basic' | 'premium', duration: 'monthly' | 'yearly') => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to subscribe."
      });
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // In a real app, you would integrate with a payment provider here
      // For demo purposes, we'll just create the subscription directly
      await createSubscription(user.id, tier, duration);
      navigate("/documents");
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Free Plan */}
      <Card className="flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Free</CardTitle>
          <CardDescription>Basic document access for individual use</CardDescription>
          <div className="mt-4 text-3xl font-bold">$0</div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Access to basic document templates</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Global region support</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Create up to 3 documents</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-gray-400">Premium templates</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-gray-400">Regional legal compliance</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            disabled={true}
          >
            Current Plan
          </Button>
        </CardFooter>
      </Card>

      {/* Basic Plan */}
      <Card className="flex flex-col border-docsai-blue">
        <CardHeader className="pb-4 bg-docsai-lightBlue rounded-t-lg">
          <CardTitle className="text-2xl">Basic</CardTitle>
          <CardDescription>For professionals and small businesses</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">$9.99</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>All free features</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Access to basic premium templates</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Regional legal compliance</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Create unlimited documents</span>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-gray-400">Advanced premium templates</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-docsai-blue hover:bg-docsai-darkBlue" 
            onClick={() => handleSubscribe('basic', 'monthly')}
            disabled={isProcessing || (user && hasAccess('basic'))}
          >
            {user && hasAccess('basic') ? 'Current Plan' : 'Subscribe Monthly'}
          </Button>
        </CardFooter>
      </Card>

      {/* Premium Plan */}
      <Card className="flex flex-col border-amber-500">
        <CardHeader className="pb-4 bg-amber-50 rounded-t-lg">
          <CardTitle className="text-2xl">Premium</CardTitle>
          <CardDescription>For companies requiring full legal coverage</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">$29.99</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>All basic features</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Access to all premium templates</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Full global legal compliance</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Priority customer support</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Custom templates on request</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600" 
            onClick={() => handleSubscribe('premium', 'monthly')}
            disabled={isProcessing || (user && hasAccess('premium'))}
          >
            {user && hasAccess('premium') ? 'Current Plan' : 'Subscribe Monthly'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-amber-500 text-amber-700 hover:bg-amber-50" 
            onClick={() => handleSubscribe('premium', 'yearly')}
            disabled={isProcessing || (user && hasAccess('premium'))}
          >
            Subscribe Yearly (20% off)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
