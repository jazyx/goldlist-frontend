/**
 * frontend/src/pages/Reviews.jsx
 */

import { useContext } from 'react'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Review } from '../components/Review'
import { ConfirmReview } from '../components/ConfirmReview'
import { ReviewsFooter } from '../components/ReviewsFooter'
import { DaysWorkDone } from '../components/DaysWorkDone'


// let renders = 0

export const Reviews = () => {
  const {
    getActive,
    reviewState
  } = useContext(UserContext)
  // reviewState = "untreated" | "cancelled" | "ready"


  const list = getActive()
  const { phrases = [] } = list


  const phraseList = phrases.map(phrase => {
    return (
      <Review {...phrase} key={phrase._id} />
    )
  })


  const [ className, confirmMask ] = (reviewState === "ready")
    ? [ "confirm mask", <ConfirmReview phrases={phrases} /> ]
    : [ null, undefined ]



  return (
    <main>
      <Tabs/>
      <div
        id="reviews"
        className={className}
      >
        <div className="reviews">
          {phraseList}
        </div>
        {confirmMask}
        <DaysWorkDone />
      </div>
      <div className="spacer"></div>
      <ReviewsFooter />
    </main>
  )
}