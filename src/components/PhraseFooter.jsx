/**
 * frontend/src/pages/PhraseFooter.jsx
 * 
 * Reads `length` and `remain` from the active list and tells the
 * Counter component to display `length / remain` in the right
 * color.
 */



import { useContext } from "react"
import { UserContext } from "../contexts"
import { Counter } from "./Counter"
import { MoreButton } from "./MoreButton"


export const PhraseFooter = () => {
  const { getActive, lists, addList } = useContext(UserContext)
  const list = getActive("list")
  const target = 21
  const { length: count, remain: total } = (
    list || { length: 0, remain: target }
  )


  // const { getActive, lists, addList } = useContext(UserContext)
  // const list = getActive("list")


  const disabled = list !== lists[0]
    ? true
    : !lists[0] || list?.length < target
  
  return (
    <footer>
      <Counter {...{ count, total, target }}/>
      <MoreButton {...{disabled, addList}} />
      <button disabled>Start Review</button>
    </footer>
  )
}