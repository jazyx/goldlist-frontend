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
import { Provider } from './contexts/'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App