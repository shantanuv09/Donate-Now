"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, User, Wallet, ArrowLeft, ArrowRight, Building2, AlertTriangle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    walletAddress: "",
    is_wallet_verified: false,
    role: "donor",
    orgName: null,
    orgDescription: null,
  })

  // Password validation
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false,
  })

  // Check if MetaMask is installed on component mount
  useState(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true)
    }
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate password as user types
    if (name === "password" || name === "confirmPassword") {
      validatePassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword,
      )
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  // Validate password
  const validatePassword = (password: string, confirmPassword: string) => {
    setPasswordErrors({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      match: password === confirmPassword && password !== "",
    })
  }

  // Check if personal details form is valid
  const isPersonalDetailsValid = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return false
    }

    if (!passwordErrors.length || !passwordErrors.uppercase || !passwordErrors.lowercase || !passwordErrors.number) {
      setError("Please ensure your password meets all requirements")
      return false
    }

    if (!passwordErrors.match) {
      setError("Passwords do not match")
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (formData.role === "organizer" && !formData.orgName) {
      setError("Please enter your organization name")
      return false
    }

    return true
  }

  // Handle next step
  const handleNextStep = () => {
    setError(null)

    if (currentStep === 1) {
      if (isPersonalDetailsValid()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (!walletAddress) {
        setError("Please connect your MetaMask wallet")
        return
      }
      setCurrentStep(3)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setError(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Connect MetaMask wallet
  const connectMetaMask = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const address = accounts[0]
      setWalletAddress(address)
      setFormData((prev) => ({
        ...prev,
        walletAddress: address,
        is_wallet_verified: true,
      }))

      setSuccess("Wallet connected successfully!")
    } catch (err: any) {
      console.error("MetaMask connection error:", err)
      if (err.message.includes("User rejected")) {
        setError("Connection rejected. Please approve the MetaMask connection.")
      } else {
        setError(err.message || "Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // This would be an API call to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (response.status === 201){
        if (formData.role === "organizer") {
          setSuccess("Your organizer account request has been submitted for review. We'll notify you once it's approved.")
        } else {
          setSuccess("Account created successfully! Redirecting to login...")
        }
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Cannot create account. Please try again.")
        setTimeout(() => {
          router.push("/signup")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 3) * 100

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                <CardDescription>Join DonateNow as a donor or an organizer and support causes you care about</CardDescription>
              </CardHeader>

              <CardContent>
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-500">Step {currentStep} of 3</span>
                    <span className="text-sm font-medium text-violet-700">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2 bg-slate-200"
                    indicatorClassName="bg-violet-600"
                  />
                </div>

                {/* Error and success messages */}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-2">
                        <User className="h-6 w-6 text-violet-700" />
                      </div>
                      <h2 className="text-lg font-semibold">Personal Details</h2>
                    </div>

                    {/* Account Type Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Type</label>
                      <RadioGroup
                        defaultValue={formData.role}
                        value={formData.role}
                        onValueChange={handleRoleChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="donor" id="donor" />
                          <Label htmlFor="donor" className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-violet-600" />
                            Donor (support campaigns)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="organizer" id="organizer" />
                          <Label htmlFor="organizer" className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-violet-600" />
                            Organizer (create campaigns)
                          </Label>
                        </div>
                      </RadioGroup>
                      {formData.role === "organizer" && (
                        <p className="text-xs text-amber-600">
                          Note: Organizer accounts require approval before they can create campaigns.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Organization fields (only for organizers) */}
                    {formData.role === "organizer" && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="orgName" className="text-sm font-medium">
                            Organization Name
                          </label>
                          <Input
                            id="orgName"
                            name="orgName"
                            type="text"
                            placeholder="Enter your organization name"
                            value={formData.orgName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="orgDescription" className="text-sm font-medium">
                            Organization Description
                          </label>
                          <Textarea
                            id="orgDescription"
                            name="orgDescription"
                            placeholder="Briefly describe your organization and its mission"
                            value={formData.orgDescription}
                            onChange={handleTextareaChange}
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />

                      {/* Password requirements */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div
                          className={`text-xs flex items-center ${passwordErrors.length ? "text-green-600" : "text-slate-500"}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${passwordErrors.length ? "bg-green-600" : "bg-slate-300"}`}
                          ></div>
                          At least 8 characters
                        </div>
                        <div
                          className={`text-xs flex items-center ${passwordErrors.uppercase ? "text-green-600" : "text-slate-500"}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${passwordErrors.uppercase ? "bg-green-600" : "bg-slate-300"}`}
                          ></div>
                          Uppercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${passwordErrors.lowercase ? "text-green-600" : "text-slate-500"}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${passwordErrors.lowercase ? "bg-green-600" : "bg-slate-300"}`}
                          ></div>
                          Lowercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${passwordErrors.number ? "text-green-600" : "text-slate-500"}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${passwordErrors.number ? "bg-green-600" : "bg-slate-300"}`}
                          ></div>
                          Number
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />

                      {formData.confirmPassword && (
                        <div
                          className={`text-xs flex items-center ${passwordErrors.match ? "text-green-600" : "text-red-500"}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${passwordErrors.match ? "bg-green-600" : "bg-red-500"}`}
                          ></div>
                          {passwordErrors.match ? "Passwords match" : "Passwords do not match"}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: MetaMask Integration */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-2">
                        <Wallet className="h-6 w-6 text-violet-700" />
                      </div>
                      <h2 className="text-lg font-semibold">Connect Your Wallet</h2>
                    </div>

                    <div className="p-6 border rounded-lg bg-slate-50 text-center">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <svg
                          viewBox="0 0 193 185"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full"
                        >
                          <path
                            d="M60.8 173.7L30.5 92.4L96.7 108.2L60.8 173.7Z"
                            fill="#E2761B"
                            stroke="#E2761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M131.9 173.7L167.7 108.2L101.6 92.5L131.9 173.7Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M167.7 108.2L131.9 173.7L142.8 136.4L167.7 108.2Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M30.5 108.2L55.3 136.4L66.2 173.7L30.5 108.2Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M96.7 108.2L101.6 92.5L30.5 108.2L55.3 136.4L96.7 108.2Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M167.7 108.2L142.8 136.4L101.6 92.5L167.7 108.2Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M96.7 108.2L55.3 136.4L66.2 173.7L96.7 108.2Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M101.6 92.5L96.7 108.2L131.9 173.7L142.8 136.4L101.6 92.5Z"
                            fill="#E4761B"
                            stroke="#E4761B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M96.7 11.5L101.6 92.5L142.8 136.4L96.7 11.5Z"
                            fill="#F6851B"
                            stroke="#F6851B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M96.7 11.5L55.3 136.4L96.7 108.2L96.7 11.5Z"
                            fill="#F6851B"
                            stroke="#F6851B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M96.7 11.5L101.6 92.5L55.3 136.4L96.7 11.5Z"
                            fill="#F6851B"
                            stroke="#F6851B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M101.6 92.5L142.8 136.4L96.7 108.2L101.6 92.5Z"
                            fill="#F6851B"
                            stroke="#F6851B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <h3 className="font-semibold text-lg mb-2">
                        {walletAddress ? "Wallet Connected" : "Connect MetaMask"}
                      </h3>

                      {walletAddress ? (
                        <div className="mb-4">
                          <div className="flex items-center justify-center mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-600 font-medium">Successfully connected</span>
                          </div>
                          <p className="text-sm bg-slate-100 p-2 rounded font-mono break-all">{walletAddress}</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 mb-4">
                          {isMetaMaskInstalled
                            ? "Connect your MetaMask wallet to verify your identity and complete registration"
                            : "MetaMask is not installed. Please install MetaMask to continue."}
                        </p>
                      )}

                      {!walletAddress && (
                        <Button
                          className="w-full bg-violet-700 hover:bg-violet-800"
                          onClick={connectMetaMask}
                          disabled={!isMetaMaskInstalled || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            "Connect MetaMask"
                          )}
                        </Button>
                      )}

                      {!isMetaMaskInstalled && (
                        <div className="mt-4">
                          <a
                            href="https://metamask.io/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-violet-700 hover:text-violet-800 underline"
                          >
                            Install MetaMask
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-center text-slate-500">
                      By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                )}

                {/* Step 3: Review Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-violet-700" />
                      </div>
                      <h2 className="text-lg font-semibold">Review Your Details</h2>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Account Type</h3>
                        <p className="font-medium flex items-center">
                          {formData.role === "donor" ? (
                            <>
                              <User className="h-4 w-4 mr-2 text-violet-600" />
                              Donor
                            </>
                          ) : (
                            <>
                              <Building2 className="h-4 w-4 mr-2 text-violet-600" />
                              Organizer
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Full Name</h3>
                        <p className="font-medium">{formData.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Email Address</h3>
                        <p className="font-medium">{formData.email}</p>
                      </div>

                      {formData.role === "organizer" && (
                        <div>
                          <h3 className="text-sm font-medium text-slate-500 mb-1">Organization</h3>
                          <p className="font-medium">{formData.orgName}</p>
                          {formData.orgDescription && (
                            <p className="text-sm text-slate-600 mt-1">{formData.orgDescription}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-1">Wallet Address</h3>
                        <p className="font-mono text-sm break-all">{formData.walletAddress}</p>
                      </div>
                    </div>

                    {formData.role === "organizer" && (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <p className="text-sm text-amber-800">
                          <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                          Your organizer account will require approval before you can create campaigns. We'll review
                          your details and notify you once approved.
                        </p>
                      </div>
                    )}

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-100">
                      <p className="text-sm text-violet-800">
                        By creating an account, you agree to our Terms of Service, Privacy Policy, and our default
                        Notification Settings.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div></div> // Empty div to maintain layout
                  )}

                  {currentStep < 3 ? (
                    <Button className="bg-violet-700 hover:bg-violet-800" onClick={handleNextStep} disabled={isLoading}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-violet-700 hover:bg-violet-800" onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {formData.role === "organizer" ? "Submitting Application..." : "Creating Account..."}
                        </>
                      ) : formData.role === "organizer" ? (
                        "Submit Application"
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  )}
                </div>

                <Separator />

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-violet-700 hover:text-violet-800 font-medium">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

