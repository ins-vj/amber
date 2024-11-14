"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import CourseInfo from '@/components/course-info';

const page = ({params}:{params: {coursename : string}}) => {
    const { coursename } = params;
    // const { query } = useRouter();
    // console.log(query);
    const data = fetch (`http://localhost:3000/api/course/${coursename}`)
  return (
    <div>
    <CourseInfo data={data}/>
    </div>
  )
}

export default page