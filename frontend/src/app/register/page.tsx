"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegiterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="p-8 shadow-xl border-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign up your credit management account
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">
                Demo Accounts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Admin:</span>
                  <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                    admin@example.com / admin123
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">User:</span>
                  <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                    user@example.com / user123
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
