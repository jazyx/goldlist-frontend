/**
 * frontend/src/components/Phrase.jsx
 */

import { useContext } from 'react'
import { UserContext } from '../contexts'
import { TextArea } from './TextArea'


export const Phrase = ({ _id, text, hint, db, saving }) => {
  const {
    editPhrase,
    updatePhrase,
    tabNextOnEnter,
    scrollIntoView
  } = useContext(UserContext)


  function onChange({target}) {
    const { name, value } = target
    editPhrase({ name, _id, value })
  }


  function saveOnBlur({ target, relatedTarget }) {
    const phrase = target.closest(".phrase")
    if (!phrase || phrase.contains(relatedTarget)) {
      // The current focus is in the same div.phrase
      return
    }

    // Only save if the phrase has changed since the last save
    if (text !== db.text || hint !== db.hint) {
      checkForUpdate()
    }
  }


  const checkForUpdate = () => {
    if (!(text.trim())) {
      // Can't save a phrase with no text; restore db version
      return onChange({target: {name: "text", value: db.text}})
      // TODO: Show flash to indicate that text has been restored
    }

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
      onBlur={saveOnBlur}
    >
      <div className="number" >
        <span></span>
      </div>
      <div className="desk">
        <TextArea
          name="text"
          text={text}
          className={textClass}
          onKeyDown={tabNextOnEnter}
          onChange={onChange}
          onFocus={scrollIntoView}
        />
        <TextArea
          name="hint"
          text={hint}
          className={hintClass}
          onKeyDown={tabNextOnEnter}
          onChange={onChange}
          onFocus={scrollIntoView}
        />
      </div>
      <div
        className="button"
      >
        <button
          className={buttonClass}
          onClick={checkForUpdate}
        ></button>
      </div>
    </div>
  )
}