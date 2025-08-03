/**
 * frontend/src/components/TabButton.jsx
 */


import { Link } from 'react-router-dom'


export const TabButton = ({ edit, index, reviews }) => {
  const label = (() => {
    if (!reviews) { return }

    const done = reviews - 1

    if (!done) {
      return "No reviews yet"
    }
    if (done === 1) {
      return "1st review"
    }
    if (done === 11) {
      return "11th review"
    }

    const digit = (done) % 10
    switch (digit) {
      case 1:
        return `${done}st review`
      case 2:
        return `${done}nd review`
      case 3:
        return `${done}rd review`
      default:
        return `${done}th review`
    }
  })()


  const name = (index < 0) 
    ? `R${-index}` // This is a recycled list of knotty words
    : index


  const [text, title] = (reviews)
    ? [`List ${name}`, `Review list ${name} (${label})`]
    : (edit)
      ? [`Edit ${name}`, "Edit recent phrases"]
      : ["Add", "Add new phrases"]

  const to = (reviews)
    ? `/rev/${index}`
    : `/add/${index}`

  const { pathname } = location
  const active = pathname === `${to}`
    || pathname === "/add" && text === "Add"

  const className = (active)
    ? "active"
    : null

  return (
    <li
      title={title}
      draggable={false}
      className={className}
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