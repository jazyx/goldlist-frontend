/**
 * frontend/src/components/ConfirmReview.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'



export const ConfirmReview = ({phrases}) => {
  const {
    cancelReview,
    submitReview
  } = useContext(UserContext)


  const reviewed = phrases.filter( phrase => {
    return phrase.retained === true
  }).map( phrase => (
    <li
      key={phrase._id}
    >
      {phrase.db.text}
    </li>
  ))


  const reviewedCount = reviewed.length
  const header = (reviewedCount === 1)
    ? "You have decided to remember this phrase:"
    : `You have decided to remember these ${reviewedCount} phrases:`


  return <div className="mask">
    <div className="dialog">
      <h2>{header}</h2>
      <ul>
        {reviewed}
      </ul>
      <div className="buttons">
        <button
          onClick={cancelReview}
        >
          Cancel
        </button>
        <button
          className="primary"
          onClick={submitReview}
        >
          Continue
        </button>
      </div>
    </div>
  </div>
}
