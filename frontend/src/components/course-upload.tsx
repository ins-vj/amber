'use client'

import { useState } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function CourseUpload() {
  const [courseName, setCourseName] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([])

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
    <div className="container mx-auto p-4 space-y-6 bg-slate-500">
      <h1 className="text-3xl font-bold">Upload Course</h1>
      
      <Input
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="max-w-md"
      />

      <div className="space-y-4">
        {chapters.map(chapter => (
          <Card key={chapter.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Input
                  placeholder="Chapter Name"
                  value={chapter.name}
                  onChange={(e) => updateChapter(chapter.id, e.target.value)}
                  className="max-w-md"
                />
                <Button variant="destructive" size="icon" onClick={() => removeChapter(chapter.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapter.subtopics.map(subtopic => (
                <Card key={subtopic.id}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <Input
                        placeholder="Subtopic Name"
                        value={subtopic.name}
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { name: e.target.value })}
                        className="max-w-md"
                      />
                      <Button variant="destructive" size="icon" onClick={() => removeSubtopic(chapter.id, subtopic.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoFile: e.target.files?.[0] || null })}
                      />
                      <Textarea
                        placeholder="Video Description"
                        value={subtopic.videoDescription}
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { videoDescription: e.target.value })}
                      />
                      <Input
                        type="file"
                        accept=".vtt,.srt"
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { subtitleFile: e.target.files?.[0] || null })}
                      />
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => updateSubtopic(chapter.id, subtopic.id, { notesFile: e.target.files?.[0] || null })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addSubtopic(chapter.id)}>
                <Plus className="mr-2 h-4 w-4" /> Add Subtopic
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addChapter}>
        <Plus className="mr-2 h-4 w-4" /> Add Chapter
      </Button>

      <Button className="w-full">
        <Upload className="mr-2 h-4 w-4" /> Upload Course
      </Button>
    </div>
  )
}