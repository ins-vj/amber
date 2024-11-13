"use client"

import React, { useState } from 'react'
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa'
import Image from 'next/image'

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "User Name",
    email: "user@example.com",
    education: "10th Grade",
    profilePicture: "/placeholder.svg?height=100&width=100"
  })
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [isEditingPicture, setIsEditingPicture] = useState(false)

  const quizzes = [
    { title: "Quiz 1", description: "An introductory quiz covering basic concepts." },
    { title: "Quiz 2", description: "A follow-up quiz to reinforce learned material." },
    { title: "Test 1", description: "Mid-term assessment to evaluate progress." },
    { title: "Test 2", description: "Final test to assess overall understanding." }
  ]

  const badges = [<FaTrophy key="trophy" />, <FaStar key="star" />, <FaMedal key="medal" />]
  const courses = [
    { name: "Course 1", progress: 75, image: "/placeholder.svg?height=100&width=100" },
    { name: "Course 2", progress: 50, image: "/placeholder.svg?height=100&width=100" },
    { name: "Course 3", progress: 25, image: "/placeholder.svg?height=100&width=100" },
  ]

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0])
      setProfile((prevProfile) => ({
        ...prevProfile,
        profilePicture: file,
      }))
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left compartment */}
      <div className="w-full lg:w-1/5 p-6 bg-white border-b lg:border-r border-gray-200">
        {/* Profile Picture */}
        <div className="w-24 h-24 mx-auto mb-6">
          <Image
            src={profile.profilePicture}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full"
          />
          {isEditingPicture && (
            <input
              type="file"
              onChange={handleImageChange}
              className="mb-10 mb-10 text-sm"  // Increased margin for spacing
              accept="image/*"
            />
          )}
        </div>

        {/* Edit Profile Picture Button */}
        <button
          onClick={() => setIsEditingPicture(!isEditingPicture)}
          className="w-full mt-8 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditingPicture ? "Update Picture" : "Edit Picture"}
        </button>
        
        {/* Edit Profile Information Button */}
        <button
          onClick={() => setIsEditingInfo(!isEditingInfo)}
          className="w-full mt-8 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditingInfo ? "Save Info" : "Edit Info"}
        </button>
      </div>

      {/* Right compartment */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4">
          {isEditingInfo ? (
            <>
              <label className="block font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="User Name"
                className="border rounded p-2 w-full mb-2"
              />
              
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Email"
                className="border rounded p-2 w-full mb-2"
              />
              
              <label className="block font-semibold mb-1">Education Level</label>
              <input
                type="text"
                name="education"
                value={profile.education}
                onChange={handleProfileChange}
                placeholder="Education Level"
                className="border rounded p-2 w-full"
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
              <h4 className="text-lg text-gray-600 mb-1">{profile.email}</h4>
              <p className="text-lg text-gray-600 mb-4">{profile.education}</p>
            </>
          )}
        </div>

        {/* Badges */}
        <div className="flex gap-4 mb-6">
          {badges.map((badge, index) => (
            <div key={index} className="text-3xl text-yellow-500">
              {badge}
            </div>
          ))}
        </div>

        {/* Courses */}
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
              <p className="text-sm text-gray-600 mt-2">{course.progress}% Complete</p>
            </div>
          ))}
        </div>

        {/* Upcoming Quizzes & Tests */}
        <h3 className="font-semibold text-lg mt-8 mb-4">Upcoming Quizzes & Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <h4 className="font-medium text-lg mb-2">{quiz.title}</h4>
              <p className="text-sm text-gray-600">{quiz.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
