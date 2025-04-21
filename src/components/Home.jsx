import { useState } from "react";
import Footer from "./Footer";
import student1 from "../assets/student1.jpg";
import student2 from "../assets/student2.jpg";
import student3 from "../assets/student3.avif";
import student4 from "../assets/student4.jpg";
import student5 from "../assets/student5.jpg";
import Logo from "../assets/aph_logo.png";
import "./Home.css";
import Courses from "./Courses";
import EnrollNow from "./EnrollNow";

const images = [student1, student2, student3, student4, student5];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <div className="px-4 py-8">
        <img
          src={Logo}
          alt="Akshay Institute Logo"
          id="logo"
          className="mx-auto w-25 h-auto mb-1"
        />
        <h1 className="text-3xl font-bold text-center mb-4">
          Akshay Institute
        </h1>

        <div className="text-center text-lg mb-8 max-w-2xl mx-auto">
          {`"Empowering Future Leaders Through Quality Education and Innovation – Akshay Institutes"`}
        </div>

          {/* Carousel */}
          <div className="relative max-w-4xl mx-auto overflow-hidden rounded-lg shadow-lg">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-[400px] sm:h-[500px] object-cover transition-all duration-700 ease-in-out"
            />

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              ❮
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>        
      </div>

      <Courses />
      <EnrollNow />
      <Footer />
    </div>
  );
}
