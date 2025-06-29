"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Flag,
  Clock,
  Calendar,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Goal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";
import DashboardHeader from "@/components/dashboardheader";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/auth";
import { ethers } from 'ethers';
import { useParams } from "next/navigation";
import withAuth from "@/components/withAuth";
import { jwtDecode } from "jwt-decode";

function CampaignDetailsPage() {
  const params = useParams();
  const [token, setToken] = useState<string>();
  const [campaign, setCampaign] = useState<string[]>([]);
  const [organizer, setOrganizer] = useState<string[]>([]);
  const [amount, setAmount] = useState("");

  async function getCampaign(id: any, token: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResponse = await response.json();
      setCampaign(jsonResponse);
      getOrganizer(jsonResponse.organizerId, token);
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  }

  async function getOrganizer(organizerId: string, token: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/users/${organizerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResponse = await response.json();
      setOrganizer(jsonResponse);
    } catch (error) {
      console.error("Error fetching organizer:", error);
    }
  }

  function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
  }

  useEffect(() => {
    try {
      const token = getAuthToken();
      if (!token) return;
      setToken(token);
      getCampaign(String(params.id), token);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, [params?.id]);

  async function donate(amount: string, campaignAddress: string, isCompleted: boolean) {
    if (!window.ethereum) return alert("MetaMask not installed!");
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Convert amount from ETH to Wei
      const value = ethers.parseEther(amount);
  
      // Send transaction to campaign's smart contract
      const tx = await signer.sendTransaction({
        to: campaignAddress, // The smart contract address
        value: value,
      });
      if (token && tx){
        const decodedToken = jwtDecode(token)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/donations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              donorId: decodedToken.userId,
              campaignId: campaign.id,
              amount: Number.parseFloat(amount),
              transactionHash: tx.hash
            })
          }
        )
        const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns/${campaign.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              amount: Number.parseFloat(amount),
              isCompleted
            })
          }
        )
        const jsonResponse = await response2.json()
        console.log(jsonResponse)
      }
      
      window.location.reload()
      
    } catch (error) {
      console.error("Donation failed:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1">
        {/* Campaign Header */}
        <section className="bg-gradient-to-r from-violet-900 to-indigo-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center text-white">
              <div className="w-full md:w-auto mb-2 md:mb-0 md:mr-4">
                <Link
                  href="/campaigns"
                  className="text-violet-200 hover:text-white flex items-center"
                >
                  <ChevronRight className="rotate-180 h-4 w-4 mr-1" />
                  All Campaigns
                </Link>
              </div>
              <Badge className="bg-violet-700 text-white border-violet-600 mr-2">
                {campaign.category}
              </Badge>
              <Badge
                variant="outline"
                className="border-violet-400 text-violet-100"
              >
                <Clock className="h-3 w-3 mr-1" />{" "}
                {calculateDaysBetween((new Date()).toISOString(), campaign.endDate) > 0
                                  ? `${Math.round(calculateDaysBetween((new Date()).toISOString(), campaign.endDate))}days left`
                                  : "Ended"}
                
              </Badge>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                {campaign.title}
              </h1>
              {/* Campaign Image */}
              <div className="rounded-xl overflow-hidden mb-8">
                <Image
                  src={campaign.imgUrl || "/placeholder.svg"}
                  alt={campaign.title}
                  width={1000}
                  height={500}
                  className="w-full h-auto"
                />
              </div>

              {/* Campaign Tabs */}
              <Tabs defaultValue="about" className="mb-8">
                <TabsList className="bg-white border w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <div
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                  ></div>
                </TabsContent>
              </Tabs>
              {/* Campaign Creator */}
              <Card className="p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Campaign Creator</h3>
                <div className="flex items-center">
                  
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold">{organizer.name}</h4>
                      {organizer.organizerStatus && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {/* <span>{campaign.creator.campaignsCreated} campaigns created</span> */}
                      <span className="mx-2">•</span>
                      <span>
                        Joined{" "}
                        {new Date(organizer.createdAt).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Donation Card */}
                <Card className="p-6 mb-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-lg">
                        {campaign.fundsRaised} ETH
                      </span>
                      <span className="text-slate-500">
                        of {campaign.goal} ETH
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (campaign.fundsRaised * 100) / campaign.goal
                      )}
                      className="h-2 bg-slate-200"
                      indicatorClassName="bg-violet-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-violet-700 font-semibold">
                      {calculateDaysBetween((new Date()).toISOString(), campaign.endDate) > 0
                                  ? Math.round(calculateDaysBetween((new Date()).toISOString(), campaign.endDate))
                                  : "0"}
                      </div>
                      <div className="text-xs text-slate-500">Days Left</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-violet-700 font-semibold">
                        {Math.round(
                          (campaign.fundsRaised * 100) / campaign.goal
                        )}
                        %
                      </div>
                      <div className="text-xs text-slate-500">Funded</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="grid grid-cols-3 gap-2">
                        {[0.01, 0.1, 1].map((amt) => (
                          <Button
                            key={amt}
                            variant="outline"
                            className="w-full"
                            onClick={() => setAmount(String(amt))} // Convert number to string
                          >
                            {amt} ETH
                          </Button>
                        ))}
                      </div>

                      <div className="relative mt-2">
                        <input
                          type="text"
                          value={amount} // Bind state to input value
                          onChange={(e) => setAmount(e.target.value)} // Allow manual input
                          placeholder="Custom Amount"
                          className="w-full p-2 pl-5 border border-slate-300 rounded-md"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-700">
                          ETH
                        </span>
                      </div>
                    </div>

                    <Button className="w-full bg-violet-700 hover:bg-violet-800 py-6 text-lg" onClick={(campaign.fundsRaised + amount < campaign.goal)?() => donate(amount, organizer.walletAddress, false) : () => donate(amount, organizer.walletAddress, true)}>
                      Donate Now
                    </Button>

                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600"
                      >
                        <Heart className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600"
                      >
                        <Share2 className="h-4 w-4 mr-1" /> Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600"
                      >
                        <Flag className="h-4 w-4 mr-1" /> Report
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Campaign Info Card */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Campaign Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-violet-700 mr-3 mt-0.5" />
                      <div>
                        <div className="font-medium">Created On</div>
                        <div className="text-sm text-slate-500">
                          {new Date(campaign.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />
                    <div className="bg-violet-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-violet-700 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-violet-900">
                            Verified Campaign
                          </div>
                          <div className="text-sm text-violet-700">
                            This campaign has been verified by our team and
                            meets our trust and safety standards.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(CampaignDetailsPage);
