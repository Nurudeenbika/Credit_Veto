"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DisputeList } from "@/components/disputes/DisputeList";

export default function DisputesPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dispute History
            </h1>
            <p className="text-gray-600 mt-2">
              Track the status of your credit report disputes
            </p>
          </div>

          <DisputeList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
