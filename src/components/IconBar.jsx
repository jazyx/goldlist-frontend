/**
 * frontend/src/components/IconBar.jsx
 */


import { Link } from "react-router-dom"


export const IconBar = ({ icons }) => {
  // 2 items from [ "login", "about", "i18n" ]

  const getButton = {
    login: () => (
        <Link
          name="login"
          key="login"
          to="/"
        >
          <img src="/login.svg" alt="Login" />
        </Link>
      ),
    about: () => (
        <Link
          name="about"
          key="about"
          to="/about"
        >
          <img src="/about.svg" alt="About" />
        </Link>
      ),
    i18n: () => (
        <Link
          name="118n"
          key="i18n"
          to="i18n"
        >
          <img src="/flags/en-GB.png" alt="UK English" />
        </Link>
      )
  }


  const buttons = icons.map( iconName => getButton[iconName]())
  console.log("buttons:", buttons)


  return (
    // {buttons}
    <div id="icon-bar">
      {buttons}
    </div>
  )
}