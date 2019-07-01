/// Globals
/* global Database */
var Mobx = Database.Mobx;

// TextStore
class TextStore {
  // The constructor takes a text as argument
  constructor(text) {
    // @observable
    this.tokenizedText = null;

    // Use local function to set the data.
    this.newText(text);

    console.log("TextStore Constructor: ", this.tokenizedText);
  }

  /**
  * if someone sets this.tokenizedText directly, run this function also. (this.tokenizedText = XXX).
  *
  * Description: see newText function.
  *
  * @param {string} text The text to set as a string, will use .join("") on array.
  *
  */
  set tokenizedText(text) {
    console.log("tokenizedText");
    this.newText(text);
  }

  /**
  * THIS IS NOT A FUNCTION usage "TextStore.text" just like a variable.
  *
  * Description TODO.
  *
  * @param {string} text The text to set as a string, will use .join("") on array.
  *
  * @decoration computed
  */
  get text() {
    return this.tokenizedText.join("");
  }

  /**
  * Enables TextStore.text = " hej jag heter david" TL;DR use like a variable.
  *
  * Description TODO.
  *
  * @param {string} text The text to set as a string, will use .join("") on array.
  *
  * @decoration computed
  */
  set text(text) {
    console.log("text");
    this.newText(text);
  }

  /**
  * The text to set as a string, will use .join("") on array.
  *
  * Description TODO.
  *
  * @param {string} text The text to set as a string, will use .join("") on array.
  *
  * @decoration action
  */
  newText(text) {
    console.log("newText");
    // If it's a string, split it into words
    if (typeof text === "string") {
      this.tokenizedText = Database.utils.tokenizeText(text);
    }
    // If it's an object just save it, PS. Keep in mind to have the same format array[index] = word
    if (typeof text === "object") {
      this.tokenizedText = text;
    }
  }

  // unused, but should work
  // @action
  setWord(id, text) {
    this.tokenizedText[id] = text;
  }

  // unused, but should work
  // @action
  getWord(id) {
    if (id in this.tokenizedText) {
      return this.tokenizedText[id];
    }
    return null;
  }
};

// Decoration
Mobx.decorate(TextStore, {
  tokenizedText: Mobx.observable,
  newText: Mobx.action,
  text: Mobx.computed,
  setWord: Mobx.action,
  getWord: Mobx.action
});
