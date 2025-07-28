/**
 * frontend/src/components/MoreButton.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'


export const MoreButton = (props) => {
  const { lists, listIndex, addList } = useContext(UserContext)
  const disabled =  (listIndex)
    ? true
    : !lists[0] || lists[0]?.length < 21

  return (
    <button
       disabled={disabled}
       onClick={addList}
    >
      Add More
    </button>
  )
}