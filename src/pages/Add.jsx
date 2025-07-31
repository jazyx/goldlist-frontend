/**
 * frontend/src/pages/Add.jsx
 */


import { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Phrase } from '../components/Phrase'
import { PhraseFooter } from '../components/PhraseFooter'


export const Add = () => {
  const params = useParams()
  const { index } = params
  const { getPhrases, setListIndex, listIndex } = useContext(UserContext)
  const phrases = getPhrases()
  

  const phraseList = phrases?.map( phrase => {
    const key = phrase._id || phrase.key
    return <Phrase {...phrase} key={key}/>
  })


  useEffect(() => setListIndex(index || listIndex), [index])


  return (
    <main>
      <div
        id="phraseList"
      >
        {phraseList}
      </div>
      <Tabs/>
      <PhraseFooter />
    </main>
  )
}