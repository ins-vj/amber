'use client'

import { useState } from 'react'
import { Plus, Upload, X } from 'lucide-react'

interface Subtopic {
  id: string
  name: string
  videoFile: File | null
  videoDescription: string
  subtitleFile: File | null
  notesFile: File | null
}

interface Chapter {
  id: string
  name: string
  subtopics: Subtopic[]
}

interface CourseDetails {
  name: string
  description: string
  imageUrl: string
  category: string
  subCategory: string
  prerequisites: string
  price: string
}

export default function CourseUpload() {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    name: '',
    description: '',
    imageUrl: '',
    category: '',
    subCategory: '',
    prerequisites: '',
    price: ''
  })
  const [chapters, setChapters] = useState<Chapter[]>([])

  const updateCourseDetails = (field: keyof CourseDetails, value: string) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }))
  }

  const addChapter = () => {
    setChapters([...chapters, { id: Date.now().toString(), name: '', subtopics: [] }])
  }

  const addSubtopic = (chapterId: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: [...chapter.subtopics, { id: Date.now().toString(), name: '', videoFile: null, videoDescription: '', subtitleFile: null, notesFile: null }] }
        : chapter
    ))
  }

  const updateChapter = (id: string, name: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === id ? { ...chapter, name } : chapter
    ))
  }

  const updateSubtopic = (chapterId: string, subtopicId: string, updates: Partial<Subtopic>) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: chapter.subtopics.map(subtopic => 
            subtopic.id === subtopicId ? { ...subtopic, ...updates } : subtopic
          ) }
        : chapter
    ))
  }

  const removeChapter = (id: string) => {
    setChapters(chapters.filter(chapter => chapter.id !== id))
  }

  const removeSubtopic = (chapterId: string, subtopicId: string) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, subtopics: chapter.subtopics.filter(subtopic => subtopic.id !== subtopicId) }
        : chapter
    ))
  }

  return (
    <div className="container mx-auto p-4 space-y-6 bg-slate-500 text-black">
      <h1 className="text-3xl font-bold">Upload Course</h1>
      
      <div className="p-4 border rounded-lg bg-white">
        <h2 className="text-lg font-semibold">Course Details</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="courseName">Course Name</label>
            <input
              id="courseName"
              placeholder="Course Name"
              className="w-full p-2 border rounded"
              value={courseDetails.name}
              onChange={(e) => updateCourseDetails('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              placeholder="Course Description"
              className="w-full p-2 border rounded"
              value={courseDetails.description}
              onChange={(e) => updateCourseDetails('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              placeholder="Image URL"
              className="w-full p-2 border rounded"
              value={courseDetails.imageUrl}
              onChange={(e) => updateCourseDetails('imageUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="w-full p-2 border rounded"
              onChange={(e) => updateCourseDetails('category', e.target.value)}
              value={courseDetails.category}
            >
              <option value="">Select category</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="subCategory">Sub-category</label>
            <input
              id="subCategory"
              placeholder="Sub-category"
              className="w-full p-2 border rounded"
              value={courseDetails.subCategory}
              onChange={(e) => updateCourseDetails('subCategory', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="prerequisites">Prerequisites</label>
            <textarea
              id="prerequisites"
              placeholder="Prerequisites"
              className="w-full p-2 border rounded"
              value={courseDetails.prerequisites}
              onChange={(e) => updateCourseDetails('prerequisites', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              className="w-full p-2 border rounded"
              value={courseDetails.price}
              onChange={(e) => updateCourseDetails('price', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {chapters.map(chapter => (
          <div key={chapter.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-center">
              <input
                placeholder="Chapter Name"
                className="p-2 border rounded w-full mr-2"
                value={chapter.name}
                onChange={(e) => updateChapter(chapter.id, e.target.value)}
              />
              <button className="p-2 bg-red-500 text-white rounded" onClick={() => removeChapter(chapter.id)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 mt-4">
              {chapter.subtopics.map(subtopic => (
                <div key={subtopic.id} className="p-4 border rounded bg-gray-100">
                  <div className="flex justify-between items-center">
                    <input
                      placeholder="Subtopic Name"
                      className="p-2 border rounded w-full mr-2"
                      value={subtopic.name}
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { name: e.target.value })}
                    />
                    <button className="p-2 bg-red-500 text-white rounded" onClick={() => removeSubtopic(chapter.id, subtopic.id)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2 mt-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoFile: e.target.files?.[0] || null })}
                    />
                    <textarea
                      placeholder="Video Description"
                      className="w-full p-2 border rounded"
                      value={subtopic.videoDescription}
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoDescription: e.target.value })}
                    />
                    <input
                      type="file"
                      accept=".vtt,.srt"
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { subtitleFile: e.target.files?.[0] || null })}
                    />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { notesFile: e.target.files?.[0] || null })}
                    />
                  </div>
                </div>
              ))}
              <button className="mt-2 p-2 bg-blue-500 text-white rounded flex items-center" onClick={() => addSubtopic(chapter.id)}>
                <Plus className="mr-2 h-4 w-4" /> Add Subtopic
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="p-2 bg-blue-500 text-white rounded flex items-center" onClick={addChapter}>
        <Plus className="mr-2 h-4 w-4" /> Add Chapter
      </button>
    </div>
  )
}
