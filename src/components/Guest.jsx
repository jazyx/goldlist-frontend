/**
 * frontend/src/components/Guest.jsx
 */


import { useState, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next';
import { UserContext } from '../contexts'


export const Guest = ({ cookies }) => {
  const { t } = useTranslation()
  const { connectUser } = useContext(UserContext)
  const [ show, setShow ] = useState(false)

  const texts = {
    guest:       t("sign.guest.name"),
    sessionHead: t("sign.guest.session.head"),
    sessionBody: t("sign.guest.session.01"),
    cookieHead:  t("sign.guest.cookie.head"),
    cookieBody:  t("sign.guest.cookie.01")
  }


  const enterAsGuest = () => {
    connectUser()
  }


  const showWarning = ({ target }) => {
    setShow((target.name === "show"))
  }


  const sessionWarning = () => {
    return (
      <div className="warning">
        <h2>{texts.sessionHead}</h2>
        <p>{texts.sessionBody}</p>
        <p>
          <Trans
            i18nKey="sign.guest.session.02"
            values={{ origin: location.origin}}
          />
        </p>
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
        <h2>{texts.cookieHead}</h2>
        <p>{texts.cookieBody}</p>
        <p><Trans
          i18nKey="sign.guest.cookie.02"
          values={{ origin: location.origin}}
          components={{ b: <b /> }}
        /></p>
        <p><Trans
          i18nKey="sign.guest.cookie.03"
          components={{ b: <b /> }}
        /></p>
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
        {texts.guest}
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