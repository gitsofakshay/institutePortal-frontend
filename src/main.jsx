import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import AlertState from './context/alert/AlertState.jsx'
import LoadingState from './context/loading/LoadingState.jsx'
import CourseState from './context/courseDetail/CourseState.jsx'
import FetchState from './context/fetchStudentRecord/fetchState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingState>
      <AlertState>
        <CourseState>
          <FetchState>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </FetchState>
        </CourseState>
      </AlertState>
    </LoadingState>
  </StrictMode>,
)
