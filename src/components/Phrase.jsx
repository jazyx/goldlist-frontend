/**
 * frontend/src/components/Phrase.jsx
 */

import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TextArea } from './TextArea'


export const Phrase = ({ _id, text, hint, db, saving }) => {
  const {
    editPhrase,
    updatePhrase
  } = useContext(UserContext)


  function onChange({target}) {
    const { name, value } = target
    editPhrase({ name, _id, value })
  }


  function saveChanges() {
    updatePhrase(_id)
  }


  const textClass = (text === db.text)
    ? null
    : "altered"

  const hintClass = (hint === db.hint)
    ? null
    : (text)
      ? "altered"
      : "hinted"

  const buttonClass = (saving)
    ? "saving"
    : (textClass || (text && hintClass))
      ? "altered"   // only if text exists and is altered
      : (text)
        ? "saved" // text is like db, but hint may be missing
          : ""      // empty text


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
        className="button"
      >
        <button
          className={buttonClass}
          onClick={saveChanges}
        ></button>
      </div>
    </div>
  )
}