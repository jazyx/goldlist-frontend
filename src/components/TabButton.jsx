/**
 * frontend/src/components/TabButton.jsx
 */


import { Link } from 'react-router-dom'


export const TabButton = ({ _id, index, reviews }) => {
  const [text, title] = (reviews) 
    ? [`List ${index}`, `Review ${reviews}`]
    : ["Add", "Add new phrases"]

  const to = (reviews)
    ? `/rev/${index}`
    : `/add`

  return (
    <li
      title={title}
      draggable={false}
    >
      <Link to={to}
        draggable={false}
      >
        <button
          draggable={false}
        >
          {text}
        </button>
      </Link>
    </li>
  )
}