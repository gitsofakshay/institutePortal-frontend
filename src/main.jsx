import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import AlertState from './context/alert/AlertState.jsx'
import LoadingState from './context/loading/LoadingState.jsx'
import CourseState from './context/courseDetail/CourseState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingState>
      <AlertState>
        <CourseState>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </CourseState>
      </AlertState>
    </LoadingState>
  </StrictMode>,
)
