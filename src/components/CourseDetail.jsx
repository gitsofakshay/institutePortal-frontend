import { useContext } from "react";
import { useParams } from "react-router-dom";
import courseContext from '../context/courseDetail/CourseContext';

export default function CourseDetail() {
  const { courses } = useContext(courseContext);
  const { id } = useParams();

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-lg font-medium text-red-600">
        Course not found!
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">
          {course.name} Course Details
        </h2>
        <div className="space-y-4 text-gray-800">
          <p>
            <span className="font-semibold">Duration:</span> {course.duration}
          </p>
          <p>
            <span className="font-semibold">Fees:</span> {course.fees}
          </p>
          <p>
            <span className="font-semibold">Scholarship:</span> {course.scholarship}
          </p>
          <p>
            <span className="font-semibold">Eligibility:</span> {course.eligibility}
          </p>
          <p>
            <span className="font-semibold">Certificate:</span> {course.certification}
          </p>
          <p>
            <span className="font-semibold">Description:</span> {course.description}
          </p>
          <p>
            <span className="font-semibold">Career Options:</span> {course.careerProspects}
          </p>
        </div>
      </div>
    </div>
  );
}
