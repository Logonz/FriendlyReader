/// Globals
/* global $ */
/* global Database */

var Mobx = Database.Mobx;

// SynonymStore
class SynonymStore {
  constructor() {
    // Metadata information, these are not observed for state-transition
    this.requesting = false;
    this.lastrequestdate = Date.now();
    this.lastfailed = false;
    this.options = {};

    // @observable data, this will fire on state transistions, it is made observable at the bottom of this document!
    this.data = {};

    // You can add reactions to specific events but only to observable variables, Google Mobx reaction for documentation.
    Mobx.reaction(() => this.data, data => console.log("SynonymStore: New data", this.data));

    // Does not work due to not being an observable
    // reaction(() => this.requesting, req => console.log("Requesting", this.requesting));
  }

  /**
 * Gets all the synonyms from the SAPIS API for the text passed to the function.
 *
 * Description TODO.
 *
 * @see  ApiRequests.js:SAPISRequest()
 * @link NODEJS:stores/utils/utils#SAPISRequest.
 *
 * @param {string} text The text to analye as a string, will use .join("") on array.
 * @param {function} _callback When the request is done, callback this function return true or false depending on how it went.
 *
 * @return {Object} Returns the suggestions, but also saves them at this.data in the class for the future.
 *
 * @decoration action
 */
  analyzeText(text, _callback) {
    // To keep the program from executing several requests at the same time for saftey
    if (!this.requesting) {
      this.requesting = true;
      // We only want synoynms here
      let stillettOptions = "Synonyms";

      // Function(text) for callback, this.data modifies the state after the data is recived
      Database.API.SAPISRequest(text, function(data) {
        // Callback function
        // data returns an object, if the request fails the object is filled with error data.
        if ("_synonym_suggestions" in data) {
          let suggestions = data["_synonym_suggestions"];

          // Convert the level parameter to float to enable sorting!
          for (const word in suggestions) {
            for (const id in suggestions[word]) {
              suggestions[word][id]["level"] = parseFloat(suggestions[word][id]["level"]);
            }
          };

          // Set the data for future use
          this.data = suggestions;

          // You can use this in the main.js to avoid doing too many calls, just copy it in the console and paste it through JSON.parse() to this.data instead of running this function
          console.log(JSON.stringify(suggestions));
          // Save some meta-data about the call
          this.options = stillettOptions;
          this.requesting = false;
          this.lastfailed = false;
          this.lastrequestdate = Date.now();

          // If a callback is provided, run it, returns true or false depending on success or failiure, to get the data use _GS.YOURNAMEHEREFORSYNONYMSTORE.data
          if (_callback) {
            _callback(true);
          }
        } else {
        // Save some meta-data about the call
          this.requesting = false;
          this.lastfailed = true;
          this.lastrequestdate = Date.now();
          console.error("SAPIS REQUEST ERROR: ", data);

          // Failiure callback
          if (_callback) {
            _callback(false);
          }
        }
        // .bind(this) is to keep the score for the function to this class
      }.bind(this),
      // The options to use
      stillettOptions);
      return this.data;
    }
    // If we are already requesting, return null
    return null;
  }

  /**
 * WRITE HERE.
 *
 * Description TODO.
 *
 * @param {string, array.join("")} text The text to analye as a string, will use .join("") on array.
 * @param {string} eventType jQuery event type to fire, such as click, mouseover ... etc.
 * @param {function} _callback Function that the eventType will call when it fires.
 * @param {string} cssClass (OPTIONAL) use a custom css class for the span. DEFAULT: "synonyms".
 *
 * @return {Object} Returns an array with each word and if synonyms exist they will insert a span into the word.
 *
 * @decoration action.
 */
  tagText(text, eventType, callback, cssClass) {
    if (!cssClass) { cssClass = "synonyms"; }
    // If raw string is sent in convert to an array for each word.
    if (typeof text === "string") { text = Database.utils.tokenizeText(text); }
    if (typeof text === "object") {
      console.log("tagText", this.data);

      // Clone the object, we don't want to modify the real textstore for this.
      let words = text.slice(0);

      if (callback) {
        // Unbind first, not to get two events firing with one click if ran multiple times.
        // could be a regular click event "click.synonyms" sets the namespace of the click to "synonyms"
        // could also be a regular mouseenter event "mouseenter.synonyms" sets the namespace of the mouseenter to "synonyms"
        $(document).unbind(eventType + "." + cssClass);
        $(document).on(eventType + "." + cssClass, "." + cssClass, callback);
      }

      for (const index in words) {
        // Get all synonyms for the word
        let synonyms = this.getSynonyms(words[index]);
        if (synonyms) {
          // Uses Jquery to create an object
          let span = $("<span>", { "data-word-id": index, "data-word": words[index], "class": cssClass }).text(words[index]);
          // Save it as HTML rather than an object, you can use Jquery parseHTML to convert it back!
          // The <div> stuff is needed because jquery is stupid, doesnt actaully get saved...
          words[index] = $("<div>").append(span.clone()).html();
        }
      }
      return words;
    }
    return null;
  }

  /**
 * WRITE HERE.
 *
 * Description TODO.
 *
 * @param {string, array.join("")} word The word you want synonyms for.
 * @param {integer} amount Amount of synonyms to fetch.
 *
 * @return {Object} Returns an array with each word and if synonyms exist they will insert a span into the word.
 *
 * @decoration action.
 */
  getSynonyms(word, amount) {
    // Standard return 3 synoynms
    if (!amount) { amount = 3; }
    if (word in this.data) {
      // console.log(this.data[word].slice().sort((a, b) => { return b.level - a.level; }).splice(0, amount));
      // Sort the data by level, slice() copies .sort() sort between two instances .splice(0, amount) take indexes 0 -> amount and return it as a list.
      return this.data[word].slice().sort((a, b) => { return b.level - a.level; }).splice(0, amount);
    }
    return null;
  }
};

// Decoration
Mobx.decorate(SynonymStore, {
  data: Mobx.observable,
  analyzeText: Mobx.action,
  synonyms: Mobx.action,
  tagText: Mobx.action
});
