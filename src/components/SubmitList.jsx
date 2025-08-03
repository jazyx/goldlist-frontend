/**
 * frontend/src/components/SubmitList.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'


export const SubmitList = ({ _id }) => {
  const { submitList } = useContext(UserContext)


  // TODO: Show warning if Edit list is old
  const className = (true)
    ? "primary"
    : "warning"


  return (
    <button 
      className={className}
      onClick={() => submitList(_id)}
    >
      Submit List
    </button>
  )
}