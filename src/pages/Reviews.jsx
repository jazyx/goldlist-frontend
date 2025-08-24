/**
 * frontend/src/pages/Reviews.jsx
 */

import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Review } from '../components/Review'
import { ConfirmReview } from '../components/ConfirmReview'
import { ReviewsFooter } from '../components/ReviewsFooter'
import { DaysWorkDone } from '../components/DaysWorkDone'



export const Reviews = () => {
  const navigate = useNavigate()
  const [ gone, setGone ] = useState(false)
  
  const {
    user,
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


  /////////////////// HACK TO AVOID EMPTY LISTS ///////////////////
  // If the user_id has been retrieved from the database, but no
  // phrases are associated with the current location.pathname,
  // the chances are that the location.pathname refers to a non-
  // existant list. Return to a list that is known to exist.
  const checkForValidListIndex = () => {
    if (user._id && !phrases?.length && !gone) {
      setGone(true)
      navigate("/add") // not a redo, but hey...
    }
  }

  useEffect(checkForValidListIndex, [user._id])
  /////////////////////////// END HACK ///////////////////////////


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