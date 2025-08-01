/**
 * frontend/src/pages/PhrasesFooter.jsx
 * 
 * Reads `length` and `remain` from the active list and tells the
 * Counter component to display `length / remain` in the right
 * color.
 */



import { useContext } from "react"
import { UserContext } from "../contexts"
import { Counter } from "./Counter"
import { MoreButton } from "./MoreButton"


export const PhrasesFooter = () => {
  const { getActive, lists, addList } = useContext(UserContext)
  const list = getActive("list")
  const phrases = list.phrases || []
  const target = 21
  const total = list.remain || target

  // There may be saved phrase objects which no longer have any
  // text. Don't count them.
  const count = phrases.reduce(
    ( sum, phrase ) => sum += !!phrase.text
    , 0
  ) || 0

  const disabled = list !== lists[0]
    ? true
    : !lists[0] || count < target
  
  return (
    <footer>
      <Counter {...{ count, total, target }}/>
      <MoreButton {...{disabled, addList}} />
      {/* <button disabled>Start Review</button> */}
    </footer>
  )
}