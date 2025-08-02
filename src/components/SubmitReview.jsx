/**
 * frontend/src/components/SubmitReview.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'
import { use } from 'react'


export const SubmitReview = ({ disabled }) => {
  const { submitReview } = useContext(UserContext)


  return (
    <button 
      className="primary"
      disabled={disabled}
      onClick={submitReview}
    >
      Submit Review
    </button>
  )
}