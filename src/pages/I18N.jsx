/**
 * frontend/src/pages/I18N.jsx
 */


import { useContext } from 'react'
import { I18nContext } from '../contexts'
import { IconBar } from "../components/IconBar"


const divStyle = {
  display: "flex",
  justifyContent: "space-around",
  width: "100vw"
}  

const checkboxStyle = {
  width: "0",
  visibility: "hidden"
}


export const Languages = () => {
  const {
    languages,
    language,
    changeLanguage
  } = useContext(I18nContext)

  // console.log("languages:", languages)
  // {
  //   "en": {
  //     "name": "English",
  //     "flag": "/flags/en-GB.png"
  //   },
  //   "fr": {
  //     "name": "Français",
  //     "flag": "/flags/fr.png"
  //   }
  // }

  const chooseLanguage = ({ target }) => {
    const { id } = target

    if (languages[id]) {
      changeLanguage(id)
    }
  }

  const radioButtons = Object.entries(languages).map(([ code, data ]) => {
    const { name, flag } = data

    const checked = code === language
    const opacity = checked ? 1 : 0.5
    const borderStyle = checked ? "inset" : "outset"
    

    const imgStyle = {
      border: `2px ${borderStyle} #ccc`,
      borderRadius: "100vmax",
      width: "100%",
      cursor: "pointer",
      opacity
    }
    
    return (
      <label
        key={code}
      >
        <input
          type="radio"
          name="language"
          style={checkboxStyle}
          value={code}
          id={code}
        />
        <img
          src={flag}
          alt={name}
          title={name}
          style={imgStyle}
        />
      </label>
    )
  })

  return (
    <div
      className="language-flags"
      onChange={chooseLanguage}
      style={divStyle}
    >
      {radioButtons}
    </div>
  )
}




export const I18N = (props) => {


  return (
    <div id="i18n">
      <IconBar icons={[ "login", "about" ]} />
      <div className="spacer"></div>
      <Languages />
      <div className="spacer"></div>
    </div>
  )
}
