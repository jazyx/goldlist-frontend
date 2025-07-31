/**
 * frontend/src/components/ReviewsFooter.jsx
 */

import { useContext } from "react"
import { UserContext } from "../contexts"
import { SubmitReview } from "./SubmitReview"
import { Counter } from "./Counter"

export const ReviewsFooter = (props) => {
  const { getPhrases } = useContext(UserContext)
  const phrases = getPhrases("redo")

  const status = phrases.reduce(( status, phrase ) => {
    const { retain, db } = phrase
    status.total += (!db.retain)
    status.count += (!!retain && !db.retain)
    return status
  }, { count: 0, total: 0 })

  const { total, count } = status

  // total should be the number of phrases that have not been
  // retained in the last review
  // count is the number of phrases flagged to be retained
  // target should be (total - retained) * 0.3 = 30% of remainder

  const target = Math.round(total * 0.3) // x.5 -> x+1
  // 21 - (6.3) -> 15 - (4.5) -> 10 - (3) -> 7

  const disabled = count < target

  return (
    <footer>
      <Counter {...{ count, target, total }} />
      <SubmitReview disabled={disabled} />
    </footer>
  )
}