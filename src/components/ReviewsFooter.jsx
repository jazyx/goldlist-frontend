/**
 * frontend/src/components/ReviewsFooter.jsx
 */

import { useContext, useEffect } from "react"
import { UserContext } from "../contexts"
import { SubmitReview } from "./SubmitReview"
import { Counter } from "./Counter"
import { ThreeWaySlider } from "./ThreeWaySlider"

export const ReviewsFooter = () => {
  const {
    user,
    getPhrases,
    toggleLimitState,
    cancelReview
  } = useContext(UserContext)

  const { limitState } = user
   // "on" (limit=>true), "mix", "off" (limit=>false)
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


  const limitProps = {
    name: "limit",
    check: limitState,
    action: toggleLimitState,
    vertical: true,
    title: "Set preview preference"
  }


  const updateReviewState = () => {
    // If not enough phrases are treated, ensure that UserContext's
    // `submit` state is not "ready". Otherwise, leave it as it is.
    // It might have been set to "cancelled", in which case another
    // click on the Submit Review button will be necessary in order
    // to set it to "ready" again.
    if (disabled) {
      cancelReview("untreated")
    }
  }


  useEffect(updateReviewState)


  return (
    <footer>
      <Counter {...retained} icon="✅" />
      <SubmitReview disabled={disabled} />
      <ThreeWaySlider {...limitProps}/>
      <Counter {...reviewed} icon="🟢" side="right" />
    </footer>
  )
}