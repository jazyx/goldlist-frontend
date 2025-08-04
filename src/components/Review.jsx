/**
 * frontend/src/components/Review.jsx
 */


import { useContext, useEffect } from 'react'
import { UserContext } from '../contexts'
import { Feedback } from './Feedback'
import { TextArea } from './TextArea'
import { Hint } from './Hint'
import { CheckSlider } from './CheckSlider'
import { GreenCircle } from './GreenCircle'


export const Review = ({
  _id,
  text,
  hint,
  db,
  right,    // user correctly typed text
  retained, // user checked left CheckSlider
  limit     // user checked right CheckSlider:
            // = show full text prompt when not retained
            // = show hint after retained is checked
}) => {
  const {
    editPhrase,
    toggleRedo,
    tabNextOnEnter,
    scrollIntoView,
    openAll
  } = useContext(UserContext)


  const locked = !!db?.retained
  const retainCheck = (locked && openAll) ? false : !!retained
  // Don't limit feedback or visibility of hint if openAll is true
  const limitCheck = (openAll) ? false : limit


  const resetText = () => {
    if (!right && text === db.text && !locked) {
      const name = "text"
      const value = ""
      editPhrase({ _id, name, value })
    }
  }


  const onChange = ({ target }) => {
    const { name, value } = target
    const type = "redo"
    editPhrase({ _id, name, value, db })
  }


  const toggle = ({ target }) => {
    const { name, checked } = target

    toggleRedo({ _id, name, checked, db })
  }


  useEffect(resetText, []) // set text to "" when first displayed


  // Compare text to best
  const best = db.text
  const last = text.length - 1
  const chunks = text.split("").reduce(( data, char, index ) =>{
    const { chunks, chunk, match } = data
    const next = best[index]
    const state = char === next

    const addToChunks = (match) => {
      if (match) {
        chunks.push(data.chunk)
      } else {
        chunks.push(<b key={`no_${index}`}>{data.chunk}</b>)
      }
    }

    // Use an underscore for " " if no space is given;
    // use ⨉ if the character should not exist.
    const underscoreSpace = (next, state) => (
      (next === " " && !state)
        ? "_"
        : next || "⨉"
    )

    if (state === match) { // always false on first iteration
      data.chunk += underscoreSpace(next, state)

    } else {
      if (chunk) { // always falsy on first iteration
        addToChunks(match)
      }
      // Start a new chunk
      data.chunk = underscoreSpace(next, state)
    }

    // Add the last chunk
    if (index === last) {
      addToChunks(state)
    }

    data.match = state

    return data
  }, { chunks: [], chunk: "", match: 0, }).chunks


  // Check if text is complete or if it contains an error
  const feedbackClass = (locked)
    ? "feedback locked"
    : (right)
      ? "feedback right"
      : chunks.find( item => typeof item === "object" )
        ? "feedback wrong" // contains a span
        : "feedback"


  // Ensure that all items in feedback array have a unique key
  // to keep React happy
  const feedback = (locked)
    ? [ <span key={`yes`}>{best}</span> ]
    : (chunks.length === 1)
      ? chunks
      : chunks.map(( chunk, index ) => (
          typeof chunk === "object"
            ? chunk // already has a unique key
            : <span key={`yes_${index}`}>{chunk}</span>
        ))


  if (openAll || (!limit && !locked)) {
    // Show the remainder of the phrase, if there is more
    const complete = best.substring(last + 1)
    if (complete) {
      feedback.push(
        <u key="end">{complete}</u>
      )
    }
  }

  // Show a lock icon if locked, disable if openAll
  // Show number or 🛟 if not locked, allow CheckSlider to work
  // as usual even if openAll.
  const retainClass = (locked)
    ? (openAll)
      ? "front locked disabled"
      : "front locked"
    : (openAll)
      ? "front open"
      : "front"


  // Disable Limit CheckSlider if:
  // * openAll is true (so you have no choice for limit)
  // * OR if the phrase has been retained (locked), but the user
  //   wants to display it anyway (!retained)
  const limitClass = (openAll)
    ? "back disabled open" 
    : (!locked || retained)
      ? "back"
      : "back disabled"


  return (
    <div
      className="review"
    >
      <div className="control front">
        <CheckSlider
          name="retained"
          className={retainClass}
          checked={retainCheck}
          action={toggle}
        />
      </div>
      <div className="desk">
        <Feedback
          feedback={feedback}
          className={feedbackClass}
        />
        {!locked && <TextArea
            name="text"
            className="text"
            placeholder={db.text}
            text={text}
            onKeyDown={tabNextOnEnter}
            onChange={onChange}
            onFocus={scrollIntoView}
          />
        }
        <Hint hint={hint} />
      </div>
      <div
        className="control back"
      >
        { right
          ? <GreenCircle />
          : <CheckSlider
            name="limit"
            className={limitClass}
            checked={limitCheck}
            action={toggle}
          />
        }
      </div>
    </div>
  )
}