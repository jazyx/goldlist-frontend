/**
 * frontend/src/components/TabButton.jsx
 */


import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next';


export const TabButton = ({ check, index, reviews }) => {
  const { t } = useTranslation()

  const label = (() => {
    if (!reviews) { return }

    const done = reviews - 1

    if (!done) {
      return "No reviews yet"
    }
    if (done === 1) {
      return "1st review"
    }
    if (done === 11) {
      return "11th review"
    }

    const digit = (done) % 10
    switch (digit) {
      case 1:
        return `${done}st review`
      case 2:
        return `${done}nd review`
      case 3:
        return `${done}rd review`
      default:
        return `${done}th review`
    }
  })()


  const texts = {
    newText:    t("tabs.new.text"),
    newTitle:   t("tabs.new.title"),
    checkTitle: t("tabs.check.title"),
    listTitle:  t("tabs.list.title"),
  }


  const name = (index < 0) 
    ? `R${-index}` // This is a recycled list of knotty words
    : index


  const [text, title] = (reviews)
    ? [<Trans
          i18nKey="tabs.list.text"
          values={{ name }}
        />
      , `${texts.listTitle} ${name} (${label})`
      ]
    : (check)
      ? [ <Trans
            i18nKey="tabs.check.text"
            values={{ name }}
          />,
          `${texts.checkTitle} ${name}`
        ]
      : [texts.newText, texts.newTitle]

  const to = (reviews)
    ? `/rev/${index}`
    : `/add/${index}`

  const { pathname } = location
  const active = pathname === `${to}`
    || pathname === "/add" && text === "Add"

  const className = (active)
    ? "active"
    : null

  return (
    <li
      title={title}
      draggable={false}
      className={className}
    >
      <Link to={to}
        draggable={false}
      >
        <button
          draggable={false}
        >
          {text}
        </button>
      </Link>
    </li>
  )
}