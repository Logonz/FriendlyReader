/// Globals

// Libs
/* global $ */

// Variables
/* global _GS synOn */

// Functions
/* global updateSynonyms */

/// Classes
/* global */
/*
This file contains the functions
needed for creating summarization of text
*/
var friendly_reader_url =
  "https://www.ida.liu.se/projects/friendlyreader/api/sum";
var sentence_list = []; // Will contain all the sentences that the text has
var sentence_order = []; // Will contain the sentences importance order
var frvalue = 1;
var maxvalue = 0;
var textToSummary = "";

$(document).ready(function() {
  /*
    If the value on any of the sliders change
    this function is activated
  */
  $(".frRange").change(function() {
    id = $(this).attr("id");
    frvalue = document.getElementById(id).value;

    if (id == "sum-range") {
      // For the summarizer
      if (synOn == 1) {
      }
      startLoading();

      $.when(getSummary(textToSummary)).done(function() {
        writeSummary(sentence_order, sentence_list);

        endLoading();
        showFeedback("Texten är sammanfattad");
      });
    } else {
      // For the most important sentences
      textToSummary = removeFormatting(textToSummary);
      $.when(getSummary(textToSummary)).done(function() {
        writeSentences(sentence_list, sentence_order);
      });
    }
  });
});

// Showing and setting values to summerization-slider
function showSum() {
  var value = $("#show-sum").attr("value");
  if (value == 0) {
    $("#show-sum").slideDown("slow", function() {
      $("#show-sum").attr("value", 1);
      // Collecting the current text to use for summerization
      textToSummary = _GS.TextStore.text;
      // Removing html-tags
      textToSummary = removeFormatting(textToSummary);

      $.when(scream(textToSummary)).done(function() {
        // Setting the sliders max-value (number of sentences)
        document.getElementById("sum-range").max = text_sentences;
        maxvalue = text_sentences;
        console.log("FR - Summary -> Setting slider range");
        $("#slider").attr("max", maxvalue);
        $("#slider").val(maxvalue);

        // Setting the sliders current value to max (number of sentences)
        document.getElementById("sum-range").value = text_sentences;
      });
      sidenavControl("show-sum");
    });
  } else {
    $("#show-sum").slideUp("slow", function() {
      $("#show-sum").attr("value", 0);
    });
  }
}

//  Writes the most important senteces based on value from slider
function writeSentences(lst, order) {
  var str = "";
  for (var j = 0; j < frvalue; j++) {
    if (lst[order[j]] != undefined) {
      // Creating a list item for each sentence
      // in order based on their importance as a string
      str += "<li>" + lst[order[j]] + "</li>";
    }
  }
  // Placing the list items in an unordered list item
  str = "<ul>" + str + "</ul>";

  $("#display-sentences").html(str);
  document.getElementById("display-sentences").innerHTML = str;
}

// Creates a summary of the text based on the value of the slider
function writeSummary(order, list) {
  var summary = "";
  var max = frvalue;
  var placedSentences = 0;
  var counter = 0;

  while (placedSentences < max) {
    for (var i = 0; i < sentence_list.length; i++) {
      // Originally used maxvalue
      if (order[i] == counter) {
        counter += 1;
        if (i < max) {
          placedSentences += 1;
          summary += list[order[i]];
        }
      }
    }
  }
  // Save the simplified text to the store.
  console.log("FR - Summary -> Saving Summary text");
  _GS.TextStore.newText(summary);
  if (synOn) {
    summary = updateSynonyms();
  }
  $("#textarea").html(summary);
}

function getSummary(text) {
  console.log("API.FriendlyReader: Sammanfattar texten...");
  // FRIENDLY READER
  return jQuery.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    },
    type: "POST",
    url:
      friendly_reader_url +
      "?format=" +
      "html" +
      "&source=" +
      "string" +
      "&level=10",
    data: text,
    dataType: "json",
    success: function(resp) {
      console.log("API.FriendlyReader: Sammanfattning klar!");
      console.log(resp);
      console.log(JSON.stringify(resp));
      sentence_list = resp.sentences;
      sentence_order = resp.rankOrdering;
    },
    error: function(xhr, textStatus, errorThrown) {
      alert(xhr.responseText);
      endLoading();
      showNegativeFeedback("Något gick fel");
    }
  });
}
