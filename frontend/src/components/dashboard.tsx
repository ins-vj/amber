"use client";

import React, { useState, useEffect } from "react";
import { FaTrophy, FaStar, FaMedal } from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/components/navbar";

interface EducationOptions {
  lvl2: string[];
  lvl3: string[];
}

interface EducationUpdateRequest {
  educationLevel: string;
  schoolingYear: string;
  schoolStream: string;
}

interface Profile {
  name: string;
  email: string;
  educationlvl1: string;
  educationlvl2: string;
  educationlvl3: string;
  profilePicture: string;
}

const Dashboard: React.FC = () => {
  // Initialize with loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<Profile>({
    name: "ins_vj1",
    email: "vikrantjakhar69@gmail.com",
    educationlvl1: "SCHOOL",
    educationlvl2: "TWELFTH",
    educationlvl3: "SCIENCE",
    profilePicture: "/placeholder.svg?height=100&width=100",
  });
  
  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const educationLvl1Options = ["SCHOOL", "UNDERGRADUATE", "POSTGRADUATE"];

  const [educationOptions, setEducationOptions] = useState<EducationOptions>({
    lvl2: ["ELEVENTH", "TWELFTH"],
    lvl3: ["SCIENCE", "COMMERCE", "ARTS"],
  });

  const courses = [
    {
      name: "Basic Web Development",
      progress: 75,
      image: "/api/placeholder/300/200",
    },
    {
      name: "Crash Course in Machine Learning",
      progress: 50,
      image: "/api/placeholder/300/200",
    },
    {
      name: "Intermediate in Data Science",
      progress: 25,
      image: "/api/placeholder/300/200",
    },
  ];

  // Function to get auth token from cookies
  const getAuthToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'authToken') { // Replace 'authToken' with your actual cookie name
        return value;
      }
    }
    return null;
  };

  const updateEducationOnServer = async () => {
    try {
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const requestBody: EducationUpdateRequest = {
        educationLevel: tempProfile.educationlvl1,
        schoolingYear: tempProfile.educationlvl2,
        schoolStream: tempProfile.educationlvl3
      };
      
      const response = await fetch('http://localhost:5001/api/v1/user/web/education', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add token to headers
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error(`Failed to update education. Status: ${response.status}`);
      }
      
      const result = await response.json();
  
      if (result.success) {
        setProfile(tempProfile);
        setIsEditingEducation(false);
        alert("Education updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update education");
      }
    } catch (error: any) {
      console.error("Error updating education:", error);
      setError(error.message);
      alert(error.message);
    }
  };
  
  const handleEducationButtonClick = async () => {
    if (isEditingEducation) {
      await updateEducationOnServer();
    } else {
      setIsEditingEducation(true);
    }
  };

  const updateEducationOptions = (level1Value: string) => {
    let newOptions: EducationOptions = {
      lvl2: [],
      lvl3: []
    };

    switch (level1Value) {
      case "SCHOOL":
        newOptions = {
          lvl2: ["ELEVENTH", "TWELFTH"],
          lvl3: ["SCIENCE", "COMMERCE", "ARTS"]
        };
        break;
      case "UNDERGRADUATE":
        newOptions = {
          lvl2: ["BTECH", "BSC"],
          lvl3: ["FIRST", "SECOND", "THIRD", "FOURTH"]
        };
        break;
      case "POSTGRADUATE":
        newOptions = {
          lvl2: ["MTECH", "MSC", "PHD"],
          lvl3: ["COMPUTER_SCIENCE", "MECHANICAL_ENGINEERING", "ELECTRICAL_ENGINEERING", "CIVIL_ENGINEERING", "CHEMISTRY", "PHYSICS"]
        };
        break;
      default:
        newOptions = {
          lvl2: ["ELEVENTH", "TWELFTH"],
          lvl3: ["SCIENCE", "COMMERCE", "ARTS"]
        };
    }

    setEducationOptions(newOptions);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setTempProfile((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleEducationChange = (level: string, value: string) => {
    setTempProfile((prev) => {
      const updated = { ...prev, [level]: value };
      
      if (level === "educationlvl1") {
        updateEducationOptions(value);
        updated.educationlvl2 = educationOptions.lvl2[0];
        updated.educationlvl3 = educationOptions.lvl3[0];
      }
      
      return updated;
    });
  };

  // Add error display
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        {/* Left compartment */}
        <div className="w-full lg:w-1/5 p-6 bg-white border-b lg:border-r border-gray-200">
          {/* Profile Picture */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Image
              src={tempProfile.profilePicture}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            {isEditingPicture && (
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute top-full left-0 w-full mt-2 text-sm"
                accept="image/*"
              />
            )}
          </div>

          {/* Edit Profile Picture Button */}
          <button
            onClick={() => setIsEditingPicture(!isEditingPicture)}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditingPicture ? "Cancel" : "Edit Picture"}
          </button>
        </div>

        {/* Right compartment */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
            <h4 className="text-lg text-gray-600 mb-1">{profile.email}</h4>

            {/* Education Level */}
            {isEditingEducation ? (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Education Level 1</label>
                <select
                  value={tempProfile.educationlvl1}
                  onChange={(e) => handleEducationChange("educationlvl1", e.target.value)}
                  className="border rounded p-2 w-full mb-4"
                >
                  {educationLvl1Options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block font-semibold mb-1">Education Level 2</label>
                <select
                  value={tempProfile.educationlvl2}
                  onChange={(e) => handleEducationChange("educationlvl2", e.target.value)}
                  className="border rounded p-2 w-full mb-4"
                >
                  {educationOptions.lvl2.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block font-semibold mb-1">Education Level 3</label>
                <select
                  value={tempProfile.educationlvl3}
                  onChange={(e) => handleEducationChange("educationlvl3", e.target.value)}
                  className="border rounded p-2 w-full mb-4"
                >
                  {educationOptions.lvl3.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <p className="text-lg text-gray-600 mb-2">Level 1: {profile.educationlvl1}</p>
                <p className="text-lg text-gray-600 mb-2">Level 2: {profile.educationlvl2}</p>
                <p className="text-lg text-gray-600 mb-2">Level 3: {profile.educationlvl3}</p>
              </>
            )}

            {/* Edit Education Button */}
            <button
              onClick={handleEducationButtonClick}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {isEditingEducation ? "Update Education" : "Edit Education"}
            </button>
          </div>

          {/* Courses Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <Image
                      src={course.image}
                      alt={`Course ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded w-full h-48 object-cover mb-4"
                    />
                    <h3 className="text-md font-bold mb-2">{course.name}</h3>
                    <p className="text-gray-500">Progress: {course.progress}%</p>
                  </div>
                  <div className="mt-4">
                    <a href={`/course/${encodeURIComponent(course.name)}`}>
                      <button className="w-full bg-slate-200 hover:bg-slate-300 py-2 px-4 rounded">
                        View Course
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;