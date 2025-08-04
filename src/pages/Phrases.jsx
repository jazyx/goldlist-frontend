/**
 * frontend/src/pages/Phrases.jsx
 */


import { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Phrase } from '../components/Phrase'
import { PhrasesFooter } from '../components/PhrasesFooter'


export const Phrases = () => {
  const params = useParams()
  const { index } = params
  const {
    getPhrases,
    // setListIndex,
    listIndex
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


  // useEffect(() => setListIndex(index || listIndex), [index])


  return (
    <main>
      <Tabs/>
      <div
        id="phraseList"
      >
        {phraseList}
      </div>
      <div className="spacer"></div>
      <PhrasesFooter count={count} />
    </main>
  )
}