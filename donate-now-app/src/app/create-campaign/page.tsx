"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  FileText,
  Calendar,
  DollarSign,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/footer";
import DashboardHeader from "@/components/dashboardheader";
import withAuth from "@/components/withAuth";
import { useEffect } from "react";
import { getAuthToken } from "@/utils/auth";

function CreateCampaignPage() {
  const [token, setToken] = useState<string>();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "education",
    description: "",
    startDate: "",
    endDate: "",
    fundingGoal: "",
    confirmation: false,
  });
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    endDate: "",
    fundingGoal: "",
    confirmation: "",
  });

  const validateStep1 = () => {
    const newErrors = {
      title:
        formData.title.length < 10
          ? "Title must be at least 10 characters"
          : formData.title.length > 80
          ? "Title must be less than 80 characters"
          : "",
      category: !formData.category ? "Please select a category" : "",
      description:
        formData.description.length < 50
          ? "Description must be at least 50 characters"
          : "",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const validateStep2 = () => {
    const today = new Date().toISOString().split("T")[0];
    const newErrors = {
      startDate: !formData.startDate
        ? "Start date is required"
        : formData.startDate < today
        ? "Start date cannot be in the past"
        : "",
      endDate: !formData.endDate
        ? "End date is required"
        : formData.endDate <= formData.startDate
        ? "End date must be after start date"
        : "",
      fundingGoal: !formData.fundingGoal
        ? "Funding goal is required"
        : Number(formData.fundingGoal) < 1
        ? "Minimum funding goal is 1 ETH"
        : "",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const validateStep3 = () => {
    const newErrors = {
      confirmation: !formData.confirmation
        ? "You must confirm the information is accurate"
        : "",
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  const handleContinue = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    if (step === 3) isValid = validateStep3();

    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: {
    target: { name: any; value: any; type: any; checked: any };
  }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCategoryChange = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  async function handleSubmit(token: any) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            goal: formData.fundingGoal,
            createdAt: formData.startDate,
            endDate: formData.endDate,
            description: formData.description,
          }),
        }
      );
      
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  }

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    setToken(token);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-violet-900 to-indigo-800 py-12">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {step === 1 ? "Create a Campaign" : "Campaign Details"}
            </h1>
            <p className="text-violet-100 max-w-2xl mx-auto">
              {step === 1
                ? "Start your fundraising journey and make a difference in the world"
                : "Provide more details about your campaign to attract donors"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                {/* Step indicators */}
                <div className="text-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      step >= 1
                        ? "bg-violet-700 text-white"
                        : "bg-slate-200 text-slate-500"
                    } flex items-center justify-center mx-auto mb-2`}
                  >
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : 1}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      step >= 1 ? "text-violet-700" : "text-slate-500"
                    }`}
                  >
                    Basic Info
                  </div>
                </div>

                {/* Step 2: Details */}
                <div className="text-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      step >= 2
                        ? "bg-violet-700 text-white"
                        : "bg-slate-200 text-slate-500"
                    } flex items-center justify-center mx-auto mb-2`}
                  >
                    {step > 2 ? <CheckCircle className="h-5 w-5" /> : 2}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      step >= 2 ? "text-violet-700" : "text-slate-500"
                    }`}
                  >
                    Details
                  </div>
                </div>

                {/* Step 3: Review */}
                <div className="text-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      step == 3
                        ? "bg-violet-700 text-white"
                        : "bg-slate-200 text-slate-500"
                    } flex items-center justify-center mx-auto mb-2`}
                  >
                    3
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      step == 3 ? "text-violet-700" : "text-slate-500"
                    }`}
                  >
                    Review
                  </div>
                </div>
              </div>
              <Progress
                value={(step / 3) * 100}
                className="h-2 bg-slate-200"
                indicatorClassName="bg-violet-600"
              />
            </div>

            {/* Step 1: Basic Info Form */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Basics</CardTitle>
                  <CardDescription>
                    Let's start with the essential information about your
                    campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Campaign Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a clear, specific title for your campaign"
                      className={`w-full ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                    <p className="text-sm text-slate-500">
                      Your title should be specific and memorable (50-80
                      characters recommended)
                    </p>
                  </div>

                  {/* Campaign Category */}
                  <div className="space-y-2">
                    <Label>Campaign Category</Label>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category}</p>
                    )}
                    <RadioGroup
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                      className="grid grid-cols-2 gap-4"
                    >
                      {[
                        {
                          value: "education",
                          label: "Education",
                          icon: <FileText className="h-4 w-4" />,
                        },
                        {
                          value: "health",
                          label: "Health",
                          icon: <HeartPulse className="h-4 w-4" />,
                        },
                        {
                          value: "environment",
                          label: "Environment",
                          icon: <Target className="h-4 w-4" />,
                        },
                        {
                          value: "community",
                          label: "Community",
                          icon: <Users className="h-4 w-4" />,
                        },
                        {
                          value: "emergency",
                          label: "Emergency Relief",
                          icon: <AlertTriangle className="h-4 w-4" />,
                        },
                      ].map((category) => (
                        <Label
                          key={category.value}
                          htmlFor={category.value}
                          className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-slate-50"
                        >
                          <RadioGroupItem
                            value={category.value}
                            id={category.value}
                          />
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mr-2">
                              {category.icon}
                            </div>
                            <span>{category.label}</span>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Campaign Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your campaign and why it matters..."
                      className={`min-h-[150px] ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-sm text-slate-500">
                      Tell your story clearly and emotionally. Explain the
                      problem, your solution, and how funds will be used.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Draft</Button>
                  <Button
                    className="bg-violet-700 hover:bg-violet-800"
                    onClick={handleContinue}
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>
                    Provide additional information to help donors understand
                    your campaign better
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Campaign Timeline */}
                  <div className="space-y-2">
                    <Label>Campaign Timeline</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <div className="relative">
                          <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                          <Input
                            id="start-date"
                            name="startDate"
                            type="date"
                            value={
                              formData.startDate
                                ? new Date(formData.startDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const isoDate = new Date(
                                e.target.value
                              ).toISOString();
                              setFormData({ ...formData, startDate: isoDate });
                            }}
                            className={`pl-10 w-full ${
                              errors.startDate ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.startDate && (
                          <p className="text-sm text-red-500">
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <div className="relative">
                          <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                          <Input
                            id="end-date"
                            name="endDate"
                            type="date"
                            value={
                              formData.endDate
                                ? new Date(formData.endDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const isoDate = new Date(
                                e.target.value
                              ).toISOString();
                              setFormData({ ...formData, endDate: isoDate });
                            }}
                            className={`pl-10 w-full ${
                              errors.endDate ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="text-sm text-red-500">
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Set a timeline for your campaign to create urgency.
                    </p>
                  </div>

                  {/* Funding Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="funding-goal">Funding Goal</Label>
                    <div className="relative">
                      <DollarSign className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                      <Input
                        id="funding-goal"
                        name="fundingGoal"
                        type="number"
                        value={formData.fundingGoal}
                        onChange={handleChange}
                        placeholder="Enter your funding goal"
                        className={`pl-10 w-full ${
                          errors.fundingGoal ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.fundingGoal && (
                      <p className="text-sm text-red-500">
                        {errors.fundingGoal}
                      </p>
                    )}
                    <p className="text-sm text-slate-500">
                      Specify the amount you need to raise for your campaign.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    className="bg-violet-700 hover:bg-violet-800"
                    onClick={handleContinue}
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Review Form */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Campaign</CardTitle>
                  <CardDescription>
                    Review all the details before submitting your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Campaign Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Campaign Summary</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700">
                        <strong>Title:</strong> {formData.title}
                      </p>
                      <p className="text-sm text-slate-700">
                        <strong>Category:</strong> {formData.category}
                      </p>
                      <p className="text-sm text-slate-700">
                        <strong>Description:</strong>{" "}
                        {formData.description.substring(0, 50)}...
                      </p>
                      <p className="text-sm text-slate-700">
                        <strong>Funding Goal:</strong> {formData.fundingGoal} ETH
                      </p>
                      <p className="text-sm text-slate-700">
                        <strong>Timeline:</strong> {formData.startDate} to{" "}
                        {formData.endDate}
                      </p>
                    </div>
                  </div>

                  {/* Confirmation */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="confirmation"
                        name="confirmation"
                        checked={formData.confirmation}
                        onChange={handleChange}
                        className={`w-4 h-4 ${
                          errors.confirmation ? "border-red-500" : ""
                        }`}
                      />
                      <Label htmlFor="confirmation">
                        I confirm that all the information provided is accurate.
                      </Label>
                    </div>
                    {errors.confirmation && (
                      <p className="text-sm text-red-500">
                        {errors.confirmation}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    className="bg-violet-700 hover:bg-violet-800"
                    onClick={() => {
                      if (validateStep3()) {
                        // Submit form logic here
                        handleSubmit(token);
                        window.location.replace("/dashboard")
                      }
                    }}
                  >
                    Submit Campaign
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Tips Section */}
            <div className="mt-8 bg-violet-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-violet-900">
                Tips for a Successful Campaign
              </h3>
              <div className="space-y-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-violet-700 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-violet-900">
                      Be Specific and Transparent
                    </h4>
                    <p className="text-sm text-violet-700">
                      Clearly explain your goals and how the funds will be used.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-violet-700 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-violet-900">
                      Tell Your Story
                    </h4>
                    <p className="text-sm text-violet-700">
                      Personal stories create emotional connections with
                      potential donors.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-violet-700 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-violet-900">
                      Use High-Quality Images
                    </h4>
                    <p className="text-sm text-violet-700">
                      Campaigns with quality images raise 2x more than those
                      without.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(CreateCampaignPage);
