/**
 * frontend/src/App.jsx
 */
 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './App.css'
import { Ping } from './components/Ping'
import { Page1 } from './pages/Page1'
import { Page2 } from './pages/Page2'
import { NotFound } from './pages/NotFound'
import { APIProvider } from './contexts/APIContext'


function App() {
  return (
    <Router>
      <APIProvider>
        <Routes>
          <Route index element={<Page1 />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/ping" element={<Ping />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </APIProvider>
    </Router>
  )
}

export default App