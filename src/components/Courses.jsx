import React from 'react'
import { Link } from 'react-router-dom'
import bca from '../assets/bca-course.jpg'
import dca from '../assets/dca-course.jpg'
import bcom from '../assets/bcom-course.png'
import pgdca from '../assets/pgdca-course.jpg'
import tally from '../assets/tally-course.jpg'
import msoffice from '../assets/msoffice-course.jpg'
import courseContext from '../context/courseDetail/CourseContext'
import { useContext } from 'react'

export default function Courses() {
  const { courses } = useContext(courseContext);
  const courseImages = {
    bca,
    bcom,
    dca,
    pgdca,
    tally,
    msoffice,
  };

  return (
    <div className="container">
      <h1 className="text-center my-5">Courses provided by Agrasen Institute</h1>
      <div className="row justify-content-md-center">
        {courses.map((course) => (
          <div key={course.id} className="col-md-3 my-4 card mx-3 p-3">
            <img src={courseImages[course.id]} className="card-img-top" style={{ height: "240px" }} alt={course.name}/>
            <div className="card-body">
              <h5 className="card-title">{course.name}</h5>
              <p className="card-text">{course.description.length >  100 ? course.description.slice(0, 100) + "..." : course.description}</p>
              <Link to={`/course/${course.id}`} className="btn btn-primary">Course Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}