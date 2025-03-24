import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from "lucide-react";

interface EarningsSummaryProps {
  totalEarnings?: number;
  currentMonth?: number;
  previousMonth?: number;
  percentageChange?: number;
  isPositiveChange?: boolean;
  recentTransactions?: {
    id: string;
    date: string;
    patientName: string;
    service: string;
    amount: number;
    status: "completed" | "pending" | "cancelled";
  }[];
}

const EarningsSummary = ({
  totalEarnings = 5280.5,
  currentMonth = 1250.75,
  previousMonth = 980.25,
  percentageChange = 27.6,
  isPositiveChange = true,
  recentTransactions = [
    {
      id: "tx-001",
      date: "2023-06-15",
      patientName: "John Smith",
      service: "Physical Therapy",
      amount: 120.0,
      status: "completed",
    },
    {
      id: "tx-002",
      date: "2023-06-14",
      patientName: "Maria Garcia",
      service: "Home Nursing",
      amount: 95.5,
      status: "completed",
    },
    {
      id: "tx-003",
      date: "2023-06-13",
      patientName: "Robert Johnson",
      service: "Medical Consultation",
      amount: 150.0,
      status: "completed",
    },
    {
      id: "tx-004",
      date: "2023-06-12",
      patientName: "Sarah Williams",
      service: "Physical Therapy",
      amount: 120.0,
      status: "pending",
    },
    {
      id: "tx-005",
      date: "2023-06-11",
      patientName: "David Brown",
      service: "Home Nursing",
      amount: 85.0,
      status: "cancelled",
    },
  ],
}: EarningsSummaryProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Earnings Summary</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
              {totalEarnings.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="p-0 h-auto" size="sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs text-muted-foreground">
                View History
              </span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Month</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
              {currentMonth.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {isPositiveChange ? (
                <span className="text-emerald-600 flex items-center text-sm">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                  {percentageChange}%
                </span>
              ) : (
                <span className="text-rose-600 flex items-center text-sm">
                  <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                  {percentageChange}%
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-2">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payouts</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
              {recentTransactions
                .filter((tx) => tx.status === "pending")
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="p-0 h-auto" size="sm">
              <span className="text-xs text-muted-foreground">
                View Details
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chart" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Chart View
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>
                Your earnings over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-muted-foreground">
                  Chart visualization would appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Your most recent earnings activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">
                        Patient
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Service
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-left font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="py-3 px-4">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{transaction.patientName}</td>
                        <td className="py-3 px-4">{transaction.service}</td>
                        <td className="py-3 px-4">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsSummary;
