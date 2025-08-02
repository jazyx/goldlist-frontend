/**
 * frontend/src/components/ReviewsFooter.jsx
 */

import { useContext } from "react"
import { UserContext } from "../contexts"
import { SubmitReview } from "./SubmitReview"
import { Counter } from "./Counter"
import { CheckSlider } from './CheckSlider'

export const ReviewsFooter = (props) => {
  const {
    getPhrases,
    openAll,
    toggleOpenAll
  } = useContext(UserContext)
  const phrases = getPhrases("redo")


  const retained = phrases.reduce(( status, phrase ) => {
    // total should be the number of phrases that have not been
    // retained in the last review
    // count is the number of phrases flagged to be retained
    // target should be (total - retained) * 0.3 = 30% of remainder
    // 21 - (6.3) -> 15 - (4.5) -> 10 - (3) -> 7
    const { retained, db } = phrase
    status.total += (!db.retained)
    status.count += (!!retained && !db.retained)
    status.target = Math.round(status.total * 0.3)
    return status
  }, { total: 0, count: 0, target: 0 })


 const reviewed = phrases.reduce(( status, phrase ) => {
    const { retained, right, db } = phrase
    const consider = !retained && !db.retained // boolean
    status.target = status.total += consider
    status.count += (right && consider) || 0   // avoid NaN
    return status
  }, { total: 0, count: 0, target: 0 })


  const disabled = retained.count < retained.target
    || (retained.count + reviewed.count) !== retained.total

  const open = {
    name: "openAll",
    className: "open-all",
    checked: openAll,
    action: toggleOpenAll
  }

  return (
    <footer>
      <Counter {...retained} icon="🛟" />
      <CheckSlider {...open} vertical={true}/>
      <SubmitReview disabled={disabled} />
      <Counter {...reviewed} icon="🟢" side="right" />
    </footer>
  )
}