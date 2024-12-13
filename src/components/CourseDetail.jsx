import React from 'react'
import { useContext } from "react";
import { useParams } from "react-router-dom";
import courseContext from '../context/courseDetail/CourseContext'
export default function CourseDetail() {
  const { courses } = useContext(courseContext);
  const { id } = useParams();

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return <div className="container my-5 text-center">Course not found!</div>;
  }
  return (
    <div className="container py-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-3">{course.name} Course Details</h2>
          <p>
            <strong>Duration:</strong> {course.duration}
          </p>
          <p>
            <strong>Fees:</strong> {course.fees}
          </p>
          <p>
            <strong>Scholarship:</strong> {course.scholarship}
          </p>
          <p>
            <strong>Eligibility:</strong> {course.eligibility}
          </p>
          <p>
            <strong>Certificate:</strong> {course.certification}
          </p>
          <p>
            <strong>Description:</strong> {course.description}
          </p>
          <p>
            <strong>Career Options:</strong> {course.careerProspects}
          </p>
        </div>
      </div>
    </div>
  )
}