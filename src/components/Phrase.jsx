/**
 * frontend/src/components/Phrase.jsx
 */

import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TextArea } from './TextArea'


export const Phrase = ({ _id, text, hint, db }) => {
  const { editPhrase } = useContext(UserContext)


  function onChange({target}) {
    const { name, value } = target
    editPhrase({ name, _id, value })
  }


  const textClass = (text === db.text)
    ? null
    : "altered"

  const hintClass = (hint === db.hint)
    ? null
    : "altered"

  const buttonClass = (textClass || hintClass)
    ? "buttons altered"
    : "buttons"


  return (
    <div
      className="phrase"
    >
      <div
        className="number"
      />
      <div>
        <TextArea
          name="text"
          text={text}
          className={textClass}
          onChange={onChange}
        />
        <TextArea
          name="hint"
          text={hint}
          className={hintClass}
          onChange={onChange}
        />
      </div>
      <div
        className={buttonClass}
      >
        <button>&gt;</button>
      </div>
    </div>
  )
}