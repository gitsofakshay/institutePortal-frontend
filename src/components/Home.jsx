import React from 'react'
import Footer from './Footer'
import student1 from '../assets/student1.jpg'
import student2 from '../assets/student2.jpg'
import student3 from '../assets/student3.avif'
import student4 from '../assets/student4.jpg'
import student5 from '../assets/student5.jpg'
import Logo from '../assets/Logo.png'
import './Home.css'
import Courses from './Courses'
import EnrollNow from './EnrollNow'

export default function Home() {
  return (
    <div >
      <img src={Logo} alt="" id='logo' />
      <div className="marquee">
        <p>
          This site is in under development!!!
        </p>
      </div>
      <h1 className='text-center mb-3' >Maharaja Agrasen Institute Maihar</h1>
      <div className="container-sm mb-5 text-center" style={{ "fontSize": "1.2rem" }}>
        "Empowering Future Leaders Through Quality Education and Innovation – Maharaja Agrasen Institute, Maihar"
      </div>
      <div id="carouselExampleAutoplaying" className="container carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={student1} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item" >
            <img src={student2} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item" >
            <img src={student3} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item" >
            <img src={student4} className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item" >
            <img src={student5} className="d-block w-100" alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <Courses />
      <EnrollNow />
      <Footer />
    </div >
  )
}
