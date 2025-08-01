/**
 * frontend/src/contexts/UserContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { useNavigate } from 'react-router-dom'
import { APIContext } from "./APIContext"
import storage from "../tools/storage"

const LIST_LENGTH = 21
// Initialize storage if it is empty
const INITIALIZED = (Object.entries(storage.settings).length)

if (!INITIALIZED) {
  storage.set({ user_name: "User" })
}


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const navigate = useNavigate()
  const { origin } = useContext(APIContext)

  // Read initial value of userData from LocalStorage
  const [ loaded, setLoaded ] = useState(false)
  const [ user, setUser ] = useState(() => storage.get())
  const [ lists, setLists ] = useState([])
  const [ listIndex, setListIndex ] = useState(0)
  const [ redos, setRedos ] = useState([])
  const [ openAll, setOpenAll ] = useState(false)
  

  //////////////////////// INITIALIZATION ////////////////////////


  const getUserData = () => {
    const url = `${origin}/getUserData`
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(user)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatUserData(json))
      .catch(treatDataError)
  }


  const treatUserData = data => {
    const { user, lists, redos, fail } = data

    // If the server sends a fail message, it should be logged to
    // the console, but this doesn't seem to be happening
    if (fail) {
      console.log("fail:", fail)
    }

    lists.forEach(preparePhrases) // should only be one
    redos.forEach(preparePhrases) // should only be one

    // const replacer =(key, value) => {
    //   if (key === "phrases") {
    //     return `${value.length} phrases`
    //   }
    //   return value
    // }
    // console.log("data", JSON.stringify(data, replacer, '  '));
    // console.log("*************************")

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = user.user_name.replace(/_.*/, "")
    storage.placeItems({ user_name  })

    setUser(user)
    setLists(lists)
    setListIndex(lists[0].index) // only one list
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
    while (phrases.length < LIST_LENGTH) {
      phrases.push({
        _id: phrases.length,
        key: phrases.length,
        text: "",
        hint: "",
        db: { text: "", hint: "" }
      })
    }

    list.phrases = phrases
  }


  ///////////////////////// SELECT items /////////////////////////


  const getActive = type => {
    const index = Number(listIndex)
    const source = (type === "redo")
      ? redos
      : lists

    const list = source.find( list => list.index === index )
    return list || {}
  }


  const getPhrases = type => {
    const source = getActive(type)

    return source?.phrases || [{
      text: `No phrases available for ${type}`,
      hint: `listIndex: ${listIndex}
      (available: ${(type === "redo" ? redos : lists)?.map( list => list.index )})`,
      db: { text: "", hint: "" },
      _id: "random_id"
    }]
  }


  const getPhrase = (type, _id) => {
    const list = getActive(type)
    const phrase = list.phrases?.find(
      phrase => phrase._id === _id
    )

    return phrase
  }


  ///////////////////////// EDIT AND SAVE /////////////////////////


  const editPhrase = ({ type, name, _id, value, db }) => {
    const phrase = getPhrase(type, _id)
    phrase[name] = value

    const right =  (db && value === db.text)
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
    const list = getActive("list")
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
        return undefined
      }
      return value
    }

    const body = JSON.stringify(phrase, replacer)
    console.log("body", JSON.stringify(body, null, '  '));

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

    const phrase = list.phrases.find(phrase => phrase._id === _id)
    || list.phrases.find(phrase => phrase._id === key)

    phrase._id = _id
    phrase.db = { text, hint }
    delete phrase.saving

    setLists([...lists])
  }


  const toggleOpenAll = ({ target }) => {
    setOpenAll(target.checked)
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
    preparePhrases(list)

    // Place the new list at the beginning of the editable
    // lists
    setListIndex(list.index) // may be a string
    setUser({ ...user, lists: list.index }) // match DB value
    setLists([ list, ...lists ])
  }


  //////////////////////////// REVIEW ////////////////////////////


  const toggleRedo = ({ _id, name, checked, db }) => {
    const phrase = getPhrase("redo", _id)
    phrase[name] = checked

    setLists([...lists])
  }


  const submitReview = () => {
    const { _id } = getActive("redo")
    const phrases = getPhrases("redo")

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
    const { reviewed } = json
    const { _id, index, reviews, remain } = json.list
    const list = redos.find( list => list._id === _id )
    if (!list) {
      return console.log("Unable to find list with id:", list_id)
    }
    const { phrases } = list

    reviewed.forEach( data => {
      const phrase = phrases.find( phrase => phrase._id === data._id )
      if (phrase) {
        const { retained, limit } = phrase

        // retained may be undefined or a Date. The database should
        // never have a value of false for retained.
        if (retained) {
          phrase.retained = true
          phrase.db.retained = true
        }

        // limit will always be boolean
        phrase.limit = limit
        phrase.db.limit = limit
        
      } else {
        console.log("Can't find phrase matching:", data)
      }
    })

    setLists([ ...lists ])
  }


  const treatDataError = error => {
    console.log(error.message)
  }


  ///////// UTILITIES FOR TABBING BETWEEN phrases/reviews /////////


  function tabNextOnEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      tabToNextItem(event.target)
    }
  }


  /**
   * Fails if the next review is locked
   * Focuses on collapsed textarea if next review is to be retained
  */
  function tabToNextItem(activeItem) {
    const next = activeItem.nextElementSibling
    const target = (next?.tagName === "TEXTAREA" ? next : null)
         // hint?
      || activeItem.closest(".phrase, .review")
         .nextElementSibling.querySelector("textarea")
         // text in next phrase?
      || activeItem.closest("#phraseList, #review")
         .querySelector("textarea") // recycle to first entry

    if (target) {
      scrollIntoView({ target })
      target.focus()
    }
  }


  const scrollIntoView = ({ target }) => {
    // Find div#phraseList or div#review
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
      getUserData()
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


  useEffect(autoLoad, [])
  useEffect(goAdd, [lists])


  return (
    <UserContext.Provider
      value ={{
        user,
        lists,
        listIndex,
        redos,
        openAll,
        setListIndex,
        getPhrases,
        getActive,
        getUserData,
        editPhrase,
        updatePhrase,
        addList,
        toggleRedo,
        submitReview,
        tabNextOnEnter,
        scrollIntoView,
        toggleOpenAll
      }}
    >
      {children}
    </UserContext.Provider>
  )
}