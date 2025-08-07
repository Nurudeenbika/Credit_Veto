"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CreditProfile } from "@/components/profile/CreditProfile";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Credit Profile</h1>
            <p className="text-gray-600 mt-2">
              View your credit information and create disputes for inaccurate
              items
            </p>
          </div>

          <CreditProfile />
        </div>
      </div>
    </ProtectedRoute>
  );
}
