/**
 * frontend/src/components/Phrase.jsx
 */

import { useContext } from 'react'
import { UserContext } from '../contexts'


export const Phrase = ({ text, hint, _id }) => {
  const { editText, editHint } = useContext(UserContext)


  return (
    <div>{text} | {hint}</div>
  )
}