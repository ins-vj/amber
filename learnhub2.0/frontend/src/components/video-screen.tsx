'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayCircle, PauseCircle, FastForward, Rewind, MessageCircle, Edit3, Flag, ThumbsUp, ThumbsDown, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface Video {
  id: string
  title: string
  duration: string
}

interface Section {
  id: string
  title: string
  videos: Video[]
}

interface Note {
  id: string
  content: string
  timestamp: number
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: number
}

interface Doubt {
  id: string
  startTime: number
  endTime: number
  content: string
}

export default function VideoScreen() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeTab, setActiveTab] = useState('comments')
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', author: 'John Doe', content: 'Great video!', timestamp: 1621234567890 },
    { id: '2', author: 'Jane Smith', content: 'Very informative, thanks!', timestamp: 1621234667890 },
  ])
  const [notes, setNotes] = useState<Note[]>([])
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const [noteInput, setNoteInput] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [currentSectionId, setCurrentSectionId] = useState('section1')

  const courseSections: Section[] = [
    {
      id: 'section1',
      title: 'Introduction to React',
      videos: [
        { id: 'video1', title: 'What is React?', duration: '5:30' },
        { id: 'video2', title: 'Setting up your development environment', duration: '10:15' },
        { id: 'video3', title: 'Creating your first React component', duration: '8:45' },
      ]
    },
    {
      id: 'section2',
      title: 'React Hooks',
      videos: [
        { id: 'video4', title: 'Introduction to useState', duration: '7:20' },
        { id: 'video5', title: 'useEffect and side effects', duration: '12:10' },
        { id: 'video6', title: 'Custom hooks', duration: '9:55' },
      ]
    },
    {
      id: 'section3',
      title: 'State Management',
      videos: [
        { id: 'video7', title: 'Props vs State', duration: '6:40' },
        { id: 'video8', title: 'Introduction to Redux', duration: '15:30' },
        { id: 'video9', title: 'Context API', duration: '11:25' },
      ]
    },
  ]

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const addNote = (withTimestamp: boolean = false) => {
    if (noteInput.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteInput,
        timestamp: withTimestamp ? currentTime : -1,
      }
      setNotes([...notes, newNote])
      setNoteInput('')
    }
  }

  const addComment = () => {
    if (commentInput.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Current User', // Replace with actual user data
        content: commentInput,
        timestamp: Date.now(),
      }
      setComments([...comments, newComment])
      setCommentInput('')
    }
  }

  const addDoubt = () => {
    const newDoubt: Doubt = {
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: currentTime + 10, // Default 10 seconds, adjust as needed
      content: 'New doubt', // You might want to open a modal for doubt details
    }
    setDoubts([...doubts, newDoubt])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full rounded-lg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src="/placeholder.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>
                  <Rewind className="h-4 w-4 text-white" />
                </Button>
                <Button size="icon" variant="ghost" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <PauseCircle className="h-6 w-6 text-white" />
                  ) : (
                    <PlayCircle className="h-6 w-6 text-white" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                  <FastForward className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button size="sm" variant="secondary" onClick={addDoubt}>
                <Flag className="h-4 w-4 mr-2" />
                Doubt
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Current Video Title</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dislike
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="notes">Personal Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <Button onClick={addComment}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-2 rounded-md">
                    <p className="font-semibold">{comment.author}</p>
                    <p>{comment.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={() => addNote(false)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button onClick={() => addNote(true)}>
                    <Clock className="h-4 w-4 mr-2" />
                    Add with Timestamp
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="bg-muted p-2 rounded-md">
                    {note.timestamp !== -1 && (
                      <p className="text-sm text-muted-foreground">{formatTime(note.timestamp)}</p>
                    )}
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Sections</h2>
          {courseSections.map((section) => (
            <div key={section.id} className="border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                className={`w-full justify-between p-4 ${section.id === currentSectionId ? 'bg-blue-100 text-blue-700' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {expandedSections.includes(section.id) && (
                <div className="p-4 space-y-2">
                  {section.videos.map((video) => (
                    <div key={video.id} className="flex justify-between items-center">
                      <span className="text-sm">{video.title}</span>
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}