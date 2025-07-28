/**
 * frontend/src/pages/Footer.jsx
 */



import { Counter } from "./Counter"
import { MoreButton } from "./MoreButton"


export const Footer = () => {
  return (
    <footer>
      <Counter />
      <MoreButton/>
      <button disabled>Start Review</button>
    </footer>
  )
}