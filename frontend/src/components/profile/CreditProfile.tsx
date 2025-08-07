"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { creditApi } from "@/lib/api";
import { CreditProfile as CreditProfileType, CreditItem } from "@/lib/types";
import { DisputeForm } from "./DisputeForm";
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  RefreshCw,
} from "lucide-react";

interface CreditProfileProps {
  onDisputeCreated?: () => void;
}

export const CreditProfile: React.FC<CreditProfileProps> = ({
  onDisputeCreated,
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CreditProfileType | null>(null);
  const [selectedItem, setSelectedItem] = useState<CreditItem | null>(null);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const { loading, execute: fetchProfile } = useApi<CreditProfileType>();

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (user?.id) {
      try {
        const profileData = await fetchProfile(() =>
          creditApi.getCreditProfile(user.id)
        );
        setProfile(profileData);
      } catch (error) {
        console.error("Error loading credit profile:", error);
      }
    }
  };

  const handleDisputeItem = (item: CreditItem) => {
    setSelectedItem(item);
    setShowDisputeForm(true);
  };

  const handleDisputeSubmitted = () => {
    setShowDisputeForm(false);
    setSelectedItem(null);
    if (onDisputeCreated) {
      onDisputeCreated();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 750) return "Excellent";
    if (score >= 650) return "Good";
    if (score >= 550) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <div className="p-6 text-center">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No credit profile data available</p>
          <Button onClick={loadProfile}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Profile
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credit Score Overview */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Credit Score Overview</h2>
            <Button onClick={loadProfile} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(profile.score)}`}
              >
                {profile.score}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getScoreDescription(profile.score)}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Report Date</p>
                <p className="text-lg">
                  {new Date(profile.reportDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Open Accounts
                </p>
                <p className="text-lg">{profile.openAccounts}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Total Balance
                </p>
                <p className="text-lg">
                  ${profile.totalBalance?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Credit Items */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Credit Report Items</h2>
            <Badge variant="secondary">
              {profile.items?.length || 0} items
            </Badge>
          </div>

          {profile.items && profile.items.length > 0 ? (
            <div className="space-y-4">
              {profile.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <Badge
                          variant={
                            item.status === "negative"
                              ? "destructive"
                              : "success"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Account Number:</span>
                          <span className="ml-1">{item.accountNumber}</span>
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span>
                          <span className="ml-1">
                            ${item.balance?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Last Updated:</span>
                          <span className="ml-1">
                            {new Date(item.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm text-gray-700">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="ml-4">
                      <Button
                        onClick={() => handleDisputeItem(item)}
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Dispute
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No credit items found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Dispute Form Modal */}
      {showDisputeForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Dispute Credit Item</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDisputeForm(false)}
                >
                  ×
                </Button>
              </div>

              <DisputeForm
                creditItem={selectedItem}
                onSubmit={handleDisputeSubmitted}
                onCancel={() => setShowDisputeForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
