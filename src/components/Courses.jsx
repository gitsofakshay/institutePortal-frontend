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
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Courses provided by Akshay Institutes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
        {courses.map((course) => (
          <div
            key={course.id}
            className="w-full sm:w-[90%] max-w-sm bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4"
          >
            <img
              src={courseImages[course.id]}
              alt={course.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div>
              <h5 className="text-lg font-semibold mb-2">{course.name}</h5>
              <p className="text-gray-700 mb-4 text-sm">
                {course.description.length > 100
                  ? course.description.slice(0, 100) + '...'
                  : course.description}
              </p>
              <Link
                to={`/course/${course.id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Course Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}