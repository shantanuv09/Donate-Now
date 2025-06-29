"use client";

import Image from "next/image";
import {
  Clock,
  Search,
  Filter,
  CheckCircle,
  UserCheck,
  UserX,
  Building2,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboardheader";
import withAuth from "@/components/withAuth";
import { getAuthToken } from "@/utils/auth";
import { json } from "stream/consumers";
import Link from "next/link";

interface DecodedToken {
  userId: any;
  role: any;
}

function AdminDashboardPage() {
  const [organizerRequests, setOrganizerRequests] = useState<string[]>([]);
  const [token, setToken] = useState<string>();
  const [organizer, setOrganizer] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    setToken(token);

    getOrganizerRequests(token).catch((error) => {
      console.error("Invalid token:", error);
    });
    fetchAllCampaigns();
  }, []);

  async function getOrganizerRequests(token: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResponse = await response.json();
      setOrganizerRequests(
        jsonResponse.filter(
          (user: any) =>
            user.role === "organizer" && user.organizerStatus === false
        )
      );
      console.log(jsonResponse)
    } catch (error) {
      console.error("Error fetching org details:", error);
    }
  }

  async function acceptOrgRequest(id: any, token: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/accept/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error accepting org:", error);
    }
  }

  async function rejectOrgRequest(id: any, token: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error reject org:", error);
    }
  }

  async function fetchAllCampaigns() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns`
      );
      const jsonResponse = await response.json();
      setCampaigns(jsonResponse);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }

  async function handleCampaignApproval(id:any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      )
      window.location.reload()
    } catch (error) {
      console.error("Error approving campaign:", error);
    }
  }

  async function handleCampaignRejection(id: any) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      )
      window.location.reload()
    } catch (error) {
      console.error("Error approving campaign:", error);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
              <p className="text-slate-500">Platform overview and management</p>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="organizers" className="mb-8">
            <TabsList className="bg-white border w-full justify-start mb-6">
              <TabsTrigger value="organizers">
                Organizer Requests ({organizerRequests.length})
              </TabsTrigger>
              <TabsTrigger value="all">All Campaigns ({campaigns.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending Approval ({campaigns.filter((c) => !c.isApproved).length})
              </TabsTrigger>
              <TabsTrigger value="active">Active ({campaigns
                .filter((c) => (c.isApproved && !c.isCompleted)).length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({campaigns.filter((c) => (c.isCompleted)).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="organizers">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Organizer Approval Requests
                </h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search organizers..."
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {organizerRequests.map((request) => (
                  <Card key={request.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <div className="flex items-center mb-4">
                          
                          <div>
                            <h3 className="font-semibold text-lg">
                              {request.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {request.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 text-slate-500 mr-2" />
                            <span className="text-sm font-medium">
                              {request.orgName}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-slate-500 mr-2" />
                            <span className="text-sm">
                              Applied:{" "}
                              {`${new Date(request.createdAt)
                                .getDate()
                                .toString()
                                .padStart(2, "0")}-${(
                                new Date(request.createdAt).getMonth() + 1
                              )
                                .toString()
                                .padStart(2, "0")}-${new Date(
                                request.createdAt
                              ).getFullYear()}`}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mt-2">
                              Wallet Address:
                            </p>
                            <p className="text-xs font-mono bg-slate-100 p-1 rounded">
                              {request.walletAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-2/4">
                        <h4 className="font-medium mb-2 text-slate-700">
                          Organization Description
                        </h4>
                        <p className="text-sm text-slate-600 mb-4">
                          {request.orgDescription}
                        </p>
                      </div>

                      <div className="md:w-1/4 flex flex-col justify-between">
                        <div>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-4">
                            Pending Review
                          </Badge>

                          <div className="bg-violet-50 p-3 rounded-lg border border-violet-100 mb-4">
                            <p className="text-xs text-violet-800">
                              Organizers can create campaigns and receive
                              donations after approval. Verify their identity
                              and organization details before approving.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
                            onClick={() => acceptOrgRequest(request.id, token)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center"
                          >
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Request More Info
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-full flex items-center justify-center"
                            onClick={() => rejectOrgRequest(request.id, token)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Campaign Management</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-left">
                          Campaign
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Progress
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Created
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Status
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-4 w-1/5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={campaign.imgUrl || "/placeholder.svg"}
                                  alt={campaign.title}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {campaign.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {campaign.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex flex-col items-center w-full">
                              <div className="w-[80%]">
                                <Progress
                                  value={Math.round(
                                    (campaign.fundsRaised * 100) / campaign.goal
                                  )}
                                  className="h-2 bg-slate-200 w-full"
                                  indicatorClassName="bg-violet-600"
                                />
                              </div>
                              <span className="text-sm mt-1">
                                {Math.round(
                                  (campaign.fundsRaised * 100) / campaign.goal
                                )}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center text-slate-500">
                            {new Date(campaign.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <Badge
                              className={
                                campaign.isCompleted
                                  ? "bg-blue-100 text-blue-800 border-blue-200" // Completed
                                  : !campaign.isApproved
                                  ? "bg-amber-100 text-amber-800 border-amber-200" // Pending (Not Approved)
                                  : "bg-green-100 text-green-800 border-green-200" // Active
                              }
                            >
                              {campaign.isCompleted
                                ? "Completed"
                                : !campaign.isApproved
                                ? "Pending"
                                : "Active"}
                            </Badge>
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm">
                                <Link href={`/campaigns/${campaign.id}`}>
                                  View
                                </Link>
                              </Button>
                              {!campaign.isApproved && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleCampaignApproval(campaign.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleCampaignRejection(campaign.id)}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Campaign Pending Approval
                </h2>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                  <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-left">
                          Campaign
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Goal
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Created
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns
                        .filter((c) => !c.isApproved)
                        .map((campaign) => (
                          <tr
                          key={campaign.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-4 w-1/5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={campaign.imgUrl || "/placeholder.svg"}
                                  alt={campaign.title}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {campaign.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {campaign.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex flex-col items-center w-full">
                              <div className="w-[80%]">
                                {campaign.goal} ETH
                              </div>
                              
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center text-slate-500">
                            {new Date(campaign.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm">
                              <Link href={`/campaigns/${campaign.id}`}>
                                  View
                                </Link>
                              </Button>
                              {!campaign.isApproved && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleCampaignApproval(campaign.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleCampaignRejection(campaign.id)}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="active">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Ongoing Campaigns</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-left">
                          Campaign
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Progress
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Created
                        </th>
                  
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns
                        .filter((c) => (c.isApproved && !c.isCompleted))
                        .map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-4 w-1/5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={campaign.imgUrl || "/placeholder.svg"}
                                  alt={campaign.title}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {campaign.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {campaign.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex flex-col items-center w-full">
                              <div className="w-[80%]">
                                <Progress
                                  value={Math.round(
                                    (campaign.fundsRaised * 100) / campaign.goal
                                  )}
                                  className="h-2 bg-slate-200 w-full"
                                  indicatorClassName="bg-violet-600"
                                />
                              </div>
                              <span className="text-sm mt-1">
                                {Math.round(
                                  (campaign.fundsRaised * 100) / campaign.goal
                                )}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center text-slate-500">
                            {new Date(campaign.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex justify-center gap-2">
                              <Button variant="outline" size="sm">
                              <Link href={`/campaigns/${campaign.id}`}>
                                  View
                                </Link>
                              </Button>
                              
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </TabsContent>

            <TabsContent value="completed">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Completed Campaigns</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search campaigns..."
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-left">
                          Campaign
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Progress
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Funds Raised
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Created
                        </th>
                        <th className="p-4 font-medium text-slate-500 w-1/5 text-center">
                          Ended
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns
                        .filter((c) => c.isCompleted)
                        .map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="border-b hover:bg-slate-50"
                        >
                          <td className="p-4 w-1/5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded bg-slate-200 overflow-hidden mr-3 flex-shrink-0">
                                <Image
                                  src={campaign.imgUrl || "/placeholder.svg"}
                                  alt={campaign.title}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {campaign.title}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {campaign.category}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex flex-col items-center w-full">
                              <div className="w-[80%]">
                                <Progress
                                  value={Math.round(
                                    (campaign.fundsRaised * 100) / campaign.goal
                                  )}
                                  className="h-2 bg-slate-200 w-full"
                                  indicatorClassName="bg-violet-600"
                                />
                              </div>
                              <span className="text-sm mt-1">
                                {Math.round(
                                  (campaign.fundsRaised * 100) / campaign.goal
                                )}
                                %
                              </span>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center">
                            <div className="flex flex-col items-center w-full">
                              <div className="w-[80%]">
                                {
                                  campaign.fundsRaised
                                } ETH
                              </div>
                            </div>
                          </td>
                          <td className="p-4 w-1/5 text-center text-slate-500">
                            {new Date(campaign.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="p-4 w-1/5 text-center text-slate-500">
                            {new Date(campaign.endDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default withAuth(AdminDashboardPage);
