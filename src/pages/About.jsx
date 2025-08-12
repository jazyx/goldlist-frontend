/**
 * frontend/src/pages/About.jsx
 */


import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next'
import { UserContext } from '../contexts';
import { IconBar } from "../components/IconBar"
import { Menu } from '../components/Menu';
import { UseMethod } from "../components/UseMethod"

export const About = (props) => {
  const { t } = useTranslation()

  const texts = {
    title:    t("about.title"),
    h0_title: t("about.h0_intro.subtitle"),
    h0_lede:  t("about.h0_intro.lede"),
    h0_02:    t("about.h0_intro.02"),
    h0_03:    t("about.h0_intro.03"),
    h0_03_i:  t("about.h0_intro.03_caption"),

    h1_title: t("about.h1_daily.subtitle"),
    h1_01:    t("about.h1_daily.01"),
    h1_01_i:  t("about.h1_daily.01_caption"),
    h1_02:    t("about.h1_daily.02"),
    h1_02_i:  t("about.h1_daily.02_caption"),
    h1_03:    t("about.h1_daily.03"),
    h1_03_i:  t("about.h1_daily.03_caption"),
    h1_04:    t("about.h1_daily.04"),

    h2_title: t("about.h2_reviews.subtitle"),
    h2_01:    t("about.h2_reviews.01"),
    h2_01_i:  t("about.h2_reviews.01_caption"),
    h2_02:    t("about.h2_reviews.02"),
    h2_02_i:  t("about.h2_reviews.02_caption"),
    h2_03:    t("about.h2_reviews.03"),
    h2_03_i:  t("about.h2_reviews.03_caption"),
    h2_04:    t("about.h2_reviews.04"),
    h2_05:    t("about.h2_reviews.05"),
    h2_05_i:  t("about.h2_reviews.05_caption"),

    h3_title: t("about.h3_submit_review.subtitle"),
    h3_01:    t("about.h3_submit_review.01"),
    h3_02:    t("about.h3_submit_review.02"),
    h3_03:    t("about.h3_submit_review.03"),
    h3_03_i:  t("about.h3_submit_review.03_caption"),

    h4_title: t("about.h4_days_work.subtitle"),
    h4_01:    t("about.h4_days_work.01"),
    h4_01_i:  t("about.h4_days_work.01_caption"),
    h4_02:    t("about.h4_days_work.02"),
    h4_02_i:  t("about.h4_days_work.02_caption"),
    h4_03:    t("about.h4_days_work.03"),
    h4_03_i:  t("about.h4_days_work.03_caption"),
    h4_04:    t("about.h4_days_work.04"),
    h4_05:    t("about.h4_days_work.05"),
    h4_05_i:  t("about.h4_days_work.05_caption"),

    h5_title: t("about.h5_expectations.subtitle"),

    h6_title: t("about.h6_tips.subtitle"),
    h6_01:    t("about.h6_tips.01"),
    h6_02:    t("about.h6_tips.02"),
    h6_02_i:  t("about.h6_tips.02_caption"),

    h7_title: t("about.h7_preferences.subtitle"),
    h7_01:    t("about.h7_preferences.01"),
    h7_02:    t("about.h7_preferences.02"),
    h7_03:    t("about.h7_preferences.03"),
    h7_03_i:  t("about.h7_preferences.03_caption"),
    h7_04:    t("about.h7_preferences.04"),
    h7_04_i:  t("about.h7_preferences.04_caption"),
    h7_05:    t("about.h7_preferences.05")
  }


  const { loaded } = useContext(UserContext)

  const bar = (loaded)
    ? <Menu />
    : <IconBar icons={[ "login", "i18n" ]} />


  return (
    <div id="about">
      {bar}
      <div className="info">
        <h1 id="improved">
          {texts.title}
        </h1>
        <h2 id="improved">
          {texts.h0_title}
        </h2>
        <b>{texts.h0_lede}</b>
        <p><Trans
          i18nKey="about.h0_intro.01"
          components={{ strong: <strong /> }}
        /></p>
        <p>{texts.h0_02}</p>
        <p>{texts.h0_03}</p>

        <figure>
          <img src="/about/add.webp" alt="add" />
          <figcaption>{texts.h0_03_i}</figcaption>
        </figure>

        <h2 id="completing-your-daily-list">{texts.h1_title}</h2>
        <p>{texts.h1_01}</p>

        <figure>
          <img src="/about/more.webp" alt="more" />
          <figcaption>{texts.h1_01_i}</figcaption>
        </figure>

        <p>{texts.h1_02}</p>
        
        <figure>
          <img src="/about/empty.webp" alt="empty" />
          <figcaption>{texts.h1_01_i}</figcaption>
        </figure>

        <p>{texts.h1_03}</p>

        <figure>
          <img src="/about/edit.webp" alt="edit" />
          <figcaption>{texts.h1_03_i}</figcaption>
        </figure>

        <p>{texts.h1_04}</p>
        <h2 id="reviewing-older-lists">{texts.h2_title}</h2>
        <p>{texts.h2_01}</p>

        <figure>
          <img src="/about/retain.webp" alt="retain" />
          <figcaption>{texts.h2_01_i}</figcaption>
        </figure>

        <p>{texts.h2_02}</p>

        <figure>
          <img src="/about/retype.webp" alt="retype" />
          <figcaption>{texts.h2_02_i}</figcaption>
        </figure>
          
        <p>{texts.h2_03}</p>

        <figure>
          <img src="/about/hidden.webp" alt="hidden" />
          <figcaption>{texts.h2_03_i}</figcaption>
        </figure>

        <p><Trans
          i18nKey="about.h2_reviews.04"
          components={{ em: <em /> }}
        /></p>

        <p>{texts.h2_05}</p>

        <figure>
          <img src="/about/locked.webp" alt="locked" />
          <figcaption>{texts.h2_05_i}</figcaption>
        </figure>

        <h2 id="completing-a-review">{texts.h3_title}</h2>
        <p>{texts.h3_01}</p>
        <p>{texts.h3_02}</p>
        <p>{texts.h3_03}</p>

        <figure>
          <img src="/about/submit.webp" alt="submit" />
          <figcaption>{texts.h3_03_i}</figcaption>
        </figure>

        <h2 id="completing-your-day-s-work">{texts.h4_title}</h2>
        <p>{texts.h4_01}</p>
        <ol>
        <li>{texts.h4_02}</li>
        <li>{texts.h4_03}</li>
        </ol>
        <p>{texts.h4_04}</p>

        <figure>
          <img src="/about/welldone.webp" alt="welldone" />
          <figcaption>{texts.h4_04_i}</figcaption>
        </figure>

        <h2 id="expectations">{texts.h5_title}</h2>
        <p><Trans
          i18nKey="about.h5_expectations.01"
          components={{ em: <em /> }}
        /></p>
        <h2 id="tips">{texts.h6_title}</h2>
        <p>{texts.h6_01}</p>
        <p>{texts.h6_02}</p>

        <figure>
          <img src="/about/toggled.webp" alt="toggled" />
          <figcaption>{texts.h6_02_i}</figcaption>
        </figure>

        <h3 id="setting-a-general-preference-for-the-hide-state">{texts.h7_title}</h3>
        <p>{texts.h7_01}</p>

        <p>{texts.h7_02}</p>

        <p>{texts.h7_03}</p>

        <figure>
          <img src="/about/visible.webp" alt="visible" />
          <figcaption>{texts.h7_03_i}</figcaption>
        </figure>

        <p>{texts.h7_04}</p>

        <figure>
          <img src="/about/collapsed.webp" alt="collapsed" />
          <figcaption>{texts.h7_04_i}</figcaption>
        </figure>
        <p>{texts.h7_05}</p>
      </div>
      <UseMethod />
    </div>
  )
}