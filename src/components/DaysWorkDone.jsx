/**
 * frontend/src/components/DaysWorkDone.jsx
 */


import { useContext } from 'react'
import { UserContext } from '../contexts'
import { useTranslation } from "react-i18next";



export const DaysWorkDone = () => {
  const { t } = useTranslation();

  const {
    dayDone,
    daysLists,
    redosDone,
    setDayDone
  } = useContext(UserContext)

  if (!dayDone) { return }


  const message =
    t("congratulations.completed", { count: daysLists }) +
    (redosDone
      ? (redosDone === 1)
        ? t("congratulations.reviewed1")
        : t("congratulations.reviewed", { count: redosDone })
     : "."
    )


  return (
    <div className="mask">
      <div className="dialog done">
        <h2>Congratulations!</h2>
        <p>{message}</p>
        <button
          className="primary"
          onClick={() => setDayDone(false)}
        >
          {t("congratulations.welldone")}
        </button>
      </div>
    </div>
  )
}