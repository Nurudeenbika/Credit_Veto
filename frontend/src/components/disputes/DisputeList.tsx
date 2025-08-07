"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useApi } from "@/hooks/useApi";
import { disputeApi } from "@/lib/api";
import { Dispute } from "@/lib/types";
import { DisputeCard } from "./DisputeCard";
import { Search, Filter, RefreshCw } from "lucide-react";

export const DisputeList: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { loading, execute: fetchDisputes } = useApi<Dispute[]>();

  useEffect(() => {
    loadDisputes();
  }, []);

  useEffect(() => {
    filterAndSortDisputes();
  }, [disputes, searchTerm, statusFilter, sortBy]);

  const loadDisputes = async () => {
    try {
      const disputesData = await fetchDisputes(() => disputeApi.getDisputes());
      setDisputes(disputesData);
    } catch (error) {
      console.error("Error loading disputes:", error);
    }
  };

  const filterAndSortDisputes = () => {
    let filtered = [...disputes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dispute) =>
          dispute.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dispute.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((dispute) => dispute.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        case "name":
          return a.itemName.localeCompare(b.itemName);
        default:
          return 0;
      }
    });

    setFilteredDisputes(filtered);
  };

  const handleDisputeUpdate = async () => {
    await loadDisputes();
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return disputes.length;
    return disputes.filter((dispute) => dispute.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Disputes</h1>
          <p className="text-gray-600">
            Track and manage your credit report disputes
          </p>
        </div>
        <Button onClick={loadDisputes} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div>
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              >
                <option value="all">
                  All Status ({getStatusCount("all")})
                </option>
                <option value="pending">
                  Pending ({getStatusCount("pending")})
                </option>
                <option value="under_review">
                  Under Review ({getStatusCount("under_review")})
                </option>
                <option value="resolved">
                  Resolved ({getStatusCount("resolved")})
                </option>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Select value={sortBy} onChange={(value) => setSortBy(value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="status">By Status</option>
                <option value="name">By Name</option>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredDisputes.length} of {disputes.length} disputes
            </div>
          </div>
        </div>
      </Card>

      {/* Disputes List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredDisputes.length > 0 ? (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onUpdate={handleDisputeUpdate}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No disputes match your filters"
                : "No disputes yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Start by reviewing your credit profile and disputing any inaccurate items."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button variant="primary">View Credit Profile</Button>
            )}
          </div>
        </Card>
      )}

      {/* Summary Stats */}
      {disputes.length > 0 && (
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Dispute Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  {getStatusCount("pending")}
                </div>
                <div className="text-sm text-yellow-800">Pending</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {getStatusCount("under_review")}
                </div>
                <div className="text-sm text-blue-800">Under Review</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {getStatusCount("resolved")}
                </div>
                <div className="text-sm text-green-800">Resolved</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
