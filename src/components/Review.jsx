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


import {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useTranslation } from "react-i18next"
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


  const { t } = useTranslation();

  const {
    user,
    editPhrase,
    toggleRedo,
    focus,
    setFocus,
    running,
    tabNextOnEnter,
    scrollIntoView,
    getPathAndIndex
  } = useContext(UserContext)

  const [ sneakPreview, setSneakPreview ] = useState(false)

  const reviewRef = useRef()
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
  const limitOff = limitState !== "mix"
  // Is the Retain checkSlider in the `checked` state?
  const limitOn = (limitState === "off")
                  ? false
                  : (limitState === "on")
                    ? true
                    // limitState === "mix"
                    : limit
  // Is the Limit checkSlider forced open?
  const limitOpen = limitState === "off"
  // Is the Limit checkSlider forced shut?
  const limitShut = limitState === "on"
  const autoCapitalize = db.text[0] === db.text[0]?.toLowerCase()
                         ? "off"
                         : null


  //////////////////////// INITIALIZATION ////////////////////////

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


  const addRunListener = () => {
    const review = reviewRef.current
    review.addEventListener("transitionrun", onTransitionRun)
    return onTransitionRun
  }


  const removeRunListener = (review) => {
    // const review = reviewRef.current
    review.removeEventListener("transitionrun", onTransitionRun)
  }


  const manageTransitions = () => {
    addRunListener()

    // Ensure that the current review div is in scope when the
    // component is cleaned up. onTransitionRun will be the same.
    const review = reviewRef.current
    return () => removeRunListener(review)
  }


  //////////////////////////// ACTIONS ////////////////////////////

  const onFocusChange = (event) => {
    const { type, target } = event

    if (type === "focus") {
      const { top } = target.getBoundingClientRect()
      setFocus({ _id, top })
      scrollIntoView(event)

    } else {
      const focusStealer = event.nativeEvent.explicitOriginalTarget
      if (focusStealer.closest(".three-way.limit")) {
        // If focus was stolen by the limit ThreeWaySlider then
        // limitState is being changed. Restore the current focus
        // now and be ready to restore it again if there are any
        // layout changes. Setting the focus triggers
        // onFocusChange() again, and resets the value of top.
        return target.focus()
      }

      setFocus({})
    }
  }


  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
      return tabNextOnEnter(event)
    }
    else if (event.key === "Backspace" && !showClue) {
      // Show preview for a moment, even when limitState = "on"
      console.log("Backspace!")
      setSneakPreview(true)
    } else {
      setSneakPreview(false)
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


  /**
   * Capture all the transitions which will affect the height of
   * the Review DIV component itself (ignore changes to properties
   * like padding, or to the child elements of the Review DIV)
   */
  const onTransitionRun = ({ propertyName, target }) => {
    // Ignore all transitions except a change of height on the
    // named .review div. Remember that this Review component is
    // having its height changed.
    if ( !focus._id || propertyName !== "height") { return }
    const name = target.dataset.name
    if ( !name ) { return }

    // If we get here, then one of the textareas has focus and
    // limitState has just been changed locally. If any
    // transitions will change the height of a Review component,
    // then the position of the Review with the focus should be
    // restored as well as possible.

    running.add(name)
  }


  const onTransitionEnd = ({ propertyName, target }) => {
    const { name } = target.dataset
    if (name && propertyName === "height") {
      if (running.has(name)) {
        // name was added by onTransitionRun just after limitState
        // was changed
        running.delete(name)

        if (!running.size) {
          // The last height transition on a Review component has
          // ended. Time to restore the position of the Review with
          // focus.
          restorePosition()
        }
      }
    }
  }


  const restorePosition = () => {
    const { _id, top } = focus
    const selector = `._${_id}`
    const focusReview = document.querySelector(selector)
    const { y } = focusReview.getBoundingClientRect()
    const parent = focusReview.closest(".reviews")

    const delta = y - top
    parent.scrollTo({
      top: parent.scrollTop + delta,
      left: 0,
      behavior: "smooth",
    })
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
  const feedback = (retainLock || retained)
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


  if (showClue && !retained || sneakPreview) {
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
    + ((right)              ? " right "   : "")
    + ((wrong && !retained) ? " wrong"    : "")
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
      ? t("hint.hide-preview")
      : t("hint.show-preview")
    : (showClue)
      ? t("hint.hide")
      : t("hint.show")


  /////////////////////////// USEEFFECT ///////////////////////////

  useEffect(resetText, []) // set text to "" when first displayed
  useEffect(manageTransitions) // create and destroy, every render



  return (
    <div
      ref={reviewRef}
      className={`review _${_id}`}
      data-name={_id}
      onTransitionEnd={onTransitionEnd}
    >
      <div
        className="control front"
      >
        <CheckSlider
          name="retained"
          className={retainClass}
          checked={retainOn}
          action={toggle}
          title={t("commit")}
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
            onFocus={onFocusChange}
            onBlur={onFocusChange}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onScroll={onScroll}
            autoCapitalize={autoCapitalize}
          />
        }
        <Hint hint={(showClue || sneakPreview) && hint} />
      </div>
      <div
        className="control back"
      >
        { right
          ? <GreenCircle disabled={limitShut}/>
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