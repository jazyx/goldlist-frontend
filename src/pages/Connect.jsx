/**
 * frontend/src/pages/Connect.jsx
 */


import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next';

import { APIContext, UserContext } from '../contexts'
import { IconBar } from '../components/IconBar'
import { Guest } from '../components/Guest'


export const Connect = () => {
  const { cookies } = useContext(APIContext)
  const { user } = useContext(UserContext)
  const { t } = useTranslation()

  const {
    connectUser,
    failed
  } = useContext(UserContext)
  
  const [ register, setRegister ] = useState(false)
  const [ details, setDetails ] = useState({
    user_name: user?.user_name || "",
    // user_name: "",
    email: "",
    password: ""
  })
  const [ showPassword, setShowPassword ] = useState(false)


  const texts = {
    signUp:     t("sign.up"),
    signIn:     t("sign.in"),
    username:   t("sign.username"),
    email:      t("sign.email"),
    password:   t("sign.password"),
    user_id:    t("sign.user_id"),
    passTitle: showPassword
            ?   t("sign.hide-password")
            :   t("sign.show-password"),
    auto_login: t("sign.remember-me"),
    invalid:    t("sign.unauthorized")
  }  


  const connect = ({ target }) => {
    const { name: action  } = target
    connectUser({ ...details, action })
  }


  const toggleMode = ({ target }) => {
    const register = target.id === "register"
    setRegister(register)
  }


  const toggleShow = () => {
    setShowPassword(!showPassword)
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
        connectUser()
      }
    }
  }


  // function showFailMessage() {
  //   return (
  //     <p className="fail-message">
  //       {t(`sign.${logInstead}`)}
  //     </p>
  //   )
  // }


  // const signUpFeedback = (() => {
  //   switch (typeof logInstead) {
  //     case "string":
  //       return showFailMessage()
  //     case "object":
  //       return showDuplicate()
  //     default:
  //       return
  //   }
  // })()


  // function showDuplicate() {
  //   const [ key, value ] = logInstead

  //   const button = (
  //     <button
  //       type="button"
  //       onClick={showSignIn}
  //     />
  //   )

  //   const span = <span />

  //   return (
  //     <p className="logInstead">
  //       <Trans
  //         i18nKey="sign.duplicate"
  //         values={{ key: t(`sign._${[key]}`), value }}
  //         defaults="The {{key}} '{{value}}' exists. <span><button>Log in</button></span>"
  //         components={{ button, span }}
  //       />
  //     </p>
  //   )
  // }


  const [ name, buttonName ] = (register)
    ? [ "register", texts.signUp]
    : [ "login", texts.signIn]

  const [ registerClass, loginClass ] = (register)
    ? [ "selected", null ]
    : [ null, "selected" ]

  const [ type, src, alt ] = (showPassword)
    ? [ "text", "/open.svg", "open" ]
    : [ "password", "/shut.svg", "shut" ]

  const disabled = !details.user_name || !details.password


  return (
    <div id="connect">
      <IconBar icons={[ "about", "i18n" ]}/>
      <div className="spacer"></div>

      <div className="dialog">
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
            <span>{texts.signIn}</span>
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
            <span>{texts.signUp}</span>
          </label>
        </div>
        <div className="inputs">
          <label>
            <span>{texts.username}:</span>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={details.user_name}
              onKeyDown={treatEnterKey}
              onChange={update}
            />
          </label>
          {/* <label>
            <span>Email (optional):</span>
            <input
              type="email"
              id="email"
              name="email"
              value={details.email}
              onKeyDown={treatEnterKey}
              onChange={update}
            />
          </label> */}
          <label className="password">
            <span>{texts.password}:</span>
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
        {/* {signUpFeedback} */}
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
      <div className="spacer"></div>
    </div>
  )
}