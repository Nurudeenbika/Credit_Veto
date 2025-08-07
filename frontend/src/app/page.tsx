"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CreditCard,
  FileText,
  Bot,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: CreditCard,
      title: "Credit Profile Management",
      description:
        "View and monitor your complete credit profile with real-time updates",
    },
    {
      icon: FileText,
      title: "Dispute Management",
      description:
        "Easily create and track credit report disputes through our streamlined process",
    },
    {
      icon: Bot,
      title: "AI-Powered Letters",
      description:
        "Generate professional dispute letters with our AI assistant",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your financial data is protected with enterprise-grade security",
    },
  ];

  const stats = [
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
    { number: "10k+", label: "Users Helped" },
    { number: "30 Days", label: "Avg Resolution" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Take Control of Your
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {" "}
                Credit Future
              </span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Monitor your credit profile, manage disputes, and get AI-powered
              assistance to improve your financial standing.
            </p>

            {user ? (
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-blue-900 hover:bg-gray-100"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="border-blue-700 text-blue hover:bg-blue hover:text-blue-900"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-700 text-blue hover:bg-blue hover:text-blue-900"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Credit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to
              monitor, dispute, and improve your credit score.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Improve Your Credit Score?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have successfully improved their credit
            scores with our platform.
          </p>

          {!user && (
            <Link href="/login">
              <Button
                size="lg"
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                Start Your Journey Today
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Credit Management System
            </h3>
            <p className="text-gray-400 mb-6">
              Empowering you to take control of your financial future
            </p>
            <div className="flex justify-center space-x-6 text-gray-400">
              <span>© 2024 Credit Management System</span>
              <span>|</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
