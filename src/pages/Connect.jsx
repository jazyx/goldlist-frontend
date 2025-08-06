/**
 * frontend/src/pages/Connect.jsx
 */


import { useContext, useState } from 'react'
import { APIContext } from '../contexts'
import { Guest } from '../components/Guest'


export const Connect = () => {
  const { cookies } = useContext(APIContext)
  const [ register, setRegister ] = useState(false)
  const [ details, setDetails ] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [ show, setShow ] = useState(false)


  const registerUser = () => {
    console.log("details", JSON.stringify(details, null, '  '));
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
      if (details.username && details.email && details.password) {
        registerUser()
      }
    }
  }


  const buttonName = (register)
    ? "Register"
    : "Log In"

  const [ registerClass, loginClass ] = (register)
    ? [ "selected", null ]
    : [ null, "selected" ]

  const [ type, src, alt ] = (show)
    ? [ "text", "/open.svg", "open" ]
    : [ "password", "/shut.svg", "shut" ]
    
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
            id="username"
            name="username"
            value={details.username}
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
        <div className="buttons">
          <button
            className="primary"
            onClick={registerUser}
          >
            {buttonName}
          </button>
          <Guest {...{cookies}} />
        </div>
    </div>
  )
}