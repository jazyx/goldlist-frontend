/**
 * frontend/src/pages/I18N.jsx
 */


import { IconBar } from "../components/IconBar"


export const I18N = (props) => {


  return (
    <div id="i18n">
      <IconBar icons={[ "login", "about" ]} />
      <div className="spacer"></div>
      <div className="info">
      </div>
      <div className="spacer"></div>
    </div>
  )
}