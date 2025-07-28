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
  const [ phrases, setPhrases ] = useState([])
  const [ redos, setRedos ] = useState([])


  const treatUserData = (data) => {
    // console.log("userData", JSON.stringify(data, null, '  '));

    const { user, lists, redos } = data

    // There should be only one entry in `lists`: use its phrases
    const phrases  = lists[0].phrases.map( phrase => {
      const { text, hint } = phrase
      const db = { text, hint }
      return { ...phrase, db }
    })
    while (phrases.length < LIST_LENGTH) {
      phrases.push({
        _id: phrases.length,
        text: "",
        hint: "",
        db: { text: "", hint: "" }
      })
    }

    // const replacer = (key, value) => {
    //   if (key === "phrases") {
    //     return `${value.length} phrases`
    //   }
    //   return value
    // }
    // console.log("lists", JSON.stringify(lists, replacer, '  '));

    // Update the user_name in LocalStorage, after removing uuid
    const user_name = user.user_name.replace(/_.*/, "")
    storage.placeItems({ user: { user_name }})

    setUser(user)
    setLists(lists)
    setListIndex(0)
    setPhrases(phrases)
    setRedos(redos)
  }


  const editPhrase = ({ name, _id, value }) => {
    const phrase = phrases.find(
      phrase => phrase._id === _id
    )
    phrase[name] = value
    setPhrases([...phrases])
  }


  function updatePhrase(_id) {
    const phrase = phrases.find(
      phrase => phrase._id === _id
    )
    phrase.saving = true
    setPhrases([...phrases])

    savePhrase({ ...phrase, list_id: lists[listIndex]._id })
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

    const phrase = phrases.find(phrase => phrase._id === _id)
    || phrases.find(phrase => phrase._id === key)

    phrase._id = _id
    phrase.db = { text, hint }
    delete phrase.saving

    setPhrases([...phrases])

    if (length) {
      // This should only every apply to an incomplete list
      const activeList = lists.find( list => list._id === list_id )
      if (activeList) {
        activeList.length = length
        setLists([ ...lists ])
      }
    }
  }


  const addList = () => {
    console.log("addList")
  }


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
        phrases,
        redos,
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