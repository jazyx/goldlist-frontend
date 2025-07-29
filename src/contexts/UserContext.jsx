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

    const replacer = (key, value) => {
      if (key === "phrases") {
        return `${value.length} phrases`
      }
      return value
    }
    // console.log("data", JSON.stringify(data, replacer, '  '));

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = user.user_name.replace(/_.*/, "")
    storage.placeItems({ user: { user_name }})

    setUser(user)
    setLists(lists)
    setListIndex(lists[0].index) // only one list
    setRedos(redos)
  }


  const preparePhrases = list => {
    // Add a db field to hold the values on the database
    const phrases = list.phrases.map( phrase => {
      const { text, hint } = phrase
      const db = { text, hint }
      return { ...phrase, db }
    })

    // Ensure there are the right number of entries
    while (phrases.length < LIST_LENGTH) {
      phrases.push({
        _id: phrases.length,
        text: "",
        hint: "",
        db: { text: "", hint: "" }
      })
    }

    list.phrases = phrases
  }


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


  const editPhrase = ({ type, name, _id, value, db }) => {
    const list = getActive(type)
    const phrase = list.phrases.find(
      phrase => phrase._id === _id
    )
    phrase[name] = value

    if (db && value === db.text) {
      phrase.right = true
    }

    setLists([...lists])
  }


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
    const { _id, key, text, hint, length, list_id } = json
    const list = lists.find( list => list._id === list_id)

    const phrase = list.phrases.find(phrase => phrase._id === _id)
    || list.phrases.find(phrase => phrase._id === key)

    phrase._id = _id
    phrase.db = { text, hint }
    delete phrase.saving

    if (length) {
      // This should only ever apply to an incomplete list
      list.length = length
    }

    setLists([...lists])
  }


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


  const treatDataError = error => {
    console.log(error.message)
  }


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
        setListIndex,
        getPhrases,
        getActive,
        getUserData,
        editPhrase,
        updatePhrase,
        addList
      }}
    >
      {children}
    </UserContext.Provider>
  )
}