/*
This file contains functions regarding synonyms
*/

function updateSynonyms(){
  let words = _GS.SynonymStore.tagText(_GS.TextStore.tokenizedText, "mouseenter", function(event) {
    let parentSpan = $(this);
    let intId = parseInt($(this).data("word-id"));
    let word = $(this).data("word");
    if (event.type === "mouseenter") {
      // Does the child already exist? Remove it to refresh the elements.
      if ($(this).children(".wordtooltip").length) {
        $(this).children(".wordtooltip").remove();
      }
      // Create the element if it doesn't exist.
      if (!$(this).children(".wordtooltip").length) {
        // Create the tooltip in code and Destroy the tooltip when leaving
        let div = $("<div>", { "class": "wordtooltip" }).on("mouseleave", function(event) {
          $(this).remove();
        });

        // This is the click handler callback.
        let _callback = function(event) {
          let id = $(this).data("word-id");
          let synonym = $(this).data("synonym");

          // Actually change the word
          _GS.TextStore.setWord(id, synonym);
          // You can just change the data but synonyms might not exist for the new word.
          parentSpan.attr("data-word", synonym);
          parentSpan.text(synonym);
          // Or you can just unwrap the span to remove all the data (Adviceable due to not having the synonyms for the new word)
          parentSpan.contents().unwrap();

          console.log("Clicked tooltip: Word-Id:", id, "Synonym:", synonym, "Event:", event, "this:", $(this));
        };

        // Get three synoynms for the word
        let synonyms = _GS.SynonymStore.getSynonyms(word, 3);
        // Create three elements, one for each synonym and set the text and click callback
        for (const index in synonyms) {
          div.append($("<div>", { "class": "word-wrapper", "data-word-id": intId, "data-synonym": synonyms[index].synonym }).text(synonyms[index].synonym).click(_callback));
        }
        // Append the wordtooltip to the synonyms span
        $(this).append(div);
      }
    }
  });
  return words;
}

var synOn = 0

// This function is activated from the side menu
function activateSynonyms(){
  var text = $("#textarea").html();
  text = removeFormatting(text);
  if (synOn == 0){
    startLoading();
    _GS = Database.initialize();
    $("#undo").click(function(){
      _GS.resetState();
      let words = updateSynonyms();
      console.log("TeST", words)
      $("#textarea").html(words.join(""));
    })
    _GS.addStore("TextStore", new TextStore(text));
    _GS.addStore("SynonymStore", new SynonymStore());

    let resp = _GS.SynonymStore.analyzeText(text, function(data){
      if(data) {
        let words = updateSynonyms();
        console.log("TeST", words)
        $("#textarea").html(words.join(""));
        endLoading();
      }
      else{
        //FEL!
      }
    });

    $("#synonyms-icon").css("color", "green");
    $(".hidden").css("opacity", "1");
    synOn = 1

  } else{
    newtext = removeSynonyms(text);
    $("#textarea").html(newtext);
    $("#synonyms-icon").css("color", "");
    $(".hidden").css("opacity", "0");
    synOn = 0
  }
};
