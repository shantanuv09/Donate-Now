import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              DonateNow
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            
            <Button className="bg-violet-700 hover:bg-violet-800 text-white">
            <Link href="/login">Login</Link>
            </Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-indigo-800 to-violet-900 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
          <div className="container relative mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">Make a Difference Today</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-violet-100">
              Join thousands of donors supporting causes that matter. Every contribution counts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              
              <Button size="lg" variant="outline" className="border-white !text-white hover:bg-white/10">
              <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Featured Campaigns</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Support these worthy causes and help make a real impact in communities around the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Campaign 1 */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-violet-900 z-10">
                    50% Funded
                  </div>
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Clean water project"
                    width={500}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-slate-900">Clean Water Initiative</h3>
                  <div className="mb-3">
                    <Progress value={50} className="h-2 bg-slate-200" indicatorClassName="bg-violet-600" />
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                      <span className="font-medium text-violet-700">$500 raised</span>
                      <span>of $1,000 goal</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Providing clean drinking water to communities in need around the world.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-800">
                        +8
                      </div>
                    </div>
                    <Button size="sm" className="bg-violet-700 hover:bg-violet-800">
                      Donate
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Campaign 2 */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-violet-900 z-10">
                    40% Funded
                  </div>
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Education program"
                    width={500}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-slate-900">Education for All</h3>
                  <div className="mb-3">
                    <Progress value={40} className="h-2 bg-slate-200" indicatorClassName="bg-violet-600" />
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                      <span className="font-medium text-violet-700">$200 raised</span>
                      <span>of $500 goal</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Supporting education initiatives for underprivileged children.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-800">
                        +5
                      </div>
                    </div>
                    <Button size="sm" className="bg-violet-700 hover:bg-violet-800">
                      Donate
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Campaign 3 */}
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video bg-slate-200 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold rounded-full text-violet-900 z-10">
                    50% Funded
                  </div>
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="Wildlife conservation"
                    width={500}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-slate-900">Wildlife Conservation</h3>
                  <div className="mb-3">
                    <Progress value={50} className="h-2 bg-slate-200" indicatorClassName="bg-violet-600" />
                    <div className="flex justify-between mt-2 text-sm text-slate-600">
                      <span className="font-medium text-violet-700">$100 raised</span>
                      <span>of $200 goal</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Protecting endangered species and their natural habitats.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-800">
                        +3
                      </div>
                    </div>
                    <Button size="sm" className="bg-violet-700 hover:bg-violet-800">
                      Donate
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" className="border-violet-600 text-violet-700 hover:bg-violet-50">
              <Link href="/campaigns">View All Campaigns</Link>
                
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our platform makes it easy to create campaigns and receive donations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Create Campaign</h3>
                <p className="text-slate-600">
                  Set up your fundraising campaign in minutes with our easy-to-use platform
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Receive Donations</h3>
                <p className="text-slate-600">
                  Share your campaign and collect donations from supporters around the world
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-slate-900">Fund Your Cause</h3>
                <p className="text-slate-600">Withdraw funds and use them to make a real difference for your cause</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Button className="bg-violet-700 hover:bg-violet-800">Start Your Campaign</Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">What Our Users Say</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Hear from people who have successfully raised funds on our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Testimonial 1 */}
              <Card className="p-6 border-0 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold">
                      JD
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-slate-900 mr-2">John Doe</h4>
                      <div className="text-amber-400 flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 mb-3">
                      "This platform made fundraising so easy! I was able to raise money for my community project in
                      just a few weeks. The interface is intuitive and the support team was incredibly helpful."
                    </p>
                    <p className="text-sm text-slate-500">Campaign: Community Garden Project</p>
                  </div>
                </div>
              </Card>

              {/* Testimonial 2 */}
              <Card className="p-6 border-0 shadow-md hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-bold">
                      JS
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-slate-900 mr-2">Jane Smith</h4>
                      <div className="text-amber-400 flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 mb-3">
                      "I was amazed by how quickly donations started coming in. The platform's features for sharing on
                      social media really helped spread the word about my cause. I exceeded my fundraising goal!"
                    </p>
                    <p className="text-sm text-slate-500">Campaign: Medical Treatment Fund</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-br from-violet-900 via-indigo-800 to-violet-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">$2.5M+</div>
                <p>Funds Raised</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1,200+</div>
                <p>Successful Campaigns</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15,000+</div>
                <p>Donors</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <p>Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Feedback */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-3 text-slate-900">Our Users Love Us</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                See what our community has to say about their experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* Feedback 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6">
                  <Image
                    src="/smileyFace.svg?height=80&width=80"
                    alt="Smiley face"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">Excellent Service</h3>
                <p className="text-slate-600 mb-3">Our platform is rated highly for ease of use and customer support</p>
                <div className="text-amber-400 flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-violet-700 font-semibold">5.0 out of 5 stars</p>
                <p className="text-sm text-slate-500 mt-1">Based on 500+ reviews</p>
              </div>

              {/* Feedback 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6">
                  <Image
                    src="/okHand.svg?height=80&width=80"
                    alt="Thumbs up"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">Highly Recommended</h3>
                <p className="text-slate-600 mb-3">Our users consistently recommend our platform to others</p>
                <div className="flex justify-center items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                  </div>
                </div>
                <p className="text-violet-700 font-semibold">95% Recommend</p>
                <p className="text-sm text-slate-500 mt-1">Based on 1,000+ users</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-violet-700 p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                  <p className="mb-6">
                    Have questions about our platform? Want to learn more about how you can make a difference? Reach out
                    to us!
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-3 mt-1"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <div>
                        <h4 className="font-semibold">Phone</h4>
                        <p className="text-violet-200">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-3 mt-1"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      <div>
                        <h4 className="font-semibold">Email</h4>
                        <p className="text-violet-200">contact@donatenow.org</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-3 mt-1"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <div>
                        <h4 className="font-semibold">Address</h4>
                        <p className="text-violet-200">123 Charity Lane, Giving City, GC 12345</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-slate-900">Send Us a Message</h3>

                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-slate-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1 text-slate-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={4}
                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <Button className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3">Submit Message</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  D
                </div>
                <span className="text-xl font-bold">DonateNow</span>
              </div>
              <p className="text-slate-400 mb-4">
                Making the world a better place through the power of collective giving.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Campaigns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Transparency Report
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Blockchain Verification
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Newsletter</h4>
              <p className="text-slate-400 mb-4">
                Subscribe to our newsletter for the latest updates on campaigns and impact stories.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="p-2 bg-slate-800 border border-slate-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-violet-500 w-full"
                />
                <Button className="bg-violet-700 hover:bg-violet-800 rounded-l-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" x2="11" y1="2" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} DonateNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

