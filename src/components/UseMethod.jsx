/**
 * frontend/src/components/UseMethod.jsx
 */


import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next'
import { UserContext } from '../contexts';

export const UseMethod = (props) => {
  const { t } = useTranslation()
  const { useMethod } = useContext(UserContext)

  return (
    <button
      className="primary use-method"
      onClick={useMethod}
    >
      {t("use-method")}
    </button>
  )
}