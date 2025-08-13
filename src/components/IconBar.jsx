/**
 * frontend/src/components/IconBar.jsx
 */


import { useContext } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { I18nContext, UserContext } from "../contexts"
import { Menu } from './Menu'


export const IconBar = ({ icons }) => {
  const { t } = useTranslation()
  // 2 items from [ "login", "about", "i18n" ]

  const {
    languages,
    language,
  } = useContext(I18nContext)

  const { loaded } = useContext(UserContext)

  const flagSrc = languages[language]?.flag
  const others = Object.values(languages)
    .map(({ flag }) => {
      return flag
    })
    .filter( flag => flag !== flagSrc )
    .map( src => (
      <img
        key={src}
        src={src}
        alt={src}
      />
    ))
  

  const getButton = {
    login: () => (
        <Link
          name="login"
          key="login"
          to="/"
          title={t("sign.connect")}
        >
          <img src="/login.svg" alt="Login" />
        </Link>
      ),
    about: () => (
        <Link
          name="about"
          key="about"
          to="/about"
          title={t("about.title")}
        >
          <img src="/about.svg" alt="About" />
        </Link>
      ),
    i18n: () => (
        <Link
          name="118n"
          key="i18n"
          to="/i18n"
          title={t("choose-language")}
        >
          <span>{others}</span>
          <img src={flagSrc} alt={language} />
        </Link>
      )
  }


  const buttons = icons.map( iconName => getButton[iconName]())
  if (loaded) {
    buttons.splice(0, 1, <Menu key="menu"/>)
  }


  return (
    <div id="icon-bar">
      {buttons}
    </div>
  )
}