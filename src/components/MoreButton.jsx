/**
 * frontend/src/components/MoreButton.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'


export const MoreButton = ({disabled, addList}) => {
  // const { getActive, lists, addList } = useContext(UserContext)
  // const list = getActive("list")


  // const disabled = list !== lists[0]
  //   ? true
  //   : !lists[0] || list?.length < 21

  return (
    <button
       disabled={disabled}
       onClick={addList}
    >
      Add More
    </button>
  )
}