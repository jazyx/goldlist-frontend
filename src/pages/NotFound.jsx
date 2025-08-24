/**
 * frontend/src/pages/NotFound.jsx
 *
 * The only way to get here is to type an invalid address in the
 * address bar. Simply return to the login page.
 *
 * This page must have an HTML element, or bad things happen.
 */


import { useNavigate } from 'react-router-dom'


export const NotFound = () => {
  const navigate = useNavigate()

  navigate("/")

  return (<u></u>)
}