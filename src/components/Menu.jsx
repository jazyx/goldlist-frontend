/**
 * frontend/src/components/Hamburger.jsx
 */


import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next"
import { I18nContext, UserContext } from "../contexts"



export const Menu = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    languages,
    language,
  } = useContext(I18nContext)
  const {
    setLoaded,
    getPathAndIndex,
    from,
    setFrom
  } = useContext(UserContext)
  const menuRef = useRef()
  const [ open, setOpen ] = useState(false)
  const [ to, setTo ] = useState()
  

  const flagSrc = languages[language]?.flag
  const choose = t("choose-language")


  const { path } = getPathAndIndex()

  
  const toggleOpen = state => {
    if (typeof state !== "boolean") {
      state = !open

      const menu = menuRef.current

      const autoClose = ({ target }) => {
        if (menu && menu.contains(target)) {
          return
        }
        setOpen(currentValue => false)
        document.body.removeEventListener("mousedown", autoClose)
      }

      if (state) {
        // The menu is about to open. Prepare to close it when
        // a click anywhere else occurs
        document.body.addEventListener("mousedown", autoClose)
      }
    }
    setOpen(state)
  }


  const setDestination = ({ target }) => {
    target = target.closest("li")

    const { dataset } = target

    switch (dataset.name) {
      case "back":
        return setTo(from)
      case "about":
        return setTo("/about")
      case "i18n":
        return setTo("/i18n")
      case "logout":
        setLoaded(false)
        return setTo("/")
    }
  }


  const goDestination = () => {
    if (path === "add" || path === "rev") {
      setFrom(location.pathname)
    }

    if (to) {
      navigate(to)
      setTo()
    }
  }


  const createMenu = () => {
    return (
      <ul
        id="menu-contents"
      >
       { path !== "add" && path !== "rev" && (
          <li
            className="button"
            data-name="back"
            onClick={setDestination}
          >
            <img src="/files.svg" alt="" />
            <span>{t("use-method")}</span>
          </li>
          )
        }
       { path !== "about" && (
          <li
            className="button"
            data-name="about"
            onClick={setDestination}
          >
            <img src="/about.svg" alt="" />
            <span>{t("about.title")}</span>
          </li>
          )
        }
        { path !== "i18n" && (
          <li
            className="button"
            data-name="i18n"
            onClick={setDestination}
          >
            <img src={flagSrc} alt="" />
            <span>{choose}</span>
          </li>
          )
        }
        { path !== "/" && (
            <li
              className="button"
              data-name="logout"
              onClick={setDestination}
            >
              <img src="/login.svg" alt="" />
              <span>{t("sign.logout")}</span>
            </li>
          )
        }
      </ul>
    )
  }


  const items = (open)
    ? createMenu()
    : ""


  useEffect(goDestination, [to])
  

  return (
    <div
      className="menu"
      ref={menuRef}
    >
      <button
        className="menu"
        onClick={toggleOpen}
      >
        <img src="/goldlist.png" alt="icon" />
      </button>
      {items}
    </div>
  )
}