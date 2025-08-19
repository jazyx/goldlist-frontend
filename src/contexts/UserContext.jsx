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
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { APIContext } from "./APIContext"
import storage from "../tools/storage"
import {
  byIndex,
  debounce,
  getLocalTime,
  set__scroll
} from '../tools/utilities'

const DAY_BREAK = { hour: 3 }
// Initialize storage if it is empty
const INITIALIZED = (Object.entries(storage.settings).length)
// HARD-CODED routes and params from App.jsx
const PATHS_REGEX = /^\/(add|rev|about|i18n|profile)(\/?([0-9-]+)?)$/

set__scroll()


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (!INITIALIZED) {
    const user_name = t("sign.guest.user_name")
    storage.set({ user_name })
  }

  const { origin } = useContext(APIContext)

  // Read initial value of userData from LocalStorage
  const [ user, setUser ] = useState(() => storage.get())
  const [ initialized, setInitialized ] = useState(INITIALIZED)
  const [ loginData, setLoginData ] = useState({})

  const [ failed, setFailed ] = useState("")
  const [ loaded, setLoaded ] = useState(false)
  const [ lists, setLists ] = useState([])
  const [ redos, setRedos ] = useState([])
  const [ reviewState, setReviewState ] = useState("untreated")
  const [ redosDone, setRedosDone ] = useState(0)
  const [ dayList, setDayList ] = useState(0)
  const [ daysLists, setDaysLists ] = useState(0)
  const [ dayDone, setDayDone ] = useState(0)
  const [ from, setFrom ] = useState("/add")
  const [ preferences, setPreferences ] = useState({
    daysDelay: 14,
    phraseCount: 21
  })


  /////////////// REGISTRATION, LOG IN and GUESTS ///////////////


  const connectUser = (connect) => {
    const { action } = (connect || {})
    setLoginData(connect)
    if (connect) {
      storage.set(connect)
    }
    // user_name, email, password, action

    const url = (action === "register")
      ? `${origin}/register`
      : (action === "login")
        ? `${origin}/login`
        : `${origin}/guest`

    const headers = { 'Content-Type': 'application/json' }
    const credentials = "include"
    const body = JSON.stringify(connect || {})

    fetch(url, {
      method: 'POST',
      headers,
      credentials,
      body
    })
      .then(incoming => incoming.json())
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
      return setFailed(fail.reason)
    } else {
      setFailed("")
    }

    console.log(storage.get())

    // Should already be sorted by Mongoose
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
    if (user_name) {
      storage.placeItems({ user_name  })
    } else {
      // May be undefined if user logged in as Guest. Allow
      // current host to log in again easily later.
      user.host_name = storage.getItem("user_name")
    }

    const { limitState, daysDelay, phraseCount } = user
    const preferences = { limitState, daysDelay, phraseCount }

    setUser(user)
    setLists(lists)
    setRedos(redos)
    setPreferences(preferences)
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
      const { total } = list
      while (phrases.length < total) {
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
    const match = /\/(\w+)(\/(-?\d+))?/.exec(location.pathname)
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
      if (key === "text" || key === "hint") {
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
    // Pre-emptively update locally
    preferences.limitState = limitState
    setPreferences({ ...preferences })
    // Update the database
    submitPreferences()
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
    // Fill empty list.phrases with `list.total` empty phrase
    // objects
    preparePhrases(list)

    // Place the new list at the beginning of the editable lists
    setUser({ ...user, lists: list.index }) // match DB value
    setLists([ list, ...lists ])

    const dayBreak = + getLocalTime(DAY_BREAK)
    if (dayList !== dayBreak) {
      setDaysLists(1)
      setDayList(dayBreak) // milliseconds
    } else {
      setDaysLists( daysLists + 1 )
    }

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
    // json contain just the _id of the list whose review was
    // submitted. Lists may simultaneously be being combined on
    // the server, but the frontend is not told about this.
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


  const submitPreferences = () => {
    const { _id } = user
    const url = `${origin}/setPreferences`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify({ _id, preferences }, trimSame)

    function trimSame(key, value) {
      if (key !== "_id" && user[key] === value) {
        return
      }

      return value
    }

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      // .then(incoming => incoming.text())
      // .then(text => {
      //   console.log("incoming:", text)
      //   try {
      //     const json = JSON.parse(text)
      //     return json
      //   } catch (error) {
      //     console.log("error", JSON.stringify(error, null, '  '));

      //   }
      // })
      .then(incoming => incoming.json())
      .then(json => treatPreferences(json))
      .catch(treatDataError)
  }


  const treatPreferences = json => {
    // json will be {
    //   _id,
    //   lists, // integer or array of list data
    //   preferences: {
    //     key: value // for each modified preference
    //   }
    // }
    delete json._id // No need to reset _id to itself
    let to = "" // where to go back to (stay here if setting limit)

    // If phraseCount was updated, json will alse contain { ...
    //   index, // new value for user.lists
    //   lists  // [ new_list?, modified_list ]
    // }
    // If daysDelay was updated, json will also contain { ...
    //   redos
    // }

    const { lists, redos } = json
    if (Array.isArray(lists)) {
      // phraseCount was updated and the current list has changed
      json.lists = json.index // swap List.index for User.lists
      delete json.index

      mergeLists(lists) // [ array of lists ]
      to = "/add"
    }

    if (Array.isArray(redos)) {
      replaceRedos(redos)
    }

    // values in json may already have been set
    setPreferences({ ...preferences, ...json.preferences })
    // Unpack the preferences for the user
    json = { ...json, ...json.preferences }
    delete json.preferences
    setUser({ ...user, ...json })

    if (to) {
      navigate(to)
    }
  }


  const mergeLists = updatedLists => {
    updatedLists.forEach( updatedList => {
      const { _id, total, remain } = updatedList
      const list = lists.find( list => (
        list._id === _id
      ))

      if (list) {
        // This is a list whose total and remain values were
        // altered on the database. Perhaps the list is now full.
        // Remove any empty phrases if total has decreased.
        const { total: list_total } = list

        // Update total and remain to reflect current status
        list.total = total
        list.remain = remain

        if (total < list_total) {
          removeEmptyPhrases(list, total)
        } else if (total > list_total) {
          preparePhrases(list)
        }


      } else {
        // This is a new, empty list, as the current list is full
        preparePhrases(updatedList) // add empty Phrase objects
        lists.unshift(updatedList)
      }
    })

    setLists([ ...lists ]) // may have a new first item
  }


  const removeEmptyPhrases = (list, total) => {
    const { phrases } = list

    let emptyIndex
    // emptyIndex may be 0 in the while loop, but...
    //   `, emptyIndex > -1`
    // means that the loop breaks only if emptyIndex is less than
    // 0, meaning no more empty phraseshave been found.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_operator
    while (emptyIndex = phrases.findLastIndex( // remove from end
      phrase => !phrase.text
    ), emptyIndex > -1) { // let emptyIndex be 0 (it shouldn't be)
      phrases.splice(emptyIndex, 1)

      // Stop removing phrases when phrases is the expected length
      if (phrases.length === total) {
        break
      }
    }
  }


  function replaceRedos(redos) {
    redos.forEach(preparePhrases)
    setRedos(redos)
  }


  ///////// UTILITIES FOR TABBING BETWEEN phrases/reviews /////////


  function tabNextOnEnter(event) {
    if (event.key === "Enter" || event.key === "Tab") {
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

    const { y: up, bottom: down } = parent.getBoundingClientRect();
    const { top, bottom } = desk.getBoundingClientRect();

    if (top < up) {
      desk.scrollIntoView(true);
    } else if (bottom > down) {
      desk.scrollIntoView(false);
    }
  }


  /////////////////////////// USEFFECTS ///////////////////////////


  // TODO: Stay on current rev page if that's where we are
  const goAdd = () => {
    const wasLoaded = (PATHS_REGEX.test(location.pathname))
    console.log("goAdd location.pathname:", location.pathname)
    if (!initialized) {
      setInitialized(true)
      console.log("go /about")
      navigate("/about")

    } else if (!loaded && wasLoaded) {
      let connect = storage.get()
      if (!connect.password) {
        connect = {}
      }
      console.log(`Reconnecting for user ${JSON.stringify(connect)}`)
      setLoaded(true)

      return connectUser(connect)

    } else if (loaded) {
      console.log(`loaded: ${loaded}
        not going anywhere`)
      return

    } else if (lists[0]?.phrases) {
      console.log(`loaded: ${loaded}, phrases: ${lists[0]?.phrases.length}
        setLoaded(true), go /add`)

      setLoaded(true)
      navigate("/add")
    } else {
      console.log(`loaded: ${loaded}, no phrases
        setLoaded(true), go /`)
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


  const useMethod = () => {
    if (!loaded) {
      navigate("/")
    } else {
      navigate(from)
    }
  }


  useEffect(goAdd, [lists])
  useEffect(checkIfDone, [ dayList, redos.length ])


  return (
    <UserContext.Provider
      value ={{
        user,
        from,
        lists,
        redos,
        loaded,
        failed,
        dayDone,
        daysLists,
        redosDone,
        reviewState,
        preferences,
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
        getPathAndIndex,
        useMethod,
        setLoaded,
        setFrom,
        setPreferences,
        submitPreferences
      }}
    >
      {children}
    </UserContext.Provider>
  )
}