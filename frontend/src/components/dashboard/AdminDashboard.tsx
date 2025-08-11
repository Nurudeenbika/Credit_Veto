"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApi } from "@/hooks/useApi";
import disputeApi from "@/lib/api";
import { Dispute } from "@/lib/types";
import {
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Check,
  X,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState({
    totalDisputes: 0,
    pendingDisputes: 0,
    underReviewDisputes: 0,
    resolvedDisputes: 0,
  });
  const { loading, execute: fetchDisputes } = useApi<Dispute[]>();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const disputesData = await fetchDisputes(() =>
        disputeApi.getAllDisputes()
      );
      setDisputes(disputesData);

      // Calculate stats
      const stats = disputesData.reduce(
        (acc, dispute) => {
          acc.totalDisputes++;
          switch (dispute.status) {
            case "pending":
              acc.pendingDisputes++;
              break;
            case "under_review":
              acc.underReviewDisputes++;
              break;
            case "resolved":
              acc.resolvedDisputes++;
              break;
          }
          return acc;
        },
        {
          totalDisputes: 0,
          pendingDisputes: 0,
          underReviewDisputes: 0,
          resolvedDisputes: 0,
        }
      );

      setStats(stats);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const handleDisputeAction = async (
    disputeId: string,
    action: "approve" | "reject"
  ) => {
    try {
      const newStatus = action === "approve" ? "resolved" : "pending";
      await disputeApi.updateDisputeStatus(disputeId, newStatus);

      // Refresh data
      await loadAdminData();
    } catch (error) {
      console.error("Error updating dispute:", error);
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage disputes and monitor system activity.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Disputes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalDisputes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingDisputes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Under Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.underReviewDisputes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.resolvedDisputes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Disputes Management */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">All Disputes</h2>
            <Button onClick={loadAdminData} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : disputes.length > 0 ? (
            <div className="space-y-4">
              {disputes.map((dispute) => {
                const StatusIcon = getStatusIcon(dispute.status);
                return (
                  <div key={dispute.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {dispute.itemName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {dispute.reason}
                          </p>
                          <p className="text-xs text-gray-400">
                            User: {dispute.userId} | Created:{" "}
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusColor(dispute.status)}>
                          {dispute.status.replace("_", " ")}
                        </Badge>

                        {dispute.status === "under_review" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleDisputeAction(dispute.id, "approve")
                              }
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDisputeAction(dispute.id, "reject")
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {dispute.description && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">
                          {dispute.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No disputes found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
