/**
 * frontend/src/components/MoreButton.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'


export const MoreButton = (props) => {
  const { getActiveList, lists, addList } = useContext(UserContext)
  const list = getActiveList()


  const disabled = list !== lists[0]
    ? true
    : !lists[0] || list?.length < 21

  return (
    <button
       disabled={disabled}
       onClick={addList}
    >
      Add More
    </button>
  )
}