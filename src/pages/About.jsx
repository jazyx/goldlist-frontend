/**
 * frontend/src/pages/About.jsx
 */


import { IconBar } from "../components/IconBar"

export const About = (props) => {


  return (
    <div id="about">
      <IconBar icons={[ "login" ]} />
      <div className="info">
        <h1 id="improved">
          The Gold List Method
        </h1>
        <h2 id="improved">
          A strategy for improving your vocabulary
        </h2>
        <b>Becoming proficient in a foreign language means regular daily practice. This app is designed to encourage you to develop good habits by jogging your memory with words that you recently learned.</b>
        <p>Every day, <strong>you should spend at least 15 minutes reading, listening, viewing or reviewing content in your target language</strong>. It&#39;s best to choose material where you learn something new about a topic you find interesting, with just the right amount of challenge.</p>
        <p>Continue until you have met at least 21 new words or expressions.</p>
        <p>Add each new expression to your daily list in this app, together with a hint to remind you what it means. This hint could be a translation into your own language, or a sentence in your target language that uses the expression.</p>

        <figure>
          <img src="/about/add.webp" alt="add" />
          <figcaption>Add a hint for each new expressions </figcaption>
        </figure>

        <h2 id="completing-your-daily-list">Completing your daily list</h2>
        <p>The number of new expressions you have entered will be shown in the counter at the bottom right. When you have added 21 expressions to a list, this counter will turn green, and the Add More button will become active. Click on Add More to save the list so that you can review it later.</p>

        <figure>
          <img src="/about/more.webp" alt="more" />
          <figcaption>Click the Add More button when the list is full</figcaption>
        </figure>

        <p>A new, empty list will appear, so you can continue to add new expressions if you want to.</p>
        
        <figure>
          <img src="/about/empty.webp" alt="empty" />
          <figcaption>A new empty list with 21 entries</figcaption>
        </figure>

        <p>The list that you just completed will appear in a new Edit tab, so you can make any last-minute changes before clicking on Submit List to submit the list definitively.</p>

        <figure>
          <img src="/about/edit.webp" alt="edit" />
          <figcaption>You can continue to edit your most recent list</figcaption>
        </figure>

        <p>If you don&#39;t submit the list manually within 6 hours, the app will assume that you don&#39;t want to make any changes to it, and it will be submitted automatically.</p>
        <h2 id="reviewing-older-lists">Reviewing older lists</h2>
        <p>After two weeks, the app will show you this list again. If you have been spending 15 minutes every day enjoying your target language, you will find that about 30% of these words are now stored in your long-term memory. For expressions that you already remember, click on the number to the left of expression, to show the ✅ icon. The expression itself will be hidden, but you will still see the hint.</p>

        <figure>
          <img src="/about/retain.webp" alt="retain" />
          <figcaption>Click on the number slider to show the ✅ icon</figcaption>
        </figure>

        <p>If there are any expressions that you have forgotten, type them out again and say them out loud. If your hint was a sentence in your target language, read out the whole sentence. This will help to refresh your memory.</p>

        <figure>
          <img src="/about/retype.webp" alt="retype" />
          <figcaption>Retype all the words you think you might forget</figcaption>
        </figure>
          
        <p>If the selector on the right shows a white dot, then a preview of the expression will appear as you are typing. If you want to test your memory, you can choose to hide the preview. When the expression is correctly typed, a green circle will appear on the right.</p>

        <figure>
          <img src="/about/hidden.webp" alt="hidden" />
          <figcaption></figcaption>
        </figure>

        <p>The expressions that you type out will be shown to you again after another two weeks. However, you must choose to hide at least 30% of the expressions. (At least 30% of the expressions should show the ✅ icon.) Hiding an expression means that you will <em>not</em> see it again in after two weeks. It means that you are telling your brain: &quot;I&#39;m going to remember this expression. I don&#39;t need to be reminded of it.&quot;</p>

        <p>After you have been using the app for at least four weeks, you will also see lists of expressions that you have already reviewed. Expressions that you chose to remember will appear locked, with just the hint showing. As before, for each list, hide 30% of the expressions, to force your brain to remember them, and type out all the other phrases that you are not yet sure of remembering.</p>

        <figure>
          <img src="/about/locked.webp" alt="locked" />
          <figcaption>Expressions that you chose to remember weeks ago will appear locked</figcaption>
        </figure>

        <h2 id="completing-a-review">Completing a review</h2>
        <p>The number of expressions that you have chosen to remember is shown in the counter at the bottom left. When you have chosen to remember at least 30% of the expressions, the counter will turn green.</p>
        <p>The number of expressions that you have not chosen to remember but have correctly typed is shown in the counter at the bottom right. When you have correctly typed all the expressions, this counter will turn green.</p>
        <p>When both counters are green, the Submit Review button will become active. Click on this to save your review. You will see this list again after two more weeks.</p>

        <figure>
          <img src="/about/submit.webp" alt="submit" />
          <figcaption>Submit a review when you have treated all the remaining expressions </figcaption>
        </figure>

        <h2 id="completing-your-day-s-work">Completing your day&#39;s work</h2>
        <p>Every day you should:</p>
        <ol>
        <li>Complete at least one list of 21 new expressions (you can add more)</li>
        <li>Review all the lists that you created in past weeks</li>
        </ol>
        <p>When you have done this, you should see a &quot;Congratulations!&quot; dialog. (You can continue to add more new expressions if you want to.)</p>

        <figure>
          <img src="/about/welldone.webp" alt="welldone" />
          <figcaption>The app will congratulate you when your day's work is done </figcaption>
        </figure>

        <h2 id="expectations">Expectations</h2>
        <p>Consistently listing 21 new expressions every day means that you will have met at least 7500 new expressions by the end of the year. An advanced speaker of a foreign language actively uses about 8000 <em>base</em> words. A base word is the main word in a word family. For example, the family of words &quot;do&quot;, &quot;did&quot;, &quot;done&quot;, &quot;doing&quot; has &quot;do&quot; as the base word.</p>
        <h2 id="tips">Tips</h2>
        <p>In Review mode, by default, the expression you are typing will appear as a preview in the background, to make it easy to remember what to type. You can create a better challenge for yourself by checking the &quot;Hide preview while typing&quot; selector on the right. This will show the expression until you start typing, but then it will hide it, so you must type correctly from memory.</p>
        <p>If you already chose to remember the expression some weeks ago, this same &quot;Hide hint&quot; selector will hide the hint for the expression completely.</p>

        <figure>
          <img src="/about/toggled.webp" alt="toggled" />
          <figcaption>The selector on the right shows or hides previews and hints and pr</figcaption>
        </figure>

        <h3 id="setting-a-general-preference-for-the-hide-state">Setting a general preference for the &#39;Preview&#39; state</h3>
        <p>You can hide set the &#39;Preview&#39; state for all expressions with the &quot;Set preview preference&quot; selector near the bottom right of the page.</p>

        <p>If you set the &quot;Set preview preference&quot; selector to its middle position, the app will use the individual settings of the &#39;Hide&#39; selector for each expression, as shown in the image above.</p>

        <p>If you set the &quot;Set preview preference&quot; selector to its top position, the app will reveal all the expressions that you previously committed to remembering. It will also show previews of all expressions while you are typing.</p>

        <figure>
          <img src="/about/visible.webp" alt="visible" />
          <figcaption>The Set Preview Preference button in the top position</figcaption>
        </figure>

        <p>If you set the &quot;Set preview preference&quot; selector to its bottom position, the app will hide the hints for all the expressions that you previously committed to remembering. It will also hide previews of all expressions while you are typing.</p>

        <figure>
          <img src="/about/collapsed.webp" alt="collapsed" />
          <figcaption>The Set Preview Preference button in the bottom position</figcaption>
        </figure>
        <p> Your preference will be saved for future visits.</p>
      </div>
    </div>
  )
}