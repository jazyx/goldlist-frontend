/**
 * frontend/src/pages/Phrases.jsx
 */


import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Phrase } from '../components/Phrase'
import { PhrasesFooter } from '../components/PhrasesFooter'
import { DaysWorkDone } from '../components/DaysWorkDone'



export const Phrases = () => {
  const navigate = useNavigate()
  const [ gone, setGone ] = useState(false)
  

  const {
    user,
    getPhrases,
  } = useContext(UserContext)
  const phrases = getPhrases()

  
  // There may be saved phrase objects which no longer have any
  // text. Don't count them.
  const count = phrases.reduce(
    ( sum, phrase ) => sum += !!phrase.db.text
    , 0
  ) || 0
  

  const phraseList = phrases.map( phrase => {
    const key = phrase._id || phrase.key
    return <Phrase {...phrase} key={key}/>
  })


  /////////////////// HACK TO AVOID EMPTY LISTS ///////////////////
  // If the user_id has been retrieved from the database, but no
  // phrases are associated with the current location.pathname,
  // the chances are that the location.pathname refers to a non-
  // existant list. Return to a list that is known to exist.
  const checkForValidListIndex = () => {
    if (user._id && !phrases?.length && !gone) {
      setGone(true)
      navigate("/add")
    }
  }

  useEffect(checkForValidListIndex, [user._id])
  /////////////////////////// END HACK ///////////////////////////


  return (
    <main>
      <Tabs/>
      <div
        id="phrases"
      >
        <div className="phrases">
          {phraseList}
        </div>
        <DaysWorkDone />
      </div>
      <div className="spacer"></div>
      <PhrasesFooter count={count} />
    </main>
  )
}