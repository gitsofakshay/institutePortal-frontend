export default function FeeStructure() {
  const courses = [
    { name: "BCA", duration: "3 years", fee: "₹6000 / semester", scholarship: "No Scholarship" },
    { name: "B.Com", duration: "3 years", fee: "₹6000 / semester", scholarship: "No Scholarship" },
    { name: "DCA", duration: "1 year", fee: "₹6000 / semester", scholarship: "No Scholarship" },
    { name: "PGDCA", duration: "1 year", fee: "₹6000 / semester", scholarship: "No Scholarship" },
    { name: "Tally ERP9", duration: "1 year", fee: "₹10000", scholarship: "No Scholarship" },
    { name: "MS Office", duration: "6 months", fee: "₹6000", scholarship: "No Scholarship" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Fee Structure of Akshay Institutes Maihar
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6"
          >
            <div className="text-indigo-600 font-semibold text-xl mb-2">{course.name}</div>
            <p className="text-gray-600 mb-1">
              <span className="font-medium text-gray-700">Duration:</span> {course.duration}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium text-gray-700">Fee:</span> {course.fee}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">Scholarship:</span> {course.scholarship}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
