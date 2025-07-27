/**
 * frontend/src/components/TabButton.jsx
 */


import React from 'react'
import { Link } from 'react-router-dom'


export const TabButton = ({ _id, index, reviews }) => {
  const [text, title] = (reviews) 
    ? [`List ${index}`, `Review ${reviews}`]
    : ["Add", "Add new phrases"]

  const to = (reviews)
    ? `/rev/{reviews}`
    : `/add`

  return (
    <li
      title={title}
    >
      <Link to={to}><button>{text}</button></Link>
    </li>
  )
}