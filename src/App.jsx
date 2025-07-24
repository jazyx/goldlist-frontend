/**
 * frontend/src/App.jsx
 */
 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { APIProvider } from './contexts/APIContext'


function App() {
  return (
    <Router>
      <APIProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </APIProvider>
    </Router>
  )
}

export default App