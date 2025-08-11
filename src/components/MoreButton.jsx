/**
 * frontend/src/components/MoreButton.jsx
 */


import { useTranslation } from 'react-i18next'


export const MoreButton = ({disabled, addList}) => {
  const { t } = useTranslation()

  return (
    <button
      className="primary"
      disabled={disabled}
      onClick={addList}
    >
      {t("more")}
    </button>
  )
}