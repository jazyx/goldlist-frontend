/**
 * frontend/src/pages/Footer.jsx
 */


import { useContext } from "react"
import { UserContext } from "../contexts"


export const Footer = (props) => {
  const { list } = useContext(UserContext)
  const { length, remain } = list

  return (
    <footer>
      <span className="counter">{length}/{remain}</span>
      <button disabled>Add More</button>
      <button disabled>Start Review</button>
    </footer>
  )
}