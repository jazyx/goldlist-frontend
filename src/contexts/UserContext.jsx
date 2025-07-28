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


  const treatUserData = (data) => {
    const { user, lists, redos } = data

    lists.forEach(preparePhrases) // should only be one

    const replacer = (key, value) => {
      if (key === "phrases") {
        return `${value.length} phrases`
      }
      return value
    }
    // console.log("lists", JSON.stringify(lists, replacer, '  '));

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = user.user_name.replace(/_.*/, "")
    storage.placeItems({ user: { user_name }})

    setUser(user)
    setLists(lists)
    setListIndex(lists[0].index) // only one list
    setRedos(redos)
  }


  const preparePhrases = (list) => {
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


  const getActiveList = () => {
    const index = Number(listIndex)
    return lists.find( list => list.index === index) || []
  }


  const getPhrases = () => {
    console.log("getPhrases index:", listIndex)
    const list = getActiveList()
    return list?.phrases || []
  }


  const editPhrase = ({ name, _id, value }) => {
    const list = getActiveList()
    const phrase = list.phrases.find(
      phrase => phrase._id === _id
    )
    phrase[name] = value
    setLists([...lists])
  }


  function updatePhrase(_id) {
    const list = getActiveList()
    const phrase = list.phrases.find(
      phrase => phrase._id === _id
    )
    phrase.saving = true
    setLists([...lists])

    savePhrase({ ...phrase, list_id: list._id })
  }


  const savePhrase = (phrase) => {
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


  const treatSavedPhrase = (json) => {
    // console.log("json", JSON.stringify(json, null, '  '));

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
    console.log("addList", body)

    fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(incoming => incoming.json())
      .then(json => treatNewList(json))
      .catch(treatDataError)
  }


  const treatNewList = (list) => {
    console.log("treatNewList json", JSON.stringify(json, null, '  '));

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
    if (lists[0]?.phrases) {
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
        getActiveList,
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