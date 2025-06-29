"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ArrowUpDown, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboardheader";
import withAuth from "@/components/withAuth";
import { getAuthToken } from "@/utils/auth";

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [token, setToken] = useState<string>();

  async function fetchCampaigns() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCampaigns(data);
      console.log("Fetched Campaigns:", data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  }

  useEffect(() => {
    try {
      const token = getAuthToken();
      if (!token) return;
      setToken(token);
      fetchCampaigns();
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
  }

  // Categories for filtering
  const categories = [
    "All Categories",
    "Education",
    "Health",
    "Environment",
    "Emergency Relief",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-violet-900 to-indigo-800 py-12">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Campaigns
            </h1>
            <p className="text-violet-100 max-w-2xl mx-auto">
              Find and support causes that align with your values and make a
              real difference in the world
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10 py-6 bg-white border-slate-200"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filters</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  <span>Sort</span>
                </Button>
                <div className="hidden md:flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none border-r"
                  >
                    <Grid size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-none">
                    <List size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={
                    index === 0
                      ? "bg-violet-700 hover:bg-violet-800"
                      : "hover:bg-violet-50"
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Campaign Listings */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="bg-white border">
                <TabsTrigger value="all">All Campaigns</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="ending">Ending Soon</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaigns
                    .filter((c) => c.isApproved && !c.isCompleted)
                    .map((campaign) => (
                      <Card
                        key={campaign.id}
                        className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="relative aspect-video bg-slate-200 overflow-hidden">
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-violet-900 z-10">
                            {Math.round(
                              (campaign.fundsRaised * 100) / campaign.goal
                            )}
                            % Funded
                          </div>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-violet-900 z-10">
                            {Math.round(
                              calculateDaysBetween(
                                new Date().toISOString(),
                                campaign.endDate
                              )
                            )}{" "}
                            days left
                          </div>
                          <Image
                            src={campaign.imgUrl || "/placeholder.svg"}
                            alt={campaign.title}
                            width={500}
                            height={300}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-2">
                            <Badge
                              variant="outline"
                              className="text-xs bg-violet-50 text-violet-700 border-violet-200"
                            >
                              {campaign.category}
                            </Badge>
                          </div>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <h3 className="font-bold text-lg mb-2 text-slate-900 hover:text-violet-700 transition-colors">
                              {campaign.title}
                            </h3>
                          </Link>
                          <div className="mb-3">
                            <Progress
                              value={Math.round(
                                (campaign.fundsRaised * 100) / campaign.goal
                              )}
                              className="h-2 bg-slate-200"
                              indicatorClassName="bg-violet-600"
                            />
                            <div className="flex justify-between mt-2 text-sm text-slate-600">
                              <span className="font-medium text-violet-700">
                                {campaign.fundsRaised} ETH raised
                              </span>
                              <span>of {campaign.goal} ETH goal</span>
                            </div>
                          </div>
                          
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="text-center py-12 text-slate-500">
                  <p>Trending campaigns will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="newest" className="mt-6">
                <div className="text-center py-12 text-slate-500">
                  <p>Newest campaigns will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="ending" className="mt-6">
                <div className="text-center py-12 text-slate-500">
                  <p>Campaigns ending soon will appear here</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-none border-r"
                >
                  Previous
                </Button>
                {[1].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "ghost"}
                    size="sm"
                    className={`rounded-none border-r min-w-[40px] ${
                      page === 1 ? "bg-violet-700 hover:bg-violet-800" : ""
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" className="rounded-none">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(CampaignsPage);
