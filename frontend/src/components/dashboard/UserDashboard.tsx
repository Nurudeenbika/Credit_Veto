"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { creditApi, disputeApi } from "@/lib/api";
import { CreditProfile, Dispute } from "@/lib/types";
import {
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [creditProfile, setCreditProfile] = useState<CreditProfile | null>(
    null
  );
  const [recentDisputes, setRecentDisputes] = useState<Dispute[]>([]);
  const { loading: creditLoading, execute: fetchCredit } =
    useApi<CreditProfile>();
  const { loading: disputesLoading, execute: fetchDisputes } =
    useApi<Dispute[]>();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (user?.id) {
        const [creditData, disputesData] = await Promise.all([
          fetchCredit(() => creditApi.getCreditProfile(user.id)),
          fetchDisputes(() => disputeApi.getDisputes()),
        ]);

        setCreditProfile(creditData);
        setRecentDisputes(disputesData.slice(0, 3)); // Show only recent 3
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "success";
      case "under_review":
        return "warning";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return CheckCircle;
      case "under_review":
        return AlertTriangle;
      case "pending":
        return Clock;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.email}
        </h1>
        <p className="text-gray-600">
          Here's your credit profile overview and recent activity.
        </p>
      </div>

      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Credit Score</h2>
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>

            {creditLoading ? (
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : creditProfile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {creditProfile.score}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      Report Date:{" "}
                      {new Date(creditProfile.reportDate).toLocaleDateString()}
                    </p>
                    <p>
                      Last Updated:{" "}
                      {new Date(creditProfile.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Open Accounts
                    </p>
                    <p className="text-2xl font-semibold">
                      {creditProfile.openAccounts}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Total Balance
                    </p>
                    <p className="text-2xl font-semibold">
                      ${creditProfile.totalBalance?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No credit data available</p>
                <Link href="/profile">
                  <Button className="mt-4">View Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Full Credit Report
                </Button>
              </Link>
              <Link href="/disputes">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Disputes
                </Button>
              </Link>
              <Link href="/ai">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  AI Letter Generator
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Disputes */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Disputes</h2>
            <Link href="/disputes">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {disputesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentDisputes.length > 0 ? (
            <div className="space-y-3">
              {recentDisputes.map((dispute) => {
                const StatusIcon = getStatusIcon(dispute.status);
                return (
                  <div
                    key={dispute.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{dispute.itemName}</p>
                        <p className="text-sm text-gray-500">
                          {dispute.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(dispute.status)}>
                        {dispute.status.replace("_", " ")}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No disputes yet</p>
              <Link href="/profile">
                <Button className="mt-4">Create Your First Dispute</Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
