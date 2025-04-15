
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function SubscriptionPlans() {
  const { user } = useAuth();
  const { hasAccess, createSubscription, subscription } = useSubscription(user?.id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const handleSubscribe = async (tier: 'basic' | 'premium') => {
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
      await createSubscription(user.id, tier, selectedDuration);
      toast.success(`Successfully subscribed to ${tier} plan!`);
      navigate("/documents");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = (tier: 'basic' | 'premium') => {
    if (user && hasAccess(tier)) return 'Current Plan';
    return `Subscribe ${selectedDuration === 'monthly' ? 'Monthly' : 'Yearly'}`;
  };

  const getDiscountedPrice = (basePrice: number) => {
    return selectedDuration === 'yearly' ? (basePrice * 0.8).toFixed(2) : basePrice.toFixed(2);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-6">
        <RadioGroup 
          defaultValue="monthly" 
          className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg" 
          onValueChange={(value) => setSelectedDuration(value as 'monthly' | 'yearly')}
        >
          <div className={`flex items-center space-x-2 p-2 ${selectedDuration === 'monthly' ? 'bg-white rounded-md shadow-sm' : ''}`}>
            <RadioGroupItem value="monthly" id="monthly" className="hidden" />
            <Label htmlFor="monthly" className={`cursor-pointer ${selectedDuration === 'monthly' ? 'font-medium' : 'text-gray-500'}`}>
              Monthly
            </Label>
          </div>
          <div className={`flex items-center space-x-2 p-2 ${selectedDuration === 'yearly' ? 'bg-white rounded-md shadow-sm' : ''}`}>
            <RadioGroupItem value="yearly" id="yearly" className="hidden" />
            <Label htmlFor="yearly" className={`cursor-pointer ${selectedDuration === 'yearly' ? 'font-medium' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs">Save 20%</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Free Plan */}
        <Card className={`flex flex-col ${subscription?.tier === 'free' ? 'border-green-500 ring-1 ring-green-500' : ''}`}>
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
                <span><strong>Create up to 3 documents</strong></span>
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
              {subscription?.tier === 'free' ? 'Current Plan' : 'Free Plan'}
            </Button>
          </CardFooter>
        </Card>

        {/* Basic Plan */}
        <Card className={`flex flex-col ${subscription?.tier === 'basic' ? 'border-docsai-blue ring-1 ring-docsai-blue' : 'border-docsai-blue'}`}>
          <CardHeader className="pb-4 bg-docsai-lightBlue rounded-t-lg">
            <CardTitle className="text-2xl">Basic</CardTitle>
            <CardDescription>For professionals and small businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getDiscountedPrice(9.99)}</span>
              <span className="text-sm text-muted-foreground">/{selectedDuration === 'monthly' ? 'month' : 'month, billed yearly'}</span>
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
                <span><strong>Create unlimited documents</strong></span>
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
              onClick={() => handleSubscribe('basic')}
              disabled={isProcessing || (user && hasAccess('basic'))}
            >
              {getButtonText('basic')}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className={`flex flex-col ${subscription?.tier === 'premium' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-amber-500'}`}>
          <CardHeader className="pb-4 bg-amber-50 rounded-t-lg">
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>For companies requiring full legal coverage</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${getDiscountedPrice(29.99)}</span>
              <span className="text-sm text-muted-foreground">/{selectedDuration === 'monthly' ? 'month' : 'month, billed yearly'}</span>
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
          <CardFooter>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600" 
              onClick={() => handleSubscribe('premium')}
              disabled={isProcessing || (user && hasAccess('premium'))}
            >
              {getButtonText('premium')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
