/**
 * frontend/src/components/DaysWorkDone.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'


export const DaysWorkDone = (props) => {
  const {
    dayDone,
    redosDone,
    setDayDone
  } = useContext(UserContext)

  if (!dayDone) { return }


  const message = 
    "You have completed a new phrase list" +
    (redosDone
      ? (redosDone === 1)
        ?` and reviewed 1 older list.`
        :` and reviewed ${redosDone} older lists.`
     : "."
    )

  // console.log("DaysWorkDone:", message)


  return (
    <div className="mask">
      <div className="dialog done">
        <h2>Congratulations!</h2>
        <p>{message}</p>
        <button
          className="primary"
          onClick={() => setDayDone(false)}
        >
          Well Done!
        </button>
      </div>
    </div>
  )
}