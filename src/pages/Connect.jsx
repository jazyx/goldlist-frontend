/**
 * frontend/src/pages/Connect.jsx
 */


import { useContext, useState } from 'react'
import { APIContext, UserContext } from '../contexts'
import { Guest } from '../components/Guest'


export const Connect = () => {
  const { cookies, user } = useContext(APIContext)
  const {
    registerUser,
    getUserData,
    failed
  } = useContext(UserContext)
  const [ register, setRegister ] = useState(false)
  const [ details, setDetails ] = useState({
    user_name: user || "",
    email: "",
    password: ""
  })
  const [ show, setShow ] = useState(false)


  const connect = ({ target }) => {
    const { name } = target
    console.log("name:", name)
    console.log("details", JSON.stringify(details, null, '  '));
    if (name === "register") {
      registerUser(details)
    } else {
      getUserData(details)
    }
  }


  const toggleMode = ({ target }) => {
    const register = target.id === "register"
    setRegister(register)
  }


  const toggleShow = () => {
    setShow(!show)
  }


  const update = ({ target }) => {
    const { name, value } = target
    details[name] = value
    setDetails({ ...details })
  }


  const treatEnterKey = (event) => {
    const { key, target } = event
    if (key === "Enter") {
      event.preventDefault()
      if (details.user_name && details.email && details.password) {
        registerUser()
      }
    }
  }


  const [ name, buttonName ] = (register)
    ? [ "register", "Register"]
    : [ "login", "Log In"]

  const [ registerClass, loginClass ] = (register)
    ? [ "selected", null ]
    : [ null, "selected" ]

  const [ type, src, alt ] = (show)
    ? [ "text", "/open.svg", "open" ]
    : [ "password", "/shut.svg", "shut" ]

  const disabled = !details.user_name || !details.password


  return (
    <div id="connect">
      <div className="connect">
        <label
          className={loginClass}
        >
          <input
            type="radio"
            name="mode"
            id="log-in"
            checked={!register}
            onChange={toggleMode}
          />
          <span>Log In</span>
        </label>
        <label
          className={registerClass}
        >
          <input
            type="radio"
            name="mode"
            id="register"
            checked={register}
            onChange={toggleMode}
          />
          <span>Register</span>
        </label>
      </div>
      <div className="inputs">
        <label>
          <span>Username:</span>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={details.user_name}
            onKeyDown={treatEnterKey}
            onChange={update}
          />
        </label>
        <label>
          <span>Email (optional):</span>
          <input
            type="email"
            id="email"
            name="email"
            value={details.email}
            onKeyDown={treatEnterKey}
            onChange={update}
          />
        </label>
        <label className="password">
          <span>Password:</span>
          <input
            type={type}
            id="password"
            name="password"
            value={details.password}
            onKeyDown={treatEnterKey}
            onChange={update}
            />
            <button
              onClick={toggleShow}
            >
            <img src={src} alt={alt} />
          </button>
        </label>
      </div>
      <p
        className="failed"
      >
        {failed}
      </p>
      <div className="buttons">
        <button
          name={name}
          className="primary"
          onClick={connect}
          disabled={disabled}
        >
          {buttonName}
        </button>
        <Guest {...{cookies}} />
      </div>
    </div>
  )
}