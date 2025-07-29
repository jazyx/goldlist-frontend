/**
 * frontend/src/components/Counter.jsx
 */


import { useContext } from "react"
import { UserContext } from "../contexts"



export const Counter = (props) => {
  const { getActive } = useContext(UserContext)
  const list = getActive("list")
  const { length, remain } = ( list || { length: 0, remain: 21 } )

  const style = { backgroundColor: "#060"}
  if (length < 21) {
    const red = 255 - (4 * length)
    style.backgroundColor = `rgb(${red}, 102, 0)`
  }

  return (
    <span 
     className="counter"
     style={style}
    >
      {length}/{remain}
    </span>
  )
}