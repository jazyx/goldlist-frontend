/**
 * frontend/src/components/Review.jsx
 *
 * A Review can be displayed in multiple different states:
 *
 * - closedState can be "on", "mix" or "off"
 * - db.retained can be true or false
 * - retained can be true or false
 * - limit can be true or false
 * - the text of the phrase can be empty, correct or mistaken
 *   (this is ignored or irrelevant if any `retained` is true)
 *
 * If closedState === "mix":
 *   The display will depend on the state of the Retain and Limit
 *   sliders (4 states)
 *   + If !db.retained:
 *     + If !retained (A):
 *       - The Retain checkSlider should be slid to the right
 *       - The phrase number should show
 *       - The `text` textarea should be visible
 *       - The `text` border and background color depend on
 *         whether the text is empty, correct or wrong
 *       + If the phrase is correctly typed:
 *         - A green circle should show on the right
 *       + If not:
 *         - The Limit [👓🕶️] checkSlider should appear
 *         + If this is at [👓]
 *           - The remainder of the phrase to type should show
 *         + If it is at [🕶️]
 *           - The untyped part of the phrase should be hidden
 *         + If the phrase is incorrectly typed:
 *           - The border should red
 *           - Any incorrect letters should be underlaid with the
 *             correct value in red
 *     + If retained (the user is preparing to remember)
 *       - The Retain checkSlider should be slid to the left
 *       - The ✅ icon should show
 *         - The `text` textarea should not be visible
 *         - The [👓🕶️] checkSlider should appear
 *           + If this is at [👓]
 *             - The hint should show      (            )
 *           + If it is at [🕶️]
 *             - The hint should be hidden ( )————————( )
 *   + If db.retained (the user chose earlier to remember):
 *     + If retained (the default state):
 *       - The Retain checkSlider should be slid to the left
 *       - It should display a 🔒 icon
 *       - The [👓🕶️] checkSlider should appear
 *         (as with retained above)
 *         + If this is at [👓]
 *           - The hint should show      (            )
 *         + If it is at [🕶️]
 *           - The hint should be hidden ( )————————( )
 *     + If !retained (the user wants to peek at the phrase)
 *       - The `text` textarea should be visible
 *       - Input to the `text` textarea should be disabled
 *       - The border and background should appear grey
 *       - The Limit checkSlider should be disabled (no icon shown)
 * If closedState === "off":
 * The display should appear with as if the Limit checkSlider were
 * in the off state, and the Retain slider were in the off state
 * _only for phrases where db.retained is true_.
 *   - The Retain checkSlider should:
 *     - Be slid to the right
 *     - Display an open 🔓 icon
 *     - Be disabled
 *   - As with state (A) above for all phrases, except
 *     + If the phrase is !retained && empty or incorrectly typed
 *     - The Limit checkSlider should:
 *       - Be slid to the left
 *       - Display the [👓] icon
 *       - Be disabled
 * If closedState === "on":
 * The display should appear with as if the Limit checkSlider were
 * in the on state, for all phrases
 *   + If retained or db.retained
 *     - The Retain checkSlide will:
 *       - Be slid to the left
 *       - Show the ✅ or 🔒 icon, depending on !db.retained
 *   + If !retained && !db.retained
 *     - Everything should be as at (A) above
 *
 * In other terms:
 * + The Retain checkSlider will be
 *   - closedState = off
 *     => shows hint textarea
 *     + !db.retained
 *       => shows hint underlay while editing
 *       - Not disabled
 *       + !retained
 *         - To left
 *         - 1️⃣
 *       + retained
 *         - To right
 *         - ✅
 *     + db.retained
 *       - To right
 *       - 🔓
 *       - Disabled
 *
 *   - closedState = on
 *     + !db.retained
 *       => shows hint textarea
 *       => hides hint underlay
 *       - Retain checkSlider not disabled
 *       + !retained
 *         - To left
 *         - 1️⃣
 *       + retained
 *         - To right
 *         - ✅
 *     + db.retained
 *       => hides hint textarea
 *       - To left
 *       - 🔒
 *       - Disabled
 *
 *   - closedState = mix
 *     + !db.retained
 *       + !retained
 *         + !limit
 *         + limit
 *       + retained
 *         + !limit
 *         + limit
 *     + db.retained
 *       + !retained
 *         + !limit
 *         + limit
 *       + retained
 *         + !limit
 *         + limit
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
  db = {},   // may initially be undefined
  right,    // user correctly typed text
  retained, // user checked left Retain CheckSlider
  limit     // user checked right Limit CheckSlider:
            // = show full text prompt when not retained
            // = show hint after retained is checked
}) => {

  const {
    editPhrase,
    toggleRedo,
    tabNextOnEnter,
    scrollIntoView,
    closedState, // "on" (limit=>true), "mix", "off" (limit=>false)
    getPathAndIndex
  } = useContext(UserContext)

  let wrong = false // set to true if there is a typing error


  //////////////////////////// STATES ////////////////////////////

  const states = {
    // // Does the text block show?
    // showText:  (!db.retained || !retained) && closedState !== "on",
    // // Does the hint block show?
    // showHint:  !retained && closedState !== "on",
    // Is the textarea available for typing?
    showType:  !(retained || !!db.retained),
    // Does the whole word show while typing?
    showClue:  !limit && closedState !== "on",
    // Is the Retain checkSlider disabled?
    retainOff: closedState === "off" && db.retained,
    // Is the Retain checkSlider in the `checked` state?
    retainOn:  (closedState === "off")
               // Yes, only if the user has just decided to retain
               // No, if not retained, or previously retained
               ? (!db.retained && retained)
               : (closedState === "on")
                 // Yes, if was retained just now or in the past
                 ? db.retained || retained
                 // (closedState === "mix")
                 : retained,
    // // What icon does the Retain checkSlider show?
    // retainIcon: (db.retained)
    //             ? (closedState === "off" || !retained)
    //               ? "🔓"
    //               : "🔒"
    //             : (retained)
    //                ? "✅"
    //                : "1️⃣", // Use the counter value
    // Does the Retain checkSlider show a lock icon?
    retainLock: !!db.retained,
    // Is the locked Retain checkSlider forced open?
    retainOpen: closedState === "off",
    // Is the Limit checkSlider disabled?
    limitOff:  closedState !== "mix",
    // Is the Retain checkSlider in the `checked` state?
    limitOn:   (closedState === "off")
               ? false
               : (closedState === "on")
                 ? true
                 // closedState === "mix"
                 : limit,
    // // What icon does the Limit checkSlider show?
    // limitIcon: (closedState === "off")
    //            ? "👓"
    //            : (closedState === "on")
    //              ? "🕶️"
    //              // closedState === "mix"
    //              : (limit)
    //                ? "🕶️"
    //                : "👓"
    // Is the Limit checkSlider forced open?
    limitOpen: closedState === "off",
    // Is the Limit checkSlider forced shut?
    limitShut: closedState === "on",
  }


  ////////////////////////// RESET TEXT //////////////////////////

  // HACK: Ensure that text is not set to "" by useEffect if
  // Reviews tries to show a Phrases page
  const isRev = getPathAndIndex().path === "rev"


  const resetText = () => {
    if (isRev && !right && text === db.text && states.showType) {
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


  /////////////////////// TEXT FOR FEEDBACK ///////////////////////

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
  const feedback = (states.showLock)
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


  if (states.showClue) {
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
    + ((states.retainLock) ? " locked"   : "")


  const retainClass = "front"
    + ((states.retainLock) ? " locked"   : "")
    + ((states.retainOpen) ? " open"     : "")
    + ((states.retainOff)  ? " disabled" : "")

  // Disable Limit CheckSlider if:
  // * closedState !== "mix" (so you have no choice for limit)
  // * OR if the phrase has been retained (locked), but the user
  //   wants to display it anyway (!retained)
  // const limitedClass = (closedState !== "mix")
  //   ? "back disabled open" 
  //   : (!locked || retained)
  //     ? "back"
  //     : "back disabled"

  const limitClass = "back"
    + ((states.limitOpen) ? " open" : "")
    + ((states.limitShut) ? " shut" : "")
    + ((states.limitOff)  ? " disabled" : "")


  /////////////////////////// USEEFFECT ///////////////////////////

  useEffect(resetText, []) // set text to "" when first displayed



  return (
    <div
      className="review"
    >
      <div className="control front">
        <CheckSlider
          name="retained"
          className={retainClass}
          checked={states.retainOn}
          action={toggle}
        />
      </div>
      <div className="desk">
        <Feedback
          feedback={feedback}
          className={feedbackClass}
        />
        {states.showType && <TextArea
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
            checked={states.limitOn}
            action={toggle}
          />
        }
      </div>
    </div>
  )
}