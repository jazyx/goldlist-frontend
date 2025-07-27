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
import { Add } from './pages/Add'
import { NotFound } from './pages/NotFound'
import { Provider } from './contexts/'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="add" element={<Add />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App