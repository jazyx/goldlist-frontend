/**
 * frontend/src/components/SubmitReview.jsx
 * 
 * Sets UserContext's `reviewState` to "ready" when clicked.
 * This will tell Reviews to show the ConfirmReview dialog.
 * If the Continue button is clicked, submitReview() will be called
 * in UserContext, and the list removed from the Tabs bar.
 * If Cancel is clicked, `reviewState` will be set to "cancelled".
 * This Submit Review button will continue to be active, unless
 * ReviewsFooter discovers that at least one phrase has not been
 * treated, in which case it will set `reviewState` to "untreated".
 * This will disable this Submit Review button.
 */


import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../contexts'


export const SubmitReview = ({ disabled }) => {
  const { t } = useTranslation()
  const { confirmReview } = useContext(UserContext)


  return (
    <button 
      className="primary"
      disabled={disabled}
      onClick={confirmReview}
    >
      {t("submit_review")}
    </button>
  )
}