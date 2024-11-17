"use client";

import React, { useState, useEffect } from "react";
import { FaTrophy, FaStar, FaMedal } from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/components/navbar";

const Dashboard: React.FC = () => {
  const [profile, setProfile] = useState({
    name: "User Name",
    email: "user@example.com",
    educationlvl1: "School",
    educationlvl2: "12th",
    educationlvl3: "Science",
    profilePicture: "/placeholder.svg?height=100&width=100",
  });
  const [tempProfile, setTempProfile] = useState(profile);
  const [isEditingPicture, setIsEditingPicture] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  const [educationOptions, setEducationOptions] = useState({
    lvl2: ["12th"],
    lvl3: ["Science"],
  });

  const courses = [
    {
      name: "Basic Web Development",
      progress: 75,
      image:
        "https://img.freepik.com/free-psd/e-learning-template-design_23-2151081790.jpg",
    },
    {
      name: "Crash Course in Machine Learning",
      progress: 50,
      image:
        "https://img.freepik.com/free-vector/abstract-business-youtube-thumbnail-template_23-2148720358.jpg",
    },
    {
      name: "Intermediate in Data Science",
      progress: 25,
      image:
        "https://img.freepik.com/free-vector/youtube-background-thumbnail-design-template-with-text-full-editable_1361-2730.jpg",
    },
  ];

  const badges = [<FaTrophy key="trophy" />, <FaStar key="star" />, <FaMedal key="medal" />];

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/userinfo");
      const data = await response.json();
      if (data && data.name && data.email && data.educationlvl1 && data.profilePicture) {
        setProfile(data);
        setTempProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfileOnServer = async () => {
    try {
      const response = await fetch("http://localhost:3000/updated-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempProfile),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        await fetchProfile(); // Fetch updated data after API call
      } else {
        console.error("Failed to update profile on the server.");
        alert("Failed to update profile on the server.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setTempProfile((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const handleEducationChange = (level: string, value: string) => {
    const updatedProfile = { ...tempProfile, [level]: value };

    // Update dependent education options
    if (level === "educationlvl1") {
      if (value === "School") {
        setEducationOptions({
          lvl2: ["11th", "12th"],
          lvl3: ["Science", "Commerce", "Arts"],
        });
        updatedProfile.educationlvl2 = "11th";
        updatedProfile.educationlvl3 = "Science";
      } else if (value === "Undergraduate") {
        setEducationOptions({
          lvl2: ["B.Tech", "B.Sc"],
          lvl3: ["First Year", "Second Year", "Third Year", "Fourth Year"],
        });
        updatedProfile.educationlvl2 = "B.Tech";
        updatedProfile.educationlvl3 = "First Year";
      } else if (value === "Postgraduate") {
        setEducationOptions({
          lvl2: ["M.Tech", "M.Sc", "PhD"],
          lvl3: ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemistry", "Physics"],
        });
        updatedProfile.educationlvl2 = "M.Tech";
        updatedProfile.educationlvl3 = "Computer Science";
      }
    }

    setTempProfile(updatedProfile);
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
        {/* Left compartment */}
        <div className="w-full lg:w-1/5 p-6 bg-white border-b lg:border-r border-gray-200">
          {/* Profile Picture */}
          <div className="w-24 h-24 mx-auto mb-6">
            <Image
              src={tempProfile.profilePicture}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full"
            />
            {isEditingPicture && (
              <input
                type="file"
                onChange={handleImageChange}
                className="mb-10 text-sm"
                accept="image/*"
              />
            )}
          </div>

          {/* Edit Profile Picture Button */}
          <button
            onClick={async () => {
              if (isEditingPicture) {
                await updateProfileOnServer();
              }
              setIsEditingPicture(!isEditingPicture);
            }}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditingPicture ? "Update Picture" : "Edit Picture"}
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
                  <option value="School">School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>

                <label className="block font-semibold mb-1">Education Level 2</label>
                <select
                  value={tempProfile.educationlvl2}
                  onChange={(e) => handleEducationChange("educationlvl2", e.target.value)}
                  className="border rounded p-2 w-full mb-4"
                >
                  {educationOptions.lvl2.map((option, idx) => (
                    <option key={idx} value={option}>
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
                  {educationOptions.lvl3.map((option, idx) => (
                    <option key={idx} value={option}>
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
              onClick={async () => {
                if (isEditingEducation) {
                  await updateProfileOnServer();
                }
                setIsEditingEducation(!isEditingEducation);
              }}
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
        className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
      >
        <div className="flex flex-col justify-between h-full">
          {/* Image */}
          <Image
            src={course.image}
            alt={`Course ${index + 1}`}
            width={300}  // Adjust width for fitting within the card
            height={200} // Adjust height to maintain aspect ratio
            className="rounded w-full h-auto object-cover"
          />

          {/* Course Information (Name & Progress) */}
          <div className="mt-2">
            <h3 className="text-md font-bold">{course.name}</h3>
            <p className="text-gray-500">Progress:{course.progress}%</p>
          </div>
        </div>

        {/* View Course Button (aligned to the right) */}
        <div className="mt-4 flex justify-end">
          <a href={`/course/${course.name}`}>
            <button className="bg-slate-200 hover:bg-slate-300 py-1 px-2 rounded">
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
