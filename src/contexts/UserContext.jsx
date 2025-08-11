/**
 * frontend/src/contexts/UserContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react'
import { useNavigate } from 'react-router-dom'
import { APIContext } from "./APIContext"
import storage from "../tools/storage"
import {
  byIndex,
  debounce,
  getLocalTime,
  set__scroll
} from '../tools/utilities'

const DAY_BREAK = { hour: 3 }
const LIST_LENGTH = 21
// Initialize storage if it is empty
const INITIALIZED = (Object.entries(storage.settings).length)

if (!INITIALIZED) {
  storage.set({ user_name: "Guest" })
}

set__scroll()


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { origin } = useContext(APIContext)

  // Read initial value of userData from LocalStorage
  const [ user, setUser ] = useState(() => storage.get())
  const [ failed, setFailed ] = useState("")
  const [ loaded, setLoaded ] = useState(false)
  const [ lists, setLists ] = useState([])
  const [ redos, setRedos ] = useState([])
  const [ reviewState, setReviewState ] = useState("untreated")
  const [ redosDone, setRedosDone ] = useState(0)
  const [ dayList, setDayList ] = useState(0)
  const [ dayDone, setDayDone ] = useState(0)


  /////////////// REGISTRATION, LOG IN and GUESTS ///////////////


  const connectUser = (connect = {}) => {
    const { action } = connect
    // user_name, email, password, action

    const url = (action === "register")
      ? `${origin}/register`
      : (action === "login")
        ? `${origin}/login`
        : `${origin}/guest`

    const headers = { 'Content-Type': 'application/json' }
    const credentials = "include"
    const body = JSON.stringify(connect)

    fetch(url, {
      method: 'POST',
      headers,
      credentials,
      body
    })
      .then(incoming => {
        return incoming.text()
      })
      .then(text => {
         try {
           const json = JSON.parse(text)
           return json
         } catch (error) {
           console.log("error:", error)
           console.log("text:", text)
         }
       })
      // .then(incoming => incoming.json())
      .then(json => treatUserData(json))
      .catch(error => {
        treatDataError(error)
      })
  }


  //////////////////////// INITIALIZATION ////////////////////////


  const treatUserData = data => {
    const { user, lists, redos, fail } = data

    // If the server sends a fail message, it should be logged to
    // the console, and nothing else should happen.
    if (fail) {
      console.log("fail", JSON.stringify(fail, null, '  '));
      return setFailed(fail.reason)
    }

    lists.sort(byIndex)
    redos.sort(byIndex)

    lists.forEach(preparePhrases)
    redos.forEach(preparePhrases)

    // const replacer =(key, value) => {
    //   if (key === "phrases") {
    //     return `${value.length} phrases`
    //   }
    //   return value
    // }
    // console.log("data", JSON.stringify(data, replacer, '  '));
    // console.log("*************************")

    // Update the user_name in LocalStorage, after removing uuid
    const { user_name } = user
    storage.placeItems({ user_name  })

    setUser(user)
    setLists(lists)
    setRedos(redos)
  }


  const preparePhrases = list => {
    // Add a db field to hold the values on the database
    const phrases = list.phrases.map( phrase => {
      const { text, hint, retained, limit } = phrase
      const db = { text, hint, retained, limit }
      return { ...phrase, db, retained, limit }
    })

    // Ensure there are the right number of entries.
    // The _id will be a simple integer from 0 to 20, indicating
    // that the phrase has never been saved.
    // retained and limit have no meaning for a new phrase.
    if (list.index < 0) {
      // Knotty phrases may be in lists shorter than 21 phrases
    } else {
      while (phrases.length < LIST_LENGTH) {
        phrases.push({
          _id: phrases.length,
          key: phrases.length,
          text: "",
          hint: "",
          db: { text: "", hint: "" }
        })
      }
    }

    list.phrases = phrases
  }


  ///////////////////////// SELECT items /////////////////////////


  const getPathAndIndex = () => {
    const match = /\/(\w+)(\/(\d+))?/.exec(location.pathname)
    if (!match) {
      return {}
    }
    const [ , path, , index=(lists[0]?.index || 0) ] = match

    return { path, index }
  }

  const getActive = (forceNull) => {
    const { path, index } = getPathAndIndex()

    const source = (path === "rev")
      ? redos
      : lists

    const list = source.find( list => list.index == index )
    return list || ( forceNull ? null : {} )
  }


  const getPhrases = () => {
    const source = getActive(true)

    const fallback = (() => {
      if (source) { return }

      const { path, index } = getPathAndIndex()
      const type = path === "rev" ? redos : lists
      return [{
        text: `No phrases available for ${path}`,
        hint: `index: ${index}
        (available: ${type.map( list => list.index )})`,
        db: { text: "", hint: "" },
        _id: "random_id"
      }]
    })()

    return source?.phrases || fallback
  }


  const getPhrase = (_id) => {
    const list = getActive()
    const phrase = list.phrases?.find(
      phrase => phrase._id === _id
    )

    return phrase
  }


  ///////////////////////// EDIT AND SAVE /////////////////////////


  const editPhrase = ({ name, _id, value, db }) => {
    const phrase = getPhrase(_id)
    phrase[name] = value

    const right =  (db && value === db.text.replaceAll('́', ""))
    phrase.right = right

    setLists([...lists])
  }


  /**
   * Phrases are saved to the database when the Phrase component
   * is blurred or when the SaveChanges button is pressed. However,
   * the user can delete the text of a phrase after it has been
   * saved, which would lead to a blank.
   */
  const updatePhrase = _id => {
    const list = getActive()
    const phrase = list.phrases.find(
      phrase => phrase._id === _id
    )
    phrase.saving = true
    setLists([...lists])

    savePhrase({ ...phrase, list_id: list._id })
  }


  const savePhrase = phrase => {
    const url = `${origin}/savePhrase`
    const headers = { 'Content-Type': 'application/json' }

    const replacer = (key, value) => {
      if ( key === "saving" || key === "db" ) {
        // Not wanted on voyage
        return undefined
      }
      if (key === "text") {
        // Remove leading and trailing spaces
        return value.trim()
      }

      return value
    }

    const body = JSON.stringify(phrase, replacer)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatSavedPhrase(json))
      .catch(treatDataError)
  }


  const treatSavedPhrase = json => {
    const { _id, key, text, hint, list_id } = json
    const list = lists.find( list => list._id === list_id)

    const phrase =
       list.phrases.find(phrase => phrase._id === _id)
    || list.phrases.find(phrase => phrase._id === key)

    phrase._id = _id
    phrase.db = { text, hint }
    phrase.text = text
    phrase.hint = hint
    delete phrase.saving

    setLists([...lists])
  }


  const toggleLimitState = (limitState) => {
    submitPreferences({ limitState })
    // Update locally pre-emptively
    setUser({ ...user, limitState })
  }


  /////////////////////////// NEW LIST ///////////////////////////


  const addList = () => {
    const url = `${origin}/addList`
    const headers = { 'Content-Type': 'application/json' }
    const data = {
      _id: user._id,
      index: user.lists + 1
    }
    const body = JSON.stringify(data)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatNewList(json))
      .catch(treatDataError)
  }


  const treatNewList = list => {
    // Fill empty list.phrases with LIST_LENGTH empty phrase
    // objects
    console.log("treatNewList:", list)
    preparePhrases(list)

    // Place the new list at the beginning of the editable lists
    setUser({ ...user, lists: list.index }) // match DB value
    setLists([ list, ...lists ])
    setDayList(+ getLocalTime(DAY_BREAK)) // milliseconds

    // console.log("dayList:", + getLocalTime(DAY_BREAK))

    navigate("/add")
  }


  const submitList = (_id) => {
    const url = `${origin}/submitList`
    const headers = { 'Content-Type': 'application/json' }
    const data = { _id }
    const body = JSON.stringify(data)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      // .then(incoming => incoming.text())
      // .then(text => {
      //    try {
      //      const json = JSON.parse(text)
      //      return json
      //    } catch (error) {
      //      console.log("error:", error)
      //      console.log("text:", text)
      //    }
      //  })
      .then(incoming => incoming.json())
      .then(json => treatListSubmit(json))
      .catch(treatDataError)
  }


  const treatListSubmit = (json) => {
    const { _id, submitted } = json

    if (!submitted) {
      return console.log("submitList didn't return submitted")
    }

    const index = lists.findIndex( list => list._id === _id )
    lists.splice(index, 1)

    setLists([ ...lists ])

    // Navigate to the first redo or the Add page
    const [ path, param ] = (redos[0]?.index)
      ? [ "/rev/", redos[0].index ]
      : (lists[0]?.index)
        ? [ "/add/", lists[0].index ]
        : ["/", ""]

    navigate(`${path}${param}`)

  }


  //////////////////////////// REVIEW ////////////////////////////


  const toggleRedo = ({ _id, name, checked, db }) => {
    const phrase = getPhrase(_id)
    phrase[name] = checked

    setLists([...lists])
  }


  /**
   * ReviewsFooter has checked that all phrases have been tagged
   * to be retain or have been correctly typed, and the user has
   * clicked on the enabled Submit Review button
   */
  const confirmReview = () => {
    setReviewState("ready")
  }


  const cancelReview = (reason) => {
    // event object  if sent by ConfirmReview
    // "untreated"   if sent by ReviewsFooter
    if (typeof reason !== "string") {
      reason = "cancelled"
    }
    setReviewState(reason)
  }


  const submitReview = () => {
    const { _id } = getActive()
    const phrases = getPhrases()

    // Find all phrases which are flagged to be retained...
    const reviewed = phrases.filter( phrase => (
      phrase.retained && !phrase.db.retained
    ))
    // ...and add any whose `limited` value has changed
    const limited = phrases.filter( phrase => (
      phrase.limit !== phrase.db.limit
    ))

    limited.forEach( phrase => {
      if (reviewed.indexOf(phrase) === -1) {
        reviewed.push(phrase)
      }
    })

    requestReview({ list_id: _id, reviewed })
  }


  const requestReview = (data) => {
    const url = `${origin}/submitReview`
    const headers = { 'Content-Type': 'application/json' }

    // Exclude text, hint and db entries from body, as the server
    // will not change these
    const replacer = (key, value) => {
      if (key === "db" || key === "text" || key === "hint") {
        return
      }
      return value
    }

    const body = JSON.stringify(data, replacer)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatReview(json))
      .catch(treatDataError)
  }


  const treatReview = json => {
    // json will be details of the list whose review was submitted
    const { _id } = json
    const listIndex = redos.findIndex( list => list._id === _id )
    if (listIndex < 0) {
      return console.log("Unable to find list with id:", list_id)
    }

    redos.splice(listIndex, 1)

    setRedos([ ...redos ])
    setRedosDone(redosDone + 1)

    // Check if there are older lists to review. If so navigate
    // to the next list. If not, go to `/add/X` which should always
    // be available
    const next = redos[listIndex] // moved up a place?
    const to = (next)
      ? `/rev/${next.index}`
      : `/add/${lists[0].index}`

    navigate(to)
  }


  const treatDataError = error => {
    console.log(error.message)
  }


  ////////////////////////// PREFERENCES //////////////////////////


  const submitPreferences = (preferences) => {
    const { _id } = user
    const url = `${origin}/setPreferences`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ _id, preferences })

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatPreferences(json))
      .catch(treatDataError)
  }


  const treatPreferences = json => {
    // json will be { key: value } for preferences that were set
    delete json._id // No need to reset _id to itself

    // values in json should already have been set
    setUser({ ...user, ...json })
  }

  ///////// UTILITIES FOR TABBING BETWEEN phrases/reviews /////////


  function tabNextOnEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      tabToNextOpenItem(event.target)
    }
  }


  /**
   *
   * @param {textarea} element is an element that received an Enter
   *                   keyDown event
   * Fails if the next review is locked
   * Focuses on collapsed textarea if next review is to be retained

   */
  function tabToNextOpenItem(element) {
    // Check if element is a `text` item followed by an editable
    // `hint` item
    let next = element.nextElementSibling
    let target = (next?.tagName === "TEXTAREA" ? next : null)

    if (!target) {
      // Check with each younger sibling of element's parent if
      // there is a visible textarea
      let parent = element.closest(".phrase, .review")
      while (parent && !target) {
        parent = parent.nextElementSibling
        target = parent?.querySelector("textarea")
      }
    }
    if (!target) {
      // No more parents to check. Recycle from first entry.
      target = element.closest("#phrases, #reviews")
                      .querySelector("textarea")
    }

    if (target) {
      scrollIntoView({ target })
      target.focus()
    }
  }


  const scrollIntoView = ({ target }) => {
    // Find div#phrases or div#reviews
    const parent = target.closest("[id]")

    if (!parent) {return}

    // The div.desk element contains both text and hint
    const desk = target.closest(".desk")

    const { x: up, bottom: down } = parent.getBoundingClientRect();
    const { top, bottom } = desk.getBoundingClientRect();

    if (top < up) {
      desk.scrollIntoView(true);
    } else if (bottom > down) {
      desk.scrollIntoView(false);
    }
  }


  /////////////////////////// USEFFECTS ///////////////////////////


  const autoLoad = () => {
    if (INITIALIZED) {
      // guest()
    }
  }

  // TODO: Stay on current rev page if that's where we are
  const goAdd = () => {
    if (loaded) {
      return
    } else if (lists[0]?.phrases) {
      setLoaded(true  )
      navigate("/add")
    } else {
      navigate("/")
    }
  }


  const checkIfDone = () => {
    const dayBreak = + getLocalTime(DAY_BREAK) // milliseconds
    if (dayList === dayBreak && (!redos.length)) {
      // A new list has been created today since 3 a.m., and there
      // are no more redos to review
      setDayDone(true)
    }
  }


  useEffect(autoLoad, [])
  useEffect(goAdd, [lists])
  useEffect(checkIfDone, [ dayList, redos.length ])


  return (
    <UserContext.Provider
      value ={{
        user,
        lists,
        redos,
        failed,
        dayDone,
        redosDone,
        reviewState,
        connectUser,
        getPhrases,
        getActive,
        editPhrase,
        updatePhrase,
        addList,
        submitList,
        toggleRedo,
        confirmReview,
        cancelReview,
        submitReview,
        tabNextOnEnter,
        scrollIntoView,
        toggleLimitState,
        setDayDone,
        getPathAndIndex
      }}
    >
      {children}
    </UserContext.Provider>
  )
}