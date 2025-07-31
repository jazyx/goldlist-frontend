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
    getPhrases,
    listIndex,
    setListIndex
  } = useContext(UserContext)


  useEffect(() => setListIndex( index || listIndex ), [index] )


  const phrases = getPhrases("redo")


  const phraseList = phrases.map(phrase => {
    return (
      <Review {...phrase} key={phrase._id} />
    )
  })


  return (
    <main>
      <div
        id="review"
      >
        {phraseList}
      </div>
      <Tabs/>
      <ReviewsFooter />
    </main>
  )
}