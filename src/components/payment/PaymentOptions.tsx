import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet, Building, CheckCircle2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PaymentOptionsProps {
  onPaymentSelect?: (method: string) => void;
  onPaymentComplete?: () => void;
  amount?: number;
  currency?: string;
  serviceName?: string;
}

const PaymentOptions = ({
  onPaymentSelect = () => {},
  onPaymentComplete = () => {},
  amount = 150.0,
  currency = "USD",
  serviceName = "Home Nursing Care - 2 hours",
}: PaymentOptionsProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("credit_card");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit_card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Pay securely with your card",
    },
    {
      id: "digital_wallet",
      name: "Digital Wallet",
      icon: <Wallet className="h-5 w-5" />,
      description: "Pay with your digital wallet",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: <Building className="h-5 w-5" />,
      description: "Direct bank transfer",
    },
  ];

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    onPaymentSelect(value);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      onPaymentComplete();
    }, 2000);
  };

  // Disable the payment button if processing or if it's a demo
  const isPaymentDisabled =
    isProcessing ||
    (selectedMethod === "credit_card" &&
      (!document.getElementById("cardName")?.value ||
        !document.getElementById("cardNumber")?.value ||
        !document.getElementById("expiry")?.value ||
        !document.getElementById("cvv")?.value));

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm">
      {!isComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium">Service</h3>
                <span className="text-sm">{serviceName}</span>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Amount</h3>
                <span className="text-lg font-bold">
                  {currency} {amount.toFixed(2)}
                </span>
              </div>
              <Separator className="my-4" />
            </div>

            <RadioGroup
              value={selectedMethod}
              onValueChange={handleMethodChange}
              className="space-y-4"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label
                    htmlFor={method.id}
                    className="flex flex-1 items-center cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {method.icon}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedMethod === "credit_card" && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input id="cardName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "digital_wallet" && (
              <div className="mt-6 p-4 border rounded-md bg-gray-50">
                <p className="text-center text-sm">
                  You will be redirected to your digital wallet provider to
                  complete the payment.
                </p>
              </div>
            )}

            {selectedMethod === "bank_transfer" && (
              <div className="mt-6 p-4 border rounded-md bg-gray-50 space-y-2">
                <p className="text-sm font-medium">Bank Account Details:</p>
                <p className="text-sm">
                  Account Name: Healthcare Services Inc.
                </p>
                <p className="text-sm">Account Number: 1234567890</p>
                <p className="text-sm">Bank Code: HCBANK123</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please use your booking reference as payment reference.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={isPaymentDisabled}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${currency} ${amount.toFixed(2)}`
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Payment Successful!</h2>
              <p className="text-center text-gray-500">
                Your payment of {currency} {amount.toFixed(2)} for {serviceName}{" "}
                has been processed successfully.
              </p>
              <div className="w-full p-4 bg-gray-50 rounded-md mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Transaction ID:</span>
                  <span className="text-sm font-medium">
                    TXN{Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Payment Method:</span>
                  <span className="text-sm font-medium">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default PaymentOptions;
