/// Globals

// Libs
/* global Database $ */

// Variables
/* global globalDebug synOn */

// Functions
/* global newPage updateSynonyms */

/// Classes
/* global TextStore SynonymStore */

/// Exports //Does not seem to work with eslint? Strange...
/* exported initializeStateMachine */

// MobX State Machine
var _GS = null;

function initializeStateMachine(text) {
  // Database comes from the MobX-state library
  _GS = Database.initialize();
  _GS.addStore("TextStore", new TextStore(text));
  _GS.addStore("SynonymStore", new SynonymStore());

  // Should we really set the undo functionality here?
  $("#undo").click(function() {
    _GS.resetState();
    if (synOn) {
      // Synonyms on
      console.log("FR - Undo -> Synonym Undo ran.");
      let words = updateSynonyms();
      $("#textarea").html(words.join(""));
    } else {
      // Default undo
      console.log("FR - Undo -> Default Undo ran.");
      $("#textarea").html(_GS.TextStore.text);
    }
  });
}

// Quickly move from first page to main page.
function debugRun() {
  $("#inputtext").val(
    "Skrivregler av olika slag är det många som frågar om just nu. Titti Almskoug Eriksson är förvånad över att många tycks tro att ett datum, som 11 juni, skall skrivas med kolon och ordningstalets sista bokstav, alltså ”den 11:e juni”. Javisst ser man detta skrivsätt ganska ofta, trots att Språknämndens Svenska skrivregler (2000) tydligt anger att ordningstal inte markeras med kolon och slutbokstav i datumuppgifter. Kanske är det avvikande bruket helt enkelt ett fall av det som språkvetare brukar kalla hyperkorrektion. Det vill säga att den som skriver datum med kolon och slutbokstav vet att ordningstal ofta skrivs så (den 4:e gången, den 2:a visningen) och alltså tillämpar den regeln även på datumangivelse. Men det är alltså inte korrekt. (Den) 11 juni skall det vara."
  );
  newPage();
}

if (globalDebug) {
  debugRun();
}
