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
 */


import { useContext } from 'react'
import { useTranslation } from "react-i18next"
import sklonenie from 'sklonenie'
import { I18nContext, UserContext } from '../contexts'
import { IconBar } from "../components/IconBar"
import { UseMethod } from '../components/UseMethod'
import { StepSlider } from '../components/StepSlider'


const CYRILLIC_REGEX = /[А-Яа-яЁё]/


export const Profile = () => {
  const { t } = useTranslation()
  const { language } = useContext(I18nContext)
  const {
    user,
    preferences,
    setPreferences
  } = useContext(UserContext)

  let { user_name } = user
  const { delay, count } = preferences

  if (language === "ru" && CYRILLIC_REGEX.test(user_name)) {
    user_name = sklonenie(user_name)[1][0] // genitive first name
  }


  const texts = {
    delay: t("prefs.delay"),
    count: t("prefs.count"),
    settings: t("prefs.for", { user_name })
  }

  
  const treatValue = (name, value) => {
    setPreferences({ ...preferences, [name]: value })
    
    console.log("StepSlider clicked:", name, value)
  }


  const delaySlider = (() => {
    const options = {
      name: "delay",
      label: texts.delay,
      values: [ 1, 2, 3, 5, 7, 10, 14 ],
      value: delay,
      treatValue
    }
    return <StepSlider { ...options }/>
  })()


  const countSlider = (() => {
    const options = {
      name: "count",
      label: texts.count,
      values: [ 10, 15, 21 ],
      value: count,
      treatValue
    }
    return <StepSlider { ...options }/>
  })()


  return (
    <div id="profile">
      <IconBar icons={[ "login", "about" ]} />
      <div className="spacer"></div>
      <h1>{texts.settings}</h1>
      <div className="spacer"></div>
      {countSlider}
      {delaySlider}
      <div className="spacer"></div>
      <UseMethod />
    </div>
  )
}
