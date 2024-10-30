"use client"
import Image from "next/image"
import { useState } from "react"
import { Star, Clock, Film, FileText, Award, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const courseSections = [
  {
    title: "Front-End Web Development",
    lectures: 9,
    duration: "37min",
    content: "Introduction to HTML, CSS basics, and JavaScript fundamentals."
  },
  {
    title: "Introduction to HTML",
    lectures: 12,
    duration: "1h 15min",
    content: "HTML structure, tags, attributes, and creating your first web page."
  },
  {
    title: "Intermediate HTML",
    lectures: 10,
    duration: "55min",
    content: "Forms, tables, semantic HTML, and best practices."
  },
  {
    title: "Introduction to CSS",
    lectures: 15,
    duration: "1h 30min",
    content: "CSS selectors, properties, box model, and layouts."
  },
  {
    title: "Intermediate CSS",
    lectures: 14,
    duration: "1h 20min",
    content: "Flexbox, Grid, responsive design, and CSS animations."
  },
  {
    title: "JavaScript Basics",
    lectures: 18,
    duration: "2h 10min",
    content: "Variables, data types, functions, and control structures."
  },
  {
    title: "DOM Manipulation",
    lectures: 12,
    duration: "1h 45min",
    content: "Selecting elements, event handling, and dynamic content creation."
  },
  {
    title: "Introduction to React",
    lectures: 20,
    duration: "2h 30min",
    content: "React components, JSX, props, and state management."
  }
]

export default function CourseInfo() {
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [showAllSections, setShowAllSections] = useState(false)

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const toggleShowAllSections = () => {
    setShowAllSections(prev => !prev)
    setExpandedSections(showAllSections ? [] : courseSections.map((_, index) => index))
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Course Banner */}
      <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg?height=256&width=1024"
          alt="Course Banner"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">The Complete 2024 Web Development Bootcamp</h1>
            <p className="text-xl text-gray-200">Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps</p>
          </div>
        </div>
      </div>

      {/* Course Info and Pricing */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* What you'll learn */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {["Build 16 web development projects for your portfolio", "Learn the latest technologies, including Javascript, React, Node and even Web3 development", "Build fully-fledged websites and web apps for your startup or business", "Master frontend development with React"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course content */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Course content</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">8 sections • {courseSections.reduce((acc, section) => acc + section.lectures, 0)} lectures • {courseSections.reduce((acc, section) => acc + parseInt(section.duration), 0)}min total length</p>
                <div className="space-y-1">
                  {courseSections.slice(0, showAllSections ? courseSections.length : 5).map((section, index) => (
                    <div key={index} className="border-b">
                      <button
                        onClick={() => toggleSection(index)}
                        className="flex items-center justify-between w-full py-2 text-left"
                      >
                        <span>{section.title}</span>
                        {expandedSections.includes(index) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections.includes(index) && (
                        <div className="pl-4 pb-2 text-sm text-gray-600">
                          <p>{section.lectures} lectures • {section.duration}</p>
                          <p>{section.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={toggleShowAllSections}
                >
                  {showAllSections ? "Show fewer sections" : "Show all sections"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>No programming experience needed - I'll teach you everything you need to know</li>
                <li>A computer with access to the internet</li>
                <li>No paid software required</li>
                <li>I'll walk you through, step-by-step how to get all the software installed and set up</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Card */}
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-6">
              <div className="text-4xl font-bold">₹3,099</div>
              <Button className="w-full text-lg">Add to cart</Button>
              <p className="text-center text-sm text-gray-600">30-Day Money-Back Guarantee</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>61 hours on-demand video</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  <span>65 articles</span>
                </div>
                <div className="flex items-center">
                  <Film className="w-5 h-5 mr-2" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructor */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Instructor</h2>
          <div className="flex items-start space-x-4">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Instructor"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">Dr. Angela Yu</h3>
              <p className="text-gray-600">Developer and Lead Instructor</p>
              <div className="flex items-center mt-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">4.7 Instructor Rating</span>
              </div>
              <div className="flex items-center mt-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span className="ml-1 text-sm text-gray-600">2,918,393 Students</span>
              </div>
              <div className="flex items-center mt-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                <span className="ml-1 text-sm text-gray-600">7 Courses</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}