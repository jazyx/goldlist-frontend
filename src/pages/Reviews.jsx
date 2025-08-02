/**
 * frontend/src/pages/Rev.jsx
 */


import { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Review } from '../components/Review'
import { ReviewsFooter } from '../components/ReviewsFooter'



export const Reviews = (props) => {
  const params = useParams()
  const { index } = params

  const {
    getActive,
    listIndex,
    setListIndex,
    dismissReview
  } = useContext(UserContext)


  const list = getActive("redo")
  const { phrases = [], reviewed } = list


  const phraseList = phrases.map(phrase => {
    return (
      <Review {...phrase} key={phrase._id} />
    )
  })
      // console.log("phrases", JSON.stringify(phrases, null, '  '));



  const createMask = () => {
    const reviewed = phrases.filter( phrase => {
      return phrase.retained === true
    }).map( phrase => (
      <li
        key={phrase._id}
      >
        {phrase.db.text}
      </li>
    ))

    const reviewedCount = reviewed.length
    const header = (reviewedCount === 1)
      ? "You have decided to remember this phrase:"
      : `You have decided to remember these ${reviewedCount} phrases:`

    return <div className="mask">
      <div className="retained">
        <h3>{header}</h3>
        <ul>
          {reviewed}
        </ul>
        <button 
          className="primary"
          onClick={dismissReview}
        >Continue</button>
      </div>
    </div>
  }


  const [ className, mask ] = (reviewed)
    ? [ "mask", createMask() ]
    : [ null, undefined ]


  useEffect(() => setListIndex( index || listIndex ), [index] )


  return (
    <main>
      <Tabs/>
      <div
        id="review"
        className={className}
      >
        <div className="reviews">
          {phraseList}
        </div>
        {mask}
      </div>
      <div className="spacer"></div>
      <ReviewsFooter />
    </main>
  )
}