/**
 * frontend/src/pages/Add.jsx
 */


import { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../contexts'
import { Tabs } from '../components/Tabs'
import { Phrase } from '../components/Phrase'
import { Footer } from '../components/Footer'


export const Add = () => {
  const params = useParams()
  const { index } = params
  const { getPhrases, setListIndex, listIndex } = useContext(UserContext)
  const phrases = getPhrases()

  // [ {
  //     "_id": "6885dff18637f1dff16ff520",
  //     "lists": [
  //       "6885dff18637f1dff16ff4dd"
  //     ],
  //     "text": "Great Britain",
  //     "hint": "Великобритания",
  //     "created": "2025-07-27T08:14:41.635Z",
  //     "__v": 0
  //   }, ...
  // ]

  const phraseList = phrases?.map( phrase => {
    return <Phrase {...phrase} key={phrase._id}/>
  })


  useEffect(() => setListIndex(index || listIndex), [index])


  return (
    <main>
      <Tabs/>
      <div
        id="phraseList"
      >
        {phraseList}
      </div>
      <Footer />
    </main>
  )
}