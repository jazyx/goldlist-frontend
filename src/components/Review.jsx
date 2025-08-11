/**
 * frontend/src/components/Review.jsx
 *
 * A Review can be displayed in multiple different states:
 *
 * - user.limitState can be "on", "mix" or "off"
 * - db.retained can be true or false
 * - retained can be true or false
 * - limit can be true or false
 * - the text of the phrase can be empty, correct or mistaken
 *   (this is ignored or irrelevant if any `retained` is true)
 */


import { useContext, useEffect, useRef } from 'react'
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
  db = {},  // may initially be undefined
  right,    // user correctly typed text
  retained, // user checked left Retain CheckSlider
  limit     // user checked right Limit CheckSlider:
            // = show full text prompt when not retained
            // = show hint after retained is checked
}) => {

  const {
    user,
    editPhrase,
    toggleRedo,
    tabNextOnEnter,
    scrollIntoView,
    getPathAndIndex
  } = useContext(UserContext)

  const feedbackRef = useRef()
  const { limitState } = user
  // "on" (limit=>true), "mix", "off" (limit=>false)
  let wrong = false // set to true if there is a typing error



  //////////////////////////// STATES ////////////////////////////

  // Is the textarea available for typing?
  const showType =  !(retained || !!db.retained)
  // Does the whole word show while typing?
  const showClue =  limitState === "off"
                || (limitState === "mix" && !limit)
  // Is the Retain checkSlider disabled?
  const retainOff = limitState === "off" && db.retained
  // Is the Retain checkSlider in the `checked` state?
  const retainOn =  (limitState === "off")
              // Yes, only if the user has just decided to retain
              // No, if not retained, or previously retained
              ? (!db.retained && retained)
              : (limitState === "on")
                // Yes, if was retained just now or in the past
                ? db.retained || retained
                // (limitState === "mix")
                : retained
  // Does the Retain checkSlider show a lock icon?
  const retainLock = !!db.retained
  // Is the locked Retain checkSlider forced open?
  const retainOpen = limitState === "off"
  // Is the Limit checkSlider disabled?
  const limitOff =  limitState !== "mix"
  // Is the Retain checkSlider in the `checked` state?
  const limitOn =   (limitState === "off")
              ? false
              : (limitState === "on")
                ? true
                // limitState === "mix"
                : limit
  // Is the Limit checkSlider forced open?
  const limitOpen = limitState === "off"
  // Is the Limit checkSlider forced shut?
  const limitShut = limitState === "on"



  ////////////////////////// RESET TEXT //////////////////////////

  // HACK: Ensure that text is not set to "" by useEffect if
  // Reviews tries to show a Phrases page
  const isRev = getPathAndIndex().path === "rev"


  const resetText = () => {
    if (isRev && !right && text === db.text && showType) {
      const name = "text"
      const value = ""
      editPhrase({ _id, name, value })
    }
  }


  //////////////////////////// ACTIONS ////////////////////////////

  const onChange = ({ target }) => {
    const { name, value } = target
    const type = "redo"
    editPhrase({ _id, name, value, db })
  }


  const toggle = ({ target }) => {
    const { name, checked } = target

    toggleRedo({ _id, name, checked, db })
  }


  /**
   * Force the feedback paragraph to scroll with the textarea.
   *
   * If users scroll with a wheel, then they can pull the text
   * beyond the textarea limits. Preventing this means intercepting
   * wheel events with onWheel and calling preventDefault() on
   * them. However React uses { passive: true } for such events by
   * default, so fixing this means using useRef() to get the
   * textarea element, and adding a "wheel" event listener
   * directly to that, bypassing React.
   *
   * Task left for later.
   */
  function onScroll(event) {
    const { target } = event
    const { scrollTop } = target

    feedbackRef.current.scrollTop = scrollTop
  }


  /////////////////////// TEXT FOR FEEDBACK ///////////////////////

  // Compare text to best (ignoring Russian stress marks)
  const best = showType ? db.text.replaceAll('́', "") : db.text
  const last = text.length - 1
  const chunks = text.split("").reduce(( data, char, index ) =>{
    const { chunks, chunk, match } = data
    const next = best[index]
    const state = char === next

    const addToChunks = (match) => {
      if (match) {
        chunks.push(data.chunk)
      } else {
        wrong = true
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



  // Ensure that all items in feedback array have a unique key
  // to keep React happy
  const feedback = (retainLock)
    // Show the entire text if this phrase is retained
    ? [ <span key={`yes`}>{best}</span> ]
    // Prepare corrected text
    : (chunks.length === 1)
      ? chunks // no key needed for just one element
      : chunks.map(( chunk, index ) => (
          typeof chunk === "object"
            ? chunk // already has a unique key
            : <span key={`yes_${index}`}>{chunk}</span>
        ))


  if (showClue) {
    // Show the remainder of the phrase, if there is more
    const complete = best.substring(last + 1)
    if (complete) {
      feedback.push(
        <u key="end">{complete}</u>
      )
    }
  }


  ////////////////////////// CSS CLASSES //////////////////////////

  const feedbackClass = "feedback"
    + ((right)             ? " right "   : "")
    + ((wrong)             ? " wrong"    : "")
    + ((retainLock) ? " locked"   : "")


  const retainClass = "front"
    + ((retainLock) ? " locked"   : "")
    + ((retainOpen) ? " open"     : "")
    + ((retainOff)  ? " disabled" : "")

  // Disable Limit CheckSlider if:
  // * limitState !== "mix" (so you have no choice for limit)
  // * OR if the phrase has been retained (locked), but the user
  //   wants to display it anyway (!retained)
  // const limitedClass = (limitState !== "mix")
  //   ? "back disabled open"
  //   : (!locked || retained)
  //     ? "back"
  //     : "back disabled"

  const limitClass = "back"
    + ((limitOpen) ? " open" : "")
    + ((limitShut) ? " shut" : "")
    + ((limitOff)  ? " disabled" : "")


  const hideHintTitle = (showType)
    ? (showClue)
      ? "Preview shown while typing"
      : "Preview hidden while typing"
    : (showClue)
      ? "Hint shown"
      : "Hint hidden"


  /////////////////////////// USEEFFECT ///////////////////////////

  useEffect(resetText, []) // set text to "" when first displayed



  return (
    <div
      className="review"
      name={_id}
    >
      <div
        className="control front"
      >
        <CheckSlider
          name="retained"
          className={retainClass}
          checked={retainOn}
          action={toggle}
          title="Commit to remembering this expression"
        />
      </div>
      <div className="desk">
        <Feedback
          feedback={feedback}
          className={feedbackClass}
          ref={feedbackRef}
        />
        {showType && <TextArea
            name="text"
            className="text"
            placeholder={db.text}
            text={text}
            onKeyDown={tabNextOnEnter}
            onChange={onChange}
            onScroll={onScroll}
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
            checked={limitOn}
            action={toggle}
            title={hideHintTitle}
          />
        }
      </div>
    </div>
  )
}