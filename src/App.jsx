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
import { Rev } from './pages/Rev'
import { NotFound } from './pages/NotFound'
import { Provider } from './contexts/'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="add">
              <Route
                path=":index/"
                element={<Add />}
              />
              <Route
                path=""
                element={<Add />}
              />
            </Route>
          <Route path="rev/:index" element={<Rev />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App