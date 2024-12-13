import { useContext } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Courses from './components/Courses'
import FeeStructure from './components/FeeStructure'
import EnrollNow from './components/EnrollNow'
import Admin from './components/Admin'
import Login from './components/Login'
import Alert from './components/Alert'
import Loading from './components/Loading'
import alertContext from './context/alert/alertContext'
import loadingContext from './context/loading/loadingContext'
import CourseDetail from './components/CourseDetail'

function App() {
  const alertcontext = useContext(alertContext);
  const loadingcontext = useContext(loadingContext);
  const {alert} = alertcontext;
  const {loading} = loadingcontext;
  const location = useLocation();

  // Do not show navbar on the admin panel route
  const showNavbar = location.pathname !== "/admin";

  return (
    <>
        {showNavbar && <Navbar />}
        <Alert alert={alert} />
        {loading && <Loading />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Courses' element={<Courses />} />
          <Route path='/FeeStructure' element={<FeeStructure />} />
          <Route path='/EnrollNow' element={<EnrollNow />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/login' element={<Login />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        </Routes>
    </>
  )
}

export default App
