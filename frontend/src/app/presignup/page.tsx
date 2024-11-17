'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, School } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()

  const handleRedirect = (profession: string) => {
    // Redirect to /signup with a query parameter for the profession
    router.push(`/signup?profession=${profession}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">CHOOSE YOUR PROFESSION</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            className="h-16 text-lg"
            variant="outline"
            onClick={() => handleRedirect('student')}
          >
            <GraduationCap className="mr-2 h-6 w-6" />
            Student
          </Button>
          <Button
            className="h-16 text-lg"
            variant="outline"
            onClick={() => handleRedirect('teacher')}
          >
            <School className="mr-2 h-6 w-6" />
            Teacher
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
