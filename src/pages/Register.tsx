
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/hooks/useDocuments";
import { toast } from "sonner";

// Extended regions data with more global options
const regions = [
  "United States",
  "United Kingdom",
  "European Union",
  "Canada",
  "Australia",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Singapore",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Japan",
  "China",
  "Other"
];

// Subscription plans
const subscriptionPlans = [
  {
    id: "free",
    name: "Free Plan",
    description: "Basic document access for individual use",
    price: "$0/month",
    features: ["Access to basic document templates", "Global region support", "Create up to 3 documents"]
  },
  {
    id: "basic",
    name: "Basic Plan",
    description: "For professionals and small businesses",
    price: "$9.99/month",
    features: ["All free features", "Access to basic premium templates", "Regional legal compliance", "Create unlimited documents"]
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "For companies requiring full legal coverage",
    price: "$29.99/month",
    features: ["All basic features", "Access to all premium templates", "Full global legal compliance", "Priority customer support", "Custom templates on request"]
  }
];

// Payment methods
const paymentMethods = [
  { id: "credit-card", name: "Credit Card", icon: CreditCard },
  { id: "paypal", name: "PayPal", icon: Wallet },
];

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get subscription plan from URL if it exists
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan');
    if (plan && ['free', 'basic', 'premium'].includes(plan)) {
      setSelectedPlan(plan);
      if (plan !== 'free') {
        setShowPaymentFields(true);
      }
    }
  }, [location]);

  // Toggle payment fields based on selected plan
  useEffect(() => {
    setShowPaymentFields(selectedPlan !== 'free');
  }, [selectedPlan]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format card expiry date
  const formatCardExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !region || !termsAccepted) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate payment details if a paid plan is selected
    if (selectedPlan !== 'free' && showPaymentFields) {
      if (paymentMethod === 'credit-card' && (!cardNumber || !cardExpiry || !cardCvc)) {
        toast.error("Please enter valid payment details");
        return;
      }
    }

    setIsLoading(true);
    try {
      // In a real app, you would process the payment here before sign up
      // For demo purposes, we'll just simulate a successful payment
      if (selectedPlan !== 'free') {
        toast.success("Payment processed successfully", {
          description: `You've subscribed to the ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.`
        });
      }
      
      await signUp(email, password, firstName, lastName, region);
      navigate("/login", { state: { message: "Account created successfully. Please sign in." } });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center py-8 md:py-12">
        <div className="mx-auto w-full max-w-xl">
          <Card className="shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Enter your details to create your DocsAI account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="payment" disabled={!showPaymentFields}>Payment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="John" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Doe" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Password must be at least 8 characters long.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="region">Primary Region</Label>
                      <Select value={region} onValueChange={setRegion} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {regions.map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        We'll tailor document templates for your region.
                      </p>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="subscription">
                  <CardContent className="py-4">
                    <div className="grid gap-4">
                      <h3 className="text-lg font-medium">Choose your subscription plan</h3>
                      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
                        {subscriptionPlans.map((plan) => (
                          <div key={plan.id} className={`flex items-start space-x-3 border rounded-lg p-4 transition-all ${selectedPlan === plan.id ? 'border-docsai-blue bg-docsai-lightBlue/10' : 'border-gray-200'}`}>
                            <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-1" />
                            <div className="grid gap-1.5 w-full">
                              <div className="flex justify-between items-center">
                                <Label htmlFor={`plan-${plan.id}`} className="font-medium">{plan.name}</Label>
                                <span className="font-bold">{plan.price}</span>
                              </div>
                              <p className="text-sm text-gray-500">{plan.description}</p>
                              <ul className="text-sm text-gray-700 mt-2">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center gap-2 py-1">
                                    <svg 
                                      className="h-4 w-4 text-green-500 flex-shrink-0" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="payment">
                  <CardContent className="py-4">
                    {showPaymentFields ? (
                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">Payment Method</h3>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
                          {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                              <div key={method.id} className={`flex items-center justify-center space-x-2 border rounded-lg p-4 transition-all cursor-pointer ${paymentMethod === method.id ? 'border-docsai-blue bg-docsai-lightBlue/10' : 'border-gray-200'}`}>
                                <RadioGroupItem value={method.id} id={`method-${method.id}`} className="sr-only" />
                                <Icon className="h-5 w-5" />
                                <Label htmlFor={`method-${method.id}`} className="font-medium">{method.name}</Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                        
                        {paymentMethod === 'credit-card' && (
                          <div className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input 
                                id="cardNumber" 
                                placeholder="1234 5678 9012 3456" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                maxLength={19}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="cardExpiry">Expiry Date</Label>
                                <Input 
                                  id="cardExpiry" 
                                  placeholder="MM/YY" 
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                                  maxLength={5}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="cardCvc">CVC</Label>
                                <Input 
                                  id="cardCvc" 
                                  placeholder="123" 
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                                  maxLength={3}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {paymentMethod === 'paypal' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-gray-600">You'll be redirected to PayPal to complete your payment after creating your account.</p>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Order Summary</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between py-1">
                              <span>Plan</span>
                              <span className="font-medium">
                                {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Billing</span>
                              <span className="font-medium">Monthly</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between pt-1 font-bold">
                              <span>Total</span>
                              <span>
                                {subscriptionPlans.find(p => p.id === selectedPlan)?.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p className="text-gray-500">No payment required for the Free plan.</p>
                        <p className="mt-2 text-sm text-gray-400">You can upgrade anytime from your account.</p>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
                
                <CardContent className="pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <Link to="/terms" className="text-docsai-blue hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-docsai-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="mt-4 w-full bg-docsai-blue hover:bg-docsai-darkBlue"
                    disabled={isLoading || !termsAccepted}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardContent>
              </Tabs>
            </form>
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" type="button" className="gap-2 w-full">
                <Mail className="h-4 w-4" />
                Sign up with Email
              </Button>
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-docsai-blue hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
