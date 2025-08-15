/**
 * frontend/src/pages/Profile.jsx
 * 
 * - [ ] Read-onlyScores
 *   - [ ] Number of expressions entered
 *   - [ ] Number of expressions retained
 *   - [ ] Score on flashcards
 * - [ ] Reset password
 * - [ ] Reset/Add email address
 * - [ ] Choose number of expressions to add each day
 * - [ ] Choose delay between reviews
 * 
 * Uses a package to create genitive of Russian names. Returns
 * user_name unchanged if it is not a known name. Works with
 * certain foreign names transliterated into Russian.
 * https://www.npmjs.com/package/sklonenie
 */


import { useContext } from 'react'
import { useTranslation } from "react-i18next"
import { I18nContext, UserContext } from '../contexts'
import { useCase } from '../tools/useCase'
import { IconBar } from "../components/IconBar"
import { UseMethod } from '../components/UseMethod'
import { StepSlider } from '../components/StepSlider'


export const Profile = () => {
  const { t } = useTranslation()
  const { language } = useContext(I18nContext)
  const {
    user,
    preferences,
    setPreferences,
    submitPreferences
  } = useContext(UserContext)

  const fallback = t("sign.guest.genitive") // Guest, ... гостя
  const user_name = useCase(language, user.user_name, fallback)
  const { daysDelay, phraseCount } = preferences


  const texts = {
    delay: t("prefs.delay.title"),
    count: t("prefs.count.title"),
    settings: t("prefs.for", { user_name })
  }

  
  const treatValue = (name, value) => {
    setPreferences({ ...preferences, [name]: value })
  }


  const delaySlider = (() => {
    const options = {
      name: "daysDelay",
      label: texts.delay,
      values: [ 1, 2, 3, 5, 7, 10, 14 ],
      labels: [
        { label: t("prefs.delay.one")},
        { label: t("prefs.delay.two"),     left: true  },
        { label: t("prefs.delay.three") },
        { label: t("prefs.delay.five"),    left: true },
        { label: t("prefs.delay.seven") },
        { label: t("prefs.delay.ten"),     left: true },
        { label: t("prefs.delay.fourteen") }
      ],
      value: daysDelay,
      treatValue
    }
    return <StepSlider { ...options }/>
  })()


  const countSlider = (() => {
    const options = {
      name: "phraseCount",
      label: texts.count,
      values: [ 10, 15, 21 ],
      labels: [  
        { label: t("prefs.count.ten") },
        { label: t("prefs.count.fifteen") },
        { label: t("prefs.count.twenty-one") }
      ],
      value: phraseCount,
      treatValue
    }
    return <StepSlider { ...options }/>
  })()


  const prefs = Object.entries(preferences)
  const disabled = prefs.reduce(( boolean, [ key, value ] ) => {
    if (user[key] !== value) {
      boolean = false
    }

    return boolean
  }, true)


  return (
    <div id="profile">
      <IconBar icons={[ "login", "about" ]} />
      <div className="spacer"></div>

      <article>
        <h1>{texts.settings}</h1>
        <div className="spacer"></div>
        <h3>{t("prefs.count.title")}</h3>
        {countSlider}
        <h3>{t("prefs.delay.title")}</h3>
        {delaySlider}
      </article>

      <div className="spacer"></div>
      <button
        className="save"
        onClick={submitPreferences}
        disabled={disabled}
      >
        💾
      </button>
      <UseMethod />
    </div>
  )
}
