"use client";

import Image from "next/image";
import {
  BarChart3,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Copy,
  Wallet,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/footer";
import DashboardHeader from "@/components/dashboardheader";
import withAuth from "@/components/withAuth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "@/utils/auth";

interface DecodedToken {
  userId: any;
  role: any;
}

function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);
  const [donations, setDonations] = useState<{ amount: number }[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [campaignTitles, setCampaignTitles] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      fetchUserDetails(token);
      if (decodedToken.role === "organizer") {
        fetchOrgDetails(decodedToken.userId, token);
      } else if (decodedToken.role === "donor") {
        fetchDonations(decodedToken.userId);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  async function fetchOrgDetails(userId: string, token: any) {
    try {
      const orgResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/myCampaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            organizerId: userId,
          }),
        }
      );
      const orgDetails = await orgResponse.json();
      setTotalRaised(
        Array.isArray(orgDetails)
          ? orgDetails.reduce((sum, campaign) => sum + campaign.fundsRaised, 0)
          : 0
      );
      setCampaigns(orgDetails);
    } catch (error) {
      console.error("Error fetching org details:", error);
    }
  }

  async function fetchUserDetails(token: any) {
    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include access token
          },
        }
      );
      const userDetails = await userResponse.json();
      setUserDetails(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  async function fetchDonations(userId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/donations/${userId}`
      );
      const data = await response.json();
      setDonations(data);
      setTotalDonated(
        Array.isArray(data)
          ? data.reduce((sum, donation) => sum + donation.amount, 0)
          : 0
      );
      const campaignTitles = await Promise.all(
        data.map(async (donation: { campaignId: any }) => {
          const campaignResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/${donation.campaignId}`
          );
          const campaignData = await campaignResponse.json();
          return campaignData.title; // Extract only the title
        })
      );

      setCampaignTitles(campaignTitles);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  }

  function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
  }

  const user = {
    name: userDetails.name,
    email: userDetails.email,
    walletAddress: userDetails.walletAddress,
    isWalletVerified: userDetails.isWalletVerified,
    joinedDate: new Date(userDetails.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
  };

  // Define different card sets for each role
  const donorCards = [
    {
      title: "Total Donated",
      value: `${totalDonated} ETH`,
      icon: <Users className="h-6 w-6 text-violet-700" />,
    },
    {
      title: "Campaigns Participated",
      value: campaignTitles.length,
      icon: <BarChart3 className="h-6 w-6 text-violet-700" />,
    },
  ];

  const organizerCards = [
    {
      title: "Total Raised",
      value: `${totalRaised} ETH`,
      icon: <DollarSign className="h-6 w-6 text-violet-700" />,
    },
    {
      title: "Active Campaigns",
      value: campaigns.filter((campaign) => !campaign.isCompleted).length,
      icon: <BarChart3 className="h-6 w-6 text-violet-700" />,
    },
  ];

  // Choose which set of cards to render
  const dashboardCards = role === "organizer" ? organizerCards : donorCards;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500">Welcome back, {user.name}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button className="bg-violet-700 hover:bg-violet-800 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {role === "organizer" && (
                  <span>
                    <Link href="/create-campaign">New Campaign</Link>
                  </span>
                )}
                {role === "donor" && (
                  <span>
                    <Link href="/campaigns">Donate</Link>
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Dynamic Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {card.value}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="mb-8">
            <TabsList className="bg-white border w-full justify-start mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {role === "organizer" && (
                <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              )}
              {role === "donor" && (
                <TabsTrigger value="donations">My Donations</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="campaigns">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Campaigns</h2>
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

              <div className="space-y-6">
                {campaigns
                  .filter((campaign) => campaign.isApproved)
                  .map((campaign) => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 bg-slate-200 relative flex-shrink-0">
                          <Image
                            src={campaign.imgUrl || "/placeholder.svg"}
                            alt={campaign.title}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                          <Badge
                            className={`absolute top-2 left-2 ${
                              campaign.isCompleted === false
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {campaign.isCompleted === false
                              ? "Active"
                              : "Completed"}
                          </Badge>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg mb-2 text-slate-900">
                                {campaign.title}
                              </h3>
                              <p className="text-sm text-slate-500 mb-4">
                                Created on{" "}
                                {new Date(
                                  campaign.createdAt
                                ).toLocaleDateString("en-GB")}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between mb-1 text-sm">
                              <span className="font-medium">
                                {campaign.fundsRaised} ETH raised
                              </span>
                              <span className="text-slate-500">
                                of {campaign.goal} ETH goal
                              </span>
                            </div>
                            <Progress
                              value={
                                (campaign.fundsRaised * 100) / campaign.goal
                              }
                              className="h-2 bg-slate-200"
                              indicatorClassName="bg-violet-600"
                            />
                          </div>

                          <div className="flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex gap-4">
                              <div className="text-sm">
                                <span className="text-slate-500">Status:</span>
                                <span className="ml-1 font-medium">
                                  {campaign.isCompleted === false
                                    ? "Active"
                                    : "Completed"}
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-slate-500">
                                  Days Left:
                                </span>
                                <span className="ml-1 font-medium">
                                  {calculateDaysBetween(
                                    new Date().toISOString(),
                                    campaign.endDate
                                  ) > 0
                                    ? Math.round(
                                        calculateDaysBetween(
                                          new Date().toISOString(),
                                          campaign.endDate
                                        )
                                      )
                                    : "Ended"}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-violet-700 border-violet-200"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                className="bg-violet-700 hover:bg-violet-800"
                              >
                                View <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="donations">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Donations</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      placeholder="Search donations..."
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
                        <th className="text-left p-4 font-medium text-slate-500">
                          Campaign
                        </th>
                        <th className="text-left p-4 font-medium text-slate-500">
                          Amount
                        </th>
                        <th className="text-left p-4 font-medium text-slate-500">
                          Date
                        </th>
                        <th className="text-left p-4 font-medium text-slate-500">
                          Transaction Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.length > 0 ? (
                        donations.map((donation, index) => (
                          <tr
                            key={donation.id}
                            className="border-b hover:bg-slate-50"
                          >
                            {/* Match campaign title with donation */}
                            <td className="p-4">
                              {campaignTitles[index] || "Loading..."}
                            </td>
                            <td className="p-4 font-medium">
                              {donation.amount} ETH
                            </td>
                            <td className="p-4 text-slate-500">
                              {new Date(
                                donation.timestamp
                              ).toLocaleDateString("en-GB")}
                            </td>
                            <td className="p-4 text-slate-500">
                              <span className="font-mono text-xs">
                                {donation.transactionHash}
                              </span>
                              {donation.transactionHash && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-500 hover:text-slate-900 shrink-0"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      donation.trasactionHash
                                    )
                                  }
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-slate-500"
                          >
                            No donations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center">
                    {/* Wallet Status Badge (Top-right corner) */}
                    <div className="self-end mb-2">
                      <Badge
                        variant={
                          user.isWalletVerified ? "default" : "secondary"
                        }
                        className={`flex items-center gap-1 ${
                          user.isWalletVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isWalletVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Verified Wallet
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            Unverified
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Profile Content */}
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-slate-500 mb-4">{user.email}</p>

                    {/* Wallet Address with Copy Functionality */}
                    <div className="w-full max-w-[90%] mx-auto bg-slate-50 rounded-lg p-3 mb-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs font-medium text-slate-500 mb-1">
                          Wallet Address
                        </p>
                        <div className="flex items-center gap-2 w-full">
                          <p className="text-sm font-mono break-all px-2">
                            {user.walletAddress || "Not connected"}
                          </p>
                          {user.walletAddress && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-slate-900 shrink-0"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  user.walletAddress
                                )
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Member Since */}
                    <p className="text-sm text-slate-500">
                      Member since {user.joinedDate}
                    </p>

                    {/* Verification Prompt (if wallet not connected) */}
                    {!user.walletAddress && (
                      <Button variant="outline" size="sm" className="mt-4">
                        <Wallet className="h-4 w-4 mr-2" />
                        Connect Wallet
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent>
                    <h3 className="font-semibold text-lg mb-4">
                      Account Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">Change Password</h4>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="current-password">
                              Current Password
                            </Label>
                            <Input
                              id="current-password"
                              type="password"
                              placeholder="Enter current password"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="Enter new password"
                              className="mt-1"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                              Must be at least 8 characters long
                            </p>
                          </div>
                          <div>
                            <Label htmlFor="confirm-password">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm new password"
                              className="mt-1"
                            />
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button className="bg-violet-700 hover:bg-violet-800">
                              Update Password
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
