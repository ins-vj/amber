"use client"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-600">LearnHub</Link>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="text-gray-400" size={20} />
              <Input type="search" placeholder="Search for courses" className="bg-transparent border-none focus:outline-none" />
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-purple-600">Categories</Link>
              <Link href="#" className="text-gray-600 hover:text-purple-600">Teach</Link>
            </nav>
            <div className="flex items-center space-x-3">
              <span className="text-gray-700">Welcome, User</span>
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="User profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Expand Your Knowledge, Elevate Your Career</h1>
              <p className="text-xl mb-8">Learn from industry experts and transform your skills with our cutting-edge courses.</p>
              <div className="flex justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">Explore Courses</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          id: 1,
          title: "Complete Web Development Bootcamp",
          author: "John Doe",
          rating: 4.7,
          reviews: 1234,
          price: 499,
          originalPrice: 1999,
          image: "https://img.freepik.com/free-psd/e-learning-template-design_23-2151081790.jpg?t=st=1731735981~exp=1731739581~hmac=378fd6aec9d54470bcc4675585ae5b61fbb4f202cce63c08b246e99cd5b3e3a8&w=1480",
          badge: "Bestseller",
        },
        {
          id: 2,
          title: "Master Python for Data Science",
          author: "Jane Smith",
          rating: 4.8,
          reviews: 987,
          price: 699,
          originalPrice: 2499,
          image: "https://img.freepik.com/free-psd/e-learning-banner-template-design_23-2149585649.jpg?t=st=1731736068~exp=1731739668~hmac=7f6991fab238376db1afc141fbd59eb2b89121f0bf32d281162c3dbb3a935f06&w=1480",
          badge: "Trending",
        },
        {
          id: 3,
          title: "UI/UX Design Fundamentals",
          author: "Alex Johnson",
          rating: 4.6,
          reviews: 456,
          price: 299,
          originalPrice: 1499,
          image: "https://img.freepik.com/free-psd/back-school-online-banner-template_23-2148876052.jpg?semt=ais_hybrid",
          badge: "New",
        },
      ].map((course) => (
        <Card key={course.id}>
          <CardContent className="p-0">
            <Image
              src={course.image}
              alt={`${course.title} thumbnail`}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <Badge className="mb-2">{course.badge}</Badge>
              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.author}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 font-bold mr-1">{course.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 fill-current ${
                        star <= Math.round(course.rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">({course.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">₹{course.price}</span>
                <span className="text-sm line-through text-gray-500">₹{course.originalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


        {/* Categories */}
        <section className="bg-gray-100 py-16 text-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Top Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Web Development', 'Data Science', 'Business', 'Design', 'Marketing', 'IT and Software', 'Personal Development', 'Photography'].map((category) => (
                <Link key={category} href="#" className="h-auto py-8 flex flex-col items-center justify-center bg-white hover:bg-gray-50 border rounded-lg">
                  <span className="text-lg font-semibold">{category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Become an Instructor */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gray-900 text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">Become an instructor</h2>
                <p className="text-lg mb-6">Join our community of expert instructors and share your knowledge with learners worldwide.</p>
                <Button size="lg" variant="secondary">Start Teaching Today</Button>
              </div>
              <div className="md:w-1/3">
                <Image src="/placeholder.svg?height=300&width=300" alt="Become an instructor" width={300} height={300} className="rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LearnHub</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">About us</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Learners</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Partners</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Developers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Safety Center</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Cookie Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 LearnHub, Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}