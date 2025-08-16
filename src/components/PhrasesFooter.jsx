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
import { SubmitList } from "./SubmitList"


export const PhrasesFooter = ({ count }) => {
  const {
    preferences,
    getActive,
    lists,
    addList
  } = useContext(UserContext)
  const list = getActive()
  const target = preferences.phraseCount
  const total = list?.remain || target


  const isAddList = list === lists[0]
  const disabled = !isAddList
    ? true
    : !lists[0] || count < target


  const button = (isAddList)
    ? <MoreButton {...{disabled, addList}} />
    : <SubmitList {...list}/>

  const icon = "🟢"
  const side = "right"


  return (
    <footer>
      {button}
      <Counter {...{ count, total, target, icon, side }} />
    </footer>
  )
}