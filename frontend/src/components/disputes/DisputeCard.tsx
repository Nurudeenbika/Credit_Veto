"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dispute } from "@/lib/types";
import {
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

interface DisputeCardProps {
  dispute: Dispute;
  onUpdate?: () => void;
}

export const DisputeCard: React.FC<DisputeCardProps> = ({
  dispute,
  onUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);

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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Your dispute has been received and is waiting to be processed.";
      case "under_review":
        return "Your dispute is currently being reviewed by our team and the credit bureau.";
      case "resolved":
        return "Your dispute has been resolved. Check your updated credit report.";
      default:
        return "Status unknown.";
    }
  };

  const StatusIcon = getStatusIcon(dispute.status);

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <StatusIcon className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {dispute.itemName}
              </h3>
              <p className="text-sm text-gray-500">
                Account: {dispute.accountNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant={getStatusColor(dispute.status)}>
              {dispute.status.replace("_", " ")}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1"
            >
              <span>Details</span>
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {new Date(dispute.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>Reason: {dispute.reason}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>
              Updated: {new Date(dispute.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Status Description */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            {getStatusDescription(dispute.status)}
          </p>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="border-t pt-4 space-y-4">
            {/* Dispute Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Dispute Information
              </h4>
              <div className="bg-gray-50 rounded p-3 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Dispute ID:
                    </span>
                    <span className="ml-2 text-gray-600">{dispute.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Account Number:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {dispute.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Item Name:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {dispute.itemName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reason:</span>
                    <span className="ml-2 text-gray-600">{dispute.reason}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {dispute.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </h4>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-700">{dispute.description}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">
                    Dispute created on{" "}
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {dispute.status !== "pending" && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Status updated to "{dispute.status.replace("_", " ")}" on{" "}
                      {new Date(dispute.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {dispute.status === "resolved" && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      Dispute resolved on{" "}
                      {new Date(dispute.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-gray-500">
                Last updated: {new Date(dispute.updatedAt).toLocaleString()}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>

                {dispute.status === "resolved" && (
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Download Report
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
