/**
 * frontend/src/components/SubmitList.jsx
 */


import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../contexts'


export const SubmitList = ({ _id }) => {
  const { t } = useTranslation()
  const { submitList } = useContext(UserContext)


  // TODO: Show warning if Edit list is old
  const className = (true)
    ? "primary"
    : "warning"


  return (
    <button 
      className={className}
      onClick={() => submitList(_id)}
    >
      {t("submit_list")}
    </button>
  )
}