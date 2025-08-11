/**
 * frontend/src/App.jsx
 */
 
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './App.css'
import { About } from './pages/About'
import { Connect } from './pages/Connect'
import { I18N } from './pages/I18N'
import { Phrases } from './pages/Phrases'
import { Reviews } from './pages/Reviews'
import { NotFound } from './pages/NotFound'
import { Provider } from './contexts/'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route index element={<Connect />} />
          <Route path="about" element={<About />} />
          <Route path="i18n" element={<I18N />} />
          <Route path="add">
              <Route
                path=":index/"
                element={<Phrases />}
              />
              <Route
                path=""
                element={<Phrases />}
              />
            </Route>
          <Route path="rev/:index" element={<Reviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Provider>
    </Router>
  )
}

export default App