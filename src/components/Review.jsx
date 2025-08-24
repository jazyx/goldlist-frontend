/**
 * frontend/src/components/Review.jsx
 *
 * A Review can be displayed in multiple different states:
 *
 * - user.limitState can be "on", "mix" or "off"
 * - db.retained can be truthy or undefined
 * - retained can be true or false
 * - db.grasped can be truthy or undefined
 * - grasped can be true or false
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
  grasped,
  retained, // user checked left Retain CheckSlider
  limit     // user checked right Limit CheckSlider:
            // = show full text prompt when not retained
            // = show hint after retained is checked
}) => {

  // Convert dbRetained and dbGrasped to boolean
  const dbGrasped  = !!db.grasped
  const dbRetained = !!db.retained

  const { t } = useTranslation();

  const {
    editPhrase,
    toggleRedo,
    focus,
    setFocus,
    running,
    tabNextOnEnter,
    scrollIntoView,
    getPathAndIndex,
    limitState,
    switchLimit,
    toggleLimitState
  } = useContext(UserContext)

  const [ sneakPreview, setSneakPreview ] = useState(false)

  const reviewRef = useRef()
  const feedbackRef = useRef()

  let wrong = false // set to true if there is a typing error



  //////////////////////////// STATES ////////////////////////////

  // Has this phrase just been flagged to be grasped?
  const isGrasped   = grasped   && !dbGrasped
  // Was this phrase grasped in a previous review?
  const wasGrasped  = dbGrasped && !dbRetained
  // Has this phrase just been flagged to be retained?
  const isRetained  = retained  && !dbRetained
  // Was this phrase retained in a previous review (so now locked)?
  const wasRetained = !!dbRetained
  // Has the user "unlocked" a retained phrase?
  const restrained  = retained  && !!dbRetained
  // Is the Limit checkSlider in the `unchecked` state?
  const unlimited   = limitState === "off"
                  || (limitState === "mix" && !limit)

  // Is the textarea available for typing?
  const showType = !dbRetained
                && !(isGrasped || retained)
  // Does the preview show while typing?
  const showClue = unlimited && !wasRetained
  // Does the placeholder show before typing starts?
  const showPlaceholder = unlimited || !grasped
  // Does the hint show?
  const showHint = unlimited // but...
                || right     // after the phrase is correctly typed
                || !!grasped // not for phrases which are grasped

  // Is the Retain checkSlider in the `checked` state?
  const retainOn = (wasRetained)
                   ? restrained
                   : (isGrasped || isRetained)
  // Is the Limit checkSlider disabled? True only if the phrase
  // has been retained, but is now shown unrestrained, because
  // the Retain slider is unchecked (by switchLimit)
  const limitOff = limitState !== "on"
                && wasRetained
                && !restrained

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


  const forceLimitState = () => {
    if (switchLimit) {
      toggleLimitState(_id, limitState)
    }
  }


  //////////////////////////// ACTIONS ////////////////////////////

  const onFocusChange = (event) => {
    const { type, target } = event

    if (type === "focus") {
      const { top } = target.getBoundingClientRect()
      setFocus({ _id, top })
      scrollIntoView(event)

    } else {
      const focusThief = event.nativeEvent.explicitOriginalTarget
      if (focusThief && focusThief.closest(".three-way.limit")) {
        // If focus was stolen by the limit ThreeWaySlider then
        // limitState is being changed. Restore the current focus
        // now and be ready to restore it again if there are any
        // layout changes. Setting the focus triggers
        // onFocusChange() again, and resets the value of top.
        return target.focus()
      }

      setFocus({})
      setSneakPreview(false)
    }
  }


  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
      return tabNextOnEnter(event)
    }
    else if (event.key === "Backspace" && !showClue) {
      // Show preview for a moment, even when limitState = "on"
      setSneakPreview(true)
    } else {
      setSneakPreview(false)
    }
  }


  const onChange = ({ target }) => {
    const { name, value } = target
    editPhrase({ _id, name, value, db })
  }


  const toggle = ({ target }) => {
    let { name, checked } = target
    // name may be "status" or "limit"

    // Distinguish between retaining a grasped phrase and
    // grasping a new phrase
    if (name === "status") {
      if (!(wasGrasped || dbRetained)) {
        name = "grasped"
      } else {
        name = "retained"
      }
    }

    toggleRedo({ _id, name, checked })
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
  const feedback = (dbRetained || retained)
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
    + ((right)              ? " right " : "")
    + ((wrong && !retained) ? " wrong"  : "")
    + ((dbRetained)         ? " locked" : "")


  const stateClass = "front"
    + ((wasGrasped) ? " grasped"  : "")
    + ((isRetained) ? " retained" : "")
    + ((dbRetained) ? " locked"   : "")

  // Disable Limit CheckSlider if:
  // * limitState === "mix" (so you have a choice for limit)
  //   BUT the phrase was retained and is currently unrestrained
  //   in which case a choice is meaningless.
  const limitClass = "back"
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
  useEffect(forceLimitState, [switchLimit])



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
          name="status"
          className={stateClass}
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
        { showType && <TextArea
            name="text"
            className="text"
            placeholder={showPlaceholder ? db.text : ""}
            text={text}
            onFocus={onFocusChange}
            onBlur={onFocusChange}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onScroll={onScroll}
            autoCapitalize={autoCapitalize}
          />
        }
        <Hint hint={(showHint || sneakPreview) && hint} />
      </div>
      <div
        className="control back"
      >
        { right && !retainOn
          ? <GreenCircle />
          : <CheckSlider
            name="limit"
            className={limitClass}
            checked={!unlimited}
            action={toggle}
            title={hideHintTitle}
          />
        }
      </div>
    </div>
  )
}