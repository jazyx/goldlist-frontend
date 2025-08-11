/**
 * frontend/src/components/ConfirmReview.jsx
 */


import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../contexts'



export const ConfirmReview = ({phrases}) => {
  const { t } = useTranslation()
  const {
    cancelReview,
    submitReview
  } = useContext(UserContext)


  const reviewed = phrases.filter( phrase => {
    return phrase.retained === true
  }).map( phrase => (
    <li
      key={phrase._id}
    >
      {phrase.db.text}
    </li>
  ))


  const reviewedCount = reviewed.length
  const header = (reviewedCount === 1)
    ? t("remember1")
    : t("remember").replace("{{count}}", reviewedCount)


  return <div className="mask">
    <div className="dialog">
      <h2>{header}</h2>
      <ul>
        {reviewed}
      </ul>
      <div className="buttons">
        <button
          onClick={cancelReview}
        >
          {t("cancel")}
        </button>
        <button
          className="primary"
          onClick={submitReview}
        >
          {t("continue")}
        </button>
      </div>
    </div>
  </div>
}
