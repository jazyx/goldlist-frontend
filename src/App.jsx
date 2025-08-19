/**
 * frontend/src/App.jsx
 */
 
import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import './CSS/general.css'
import { Provider } from './contexts/'
import {
  About,
  Connect,
  Frame,
  I18N,
  NotFound,
  Phrases,
  Profile,
  Reviews
} from './pages'


function App() {
  return (
    <Router>
      <Provider>
        <Routes>
          <Route
            path="/"
            element={<Frame />}
          >
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
            <Route path="profile" element={<Profile />} />
            <Route path="rev/:index" element={<Reviews />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Provider>
    </Router>
  )
}


export default function WrappedApp() {
  return (
    <Suspense fallback="...loading translations">
      <App />
    </Suspense>
  );
}