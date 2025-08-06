/**
 * frontend/src/components/Guest.jsx
 */


import { useState, useContext } from 'react'
import { UserContext } from '../contexts'


export const Guest = ({ cookies }) => {
  const { getUserData } = useContext(UserContext)
  const [ show, setShow ] = useState(false)


  const enterAsGuest = () => {
    getUserData()
  }


  const showWarning = ({ target }) => {
    setShow((target.name === "show"))
  }


  const sessionWarning = () => {
    return (
      <div className="warning">
        <h2>Permanent Cookie Required</h2>
        <p>To explore this app as an anonymous guest, one permanent cookie will be set, to enable the server to record your progress. It will not be used for any other reason.</p>
        <p>If your browser deletes all cookies when it closes, your progress will be lost. To avoid this, either ensure that cookies for {location.origin} are maintained permanently, or register a username and password.</p>
        <button
          onClick={showWarning}
        >
          ×
        </button>
      </div>
    )
  }


  const cookieWarning = () => {
    return (
      <div className="warning">
        <h2>Cookies Are Disabled</h2>
        <p>To explore this app as an anonymous guest, one permanent cookie will be set, to enable the server to record your progress. It will not be used for any other reason.</p>
        <p>If you want to use the <b>Continue as Guest</b> option, please <b>ensure that cookies</b> for {location.origin} <b>are maintained permanently</b>.</p><p><b>Alternatively, you can register a username and password.</b></p>
        <button
          onClick={showWarning}
        >
          ×
        </button>
      </div>
    )
  }


  const warning = (cookies)
    ? sessionWarning()
    : cookieWarning()


  return (
    <div className="guest">


      <button
        onClick={enterAsGuest}
        disabled={!cookies}
      >
        Continue as Guest
      </button>
      <button
        className="warning"
        name="show"
        onClick={showWarning}
      >
        ⚠️
      </button>
      { show && warning }
    </div>
  )
}