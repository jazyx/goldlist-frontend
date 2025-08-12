/**
 * frontend/src/components/TabButton.jsx
 */

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const TabButton = ({ check, index, reviews }) => {
  const { t } = useTranslation();
  // check will be a number (including 0) if this tab refers to
  // a list that is still editable by the user. It will be 0 if
  // the list is incomplete, and > 0 if the list is not yet
  // submitted. It will be undefined for all redos.
  // `index` will be the index from the List record
  // `reviews` will be undefined for a list that has not yet
  // // been submitted. For a list that is due for review, it
  // refers to the number of the _next_ review, so it starts at
  // 1 for a list that has never been reviewed yet.

  console.log("reviews:", reviews)

  const isNew   = check === 0;
  const isCheck = !!check; // true if check is 1 or more
  const isRedo  = !isNew && !isCheck

  const name =
    index < 0
      ? `R${-index}` // This is a recycled list of knotty words
      : index;

  const newLabel = t("tabs.new.label")
  const label = isNew
    ? newLabel
    : isCheck
      ? `${t("tabs.check.label", { count: index })}`
      : `${t("tabs.list.label", { name })}`

  const title = isNew
    ? `${t("tabs.new.title")}`
    : isCheck
      ? `${t("tabs.check.title", { count: index })}`
      : `${t("tabs.list.title", { name })}`;

  const reviewed = isRedo
    ? `${t("tabs.list.reviewed", { count: reviews - 1 })}`
    : ""

  const to = isRedo ? `/rev/${index}` : `/add/${index}`

  const { pathname } = location;
  const active =
      pathname === `${to}`
  || (pathname === "/add" && label === newLabel);

  const className = active ? "active" : null;

  return (
    <li
      className={className}
      title={title + reviewed}
      draggable={false}
    >
      <Link
        to={to}
        draggable={false}
      >
        <button
          draggable={false}
        >
          {label}
        </button>
      </Link>
    </li>
  );
};
