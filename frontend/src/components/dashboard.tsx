"use client"

import React, { useEffect, useState } from 'react'
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa'
import Image from 'next/image'
// import { Progress } from "@/components/ui/progress"

const Dashboard: React.FC = () => {
  const [calendarData, setCalendarData] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const generatedData = generateCalendarData()
    setCalendarData(generatedData)
  }, [])

  const quizzes = ["Quiz 1", "Quiz 2", "Test 1", "Test 2"]
  const badges = [<FaTrophy key="trophy" />, <FaStar key="star" />, <FaMedal key="medal" />]
  const courses = [
    { name: "Course 1", progress: 75, image: "/placeholder.svg?height=100&width=100" },
    { name: "Course 2", progress: 50, image: "/placeholder.svg?height=100&width=100" },
    { name: "Course 3", progress: 25, image: "/placeholder.svg?height=100&width=100" },
  ]

  const generateCalendarData = () => {
    const data: { [key: string]: boolean } = {}
    const currentYear = new Date().getFullYear()

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day)
        const dateKey = date.toISOString().split('T')[0]
        data[dateKey] = Math.random() > 0.5
      }
    }
    return data
  }

  const renderCalendar = () => {
    const currentYear = new Date().getFullYear()
    const monthNames = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(12,minmax(100px,1fr))] gap-2">
          <div className="col-span-1"></div>
          {monthNames.map((month) => (
            <div key={month} className="text-xs font-medium text-gray-500 text-center">
              {month}
            </div>
          ))}
          
          {weekDays.map((day, dayIndex) => (
            <React.Fragment key={day}>
              <div className="text-xs font-medium text-gray-500 pr-2 text-right">{day}</div>
              {monthNames.map((month, monthIndex) => {
                const date = new Date(currentYear, monthIndex, 1)
                const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
                const firstDayOfWeek = date.getDay()
                const offset = (dayIndex - firstDayOfWeek + 7) % 7

                return (
                  <div key={`${month}-${day}`} className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 5 }).map((_, weekIndex) => {
                      const dayOfMonth = weekIndex * 7 + offset + 1
                      if (dayOfMonth > daysInMonth) return <div key={weekIndex} className="w-2 h-2" />

                      const currentDate = new Date(currentYear, monthIndex, dayOfMonth)
                      const dateKey = currentDate.toISOString().split('T')[0]
                      const isContentWatched = calendarData[dateKey]

                      return (
                        <div
                          key={weekIndex}
                          className={`w-2 h-2 rounded-sm ${
                            isContentWatched ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          title={`${month} ${dayOfMonth}, ${currentYear}`}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left compartment */}
      <div className="w-full lg:w-1/5 p-6 bg-white border-b lg:border-r border-gray-200">
        {/* Profile Picture */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>

        {/* List of upcoming quizzes and tests */}
        <h3 className="font-semibold text-lg mb-4">Upcoming Quizzes & Tests</h3>
        <ul className="space-y-2">
          {quizzes.map((quiz, index) => (
            <li key={index} className="text-sm text-gray-600">{quiz}</li>
          ))}
        </ul>
      </div>

      {/* Right compartment */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-1">User Name</h2>
        <h4 className="text-lg text-gray-600 mb-4">Standard: 10th Grade</h4>

        {/* Badges */}
        <div className="flex gap-4 mb-6">
          {badges.map((badge, index) => (
            <div key={index} className="text-3xl text-yellow-500">
              {badge}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <h3 className="font-semibold text-lg mb-4">Activity Calendar</h3>
        {renderCalendar()}

        {/* List of courses */}
        <h3 className="font-semibold text-lg mt-8 mb-4">Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <Image
                src={course.image}
                alt={course.name}
                width={100}
                height={100}
                className="rounded-lg mb-4"
              />
              <h4 className="font-medium mb-2">{course.name}</h4>
              {/* <Progress value={course.progress} className="h-2" /> */}
              <p className="text-sm text-gray-600 mt-2">{course.progress}% Complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard