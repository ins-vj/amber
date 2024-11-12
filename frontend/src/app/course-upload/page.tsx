import CourseUpload from '@/components/course-upload'
import Navbar from '@/components/navbar'
import { Sidebar } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        {/* <Sidebar/> */}
        <CourseUpload/>
    </div>
  )
}

export default page