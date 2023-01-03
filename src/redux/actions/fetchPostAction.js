import store from "../store.js";

import loremText from "../../components/_defaultText.js";

export const fetchWikiApi = () => (dispatch) => {
  // fetching data from wiki API ===============

  // Multiple extracts can only be returned if exintro is set to true.! (if only first part of wiki article is considered)
  // let wikiApiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&grnlimit=1&origin=*&explaintext&exsectionformat=plain`;

  /*  ==== escaping string characters for Regex with escape-string-regexp npm module
  let regexpString = "'\\^!\"#$%&()*+,-./:;<=>?@[]^_`{|}~";
  
  const escapedString = escapeStringRegexp(regexpString);
  let testRegex = new RegExp(escapedString);
  console.log("TCL: Display -> testRegex", testRegex);
  
  let regexpStringEscaped = /'\\\^!"#\$%&\(\)\*\+,-\.\/:;<=>\?@\[\]\^_`\{\|\}~/;
  */

  let wikiApiUrl = `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=extracts&grnlimit=1&origin=*&explaintext&exsectionformat=plain`;

  return fetchingData();

  function fetchingData() {
    if (store.getState().displayState.textDisplay.newRandomArticle) {
      fetch(wikiApiUrl, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          let dataQueryPages = data.query.pages;

          console.log(JSON.stringify(data, null, 2));
          /* 
        console.log(
          JSON.stringify(
            dataQueryPages[Object.keys(dataQueryPages)[0]],  // dataQueryPages[Object.keys(dataQueryPages)[0]].extract,
            null,
            2
          )
        );
  */
          let articleNoFormat =
            dataQueryPages[Object.keys(dataQueryPages)[0]].extract;

          //deleting all brackets and its content from article
          let articleExtract = articleNoFormat
            .replace(/\(.*\)/g, "")
            .replace(/\[.*\]/g, "")
            .replace(/\s\./g, ".")
            .replace(/\s,/g, ",")
            .replace(/\s+/g, " ");

          if (articleExtract.length < 370) {
            console.log("text to short, rendering again");
            // setWikiTitle("[Data loading...]");
            dispatch({ type: "WIKI_TITLE", payload: "[Data loading...]" });
            dispatch({ type: "WIKILINK_CLICKABLE_FALSE" });
            // return fetchWikiApi();
            return fetchingData();
          }

          // regex to exclude non-english characters
          let regexpForEngCharOnly = /^[\w\s'\\\^!"#\$%&\(\)\*\+,-\.\/:;<=>\?@\[\]\^_`\{\|\}~ ]*$/i;

          // let regexpForEngCharOnly = /^[\w\s'\\\^!"#\$%&\(\)\*\+,-\.\/:;<=>\?@\[\]\^_`\{\|\}~ ]*$/i;

          if (!regexpForEngCharOnly.test(articleExtract)) {
            console.log("characters out of english, rendering again");
            dispatch({ type: "WIKI_TITLE", payload: "[Data loading...]" });
            dispatch({ type: "WIKILINK_CLICKABLE_FALSE" });
            return fetchingData();
          }
          dispatch({ type: "MY_TEXT", payload: articleExtract });

          dispatch({
            type: "WIKI_TITLE",
            payload: dataQueryPages[Object.keys(dataQueryPages)[0]].title,
          });
          // focusTextArea.current.removeAttribute("disabled");
          dispatch({ type: "ENABLE_FOCUS_TEXT_AREA" });

          dispatch({ type: "RANDOM_ARTICLE_FALSE" });
          dispatch({ type: "WIKILINK_CLICKABLE_TRUE" });
          dispatch({ type: "WIKILINK_CLICKABLE_TRUE" });
        })

        .catch(() => {
          console.log("error fetching data");
          dispatch({ type: "MY_TEXT", payload: loremText });
          dispatch({
            type: "WIKI_TITLE",
            payload: "[Error accessing wikipedia - default text loaded]",
          });
          dispatch({ type: "ENABLE_FOCUS_TEXT_AREA" });
          dispatch({ type: "RANDOM_ARTICLE_FALSE" });
          dispatch({ type: "WIKILINK_CLICKABLE_FALSE" });
        });
    }
  }
};
