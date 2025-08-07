"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useApi } from "@/hooks/useApi";
import { disputeApi } from "@/lib/api";
import { CreditItem } from "@/lib/types";
import { AlertTriangle, FileText } from "lucide-react";

interface DisputeFormProps {
  creditItem: CreditItem;
  onSubmit: () => void;
  onCancel: () => void;
}

const disputeReasons = [
  { value: "not_mine", label: "This account is not mine" },
  { value: "paid_in_full", label: "Account was paid in full" },
  { value: "incorrect_balance", label: "Incorrect balance amount" },
  { value: "incorrect_status", label: "Incorrect account status" },
  { value: "identity_theft", label: "Identity theft" },
  { value: "duplicate_entry", label: "Duplicate entry" },
  { value: "outdated_information", label: "Outdated information" },
  { value: "other", label: "Other (please specify)" },
];

export const DisputeForm: React.FC<DisputeFormProps> = ({
  creditItem,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    customReason: "",
  });

  const { loading, execute: submitDispute } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const disputeData = {
        itemName: creditItem.name,
        accountNumber: creditItem.accountNumber,
        reason:
          formData.reason === "other"
            ? formData.customReason
            : disputeReasons.find((r) => r.value === formData.reason)?.label ||
              formData.reason,
        description: formData.description,
      };

      await submitDispute(() => disputeApi.createDispute(disputeData));
      onSubmit();
    } catch (error) {
      console.error("Error creating dispute:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Credit Item Summary */}
      <Card>
        <div className="p-4 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium">Disputing Credit Item</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Account:</span>
              <span className="ml-2">{creditItem.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Account Number:</span>
              <span className="ml-2">{creditItem.accountNumber}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Balance:</span>
              <span className="ml-2">
                ${creditItem.balance?.toLocaleString() || "0"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="ml-2">{creditItem.status}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Dispute Reason */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Dispute *
          </label>
          <Select
            id="reason"
            value={formData.reason}
            onChange={(value) => handleChange("reason", value)}
            required
            placeholder="Select a reason for disputing this item"
          >
            {disputeReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Custom Reason Input */}
        {formData.reason === "other" && (
          <div>
            <label
              htmlFor="customReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Please specify the reason *
            </label>
            <Input
              id="customReason"
              type="text"
              value={formData.customReason}
              onChange={(e) => handleChange("customReason", e.target.value)}
              placeholder="Enter your specific reason for disputing this item"
              required
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Additional Details
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide any additional details that support your dispute..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Include any relevant information such as payment receipts,
            correspondence, or timeline details.
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-yellow-800">Important Notice</h4>
            <p className="text-yellow-700 mt-1">
              By submitting this dispute, you are stating that the information
              provided is accurate and true. False or frivolous disputes may
              result in penalties. Your dispute will be reviewed by our team and
              forwarded to the appropriate credit bureau.
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={
            loading ||
            !formData.reason ||
            (formData.reason === "other" && !formData.customReason)
          }
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Dispute"
          )}
        </Button>
      </div>
    </form>
  );
};
