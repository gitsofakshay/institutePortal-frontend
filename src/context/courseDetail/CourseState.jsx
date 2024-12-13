import React from "react";
import { useState } from "react";
import CourseContext from "./CourseContext";
import courses from "./CoursesData";
export default function CourseState(props) {
    const [selectedCourse, setSelectedCourse] = useState(null);
    return (
        <CourseContext.Provider value={{ courses, selectedCourse, setSelectedCourse }}>
            {props.children}
        </CourseContext.Provider>
    )
}
