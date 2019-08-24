/*
This file conatins functions
needed to simplify the text
*/

var keynames; //Contains a list with the different keynamnes/rules in a specific order
var simplifiedtext; //Contains the text that is simplified

function simplify(text, feedback) {
  //Function to generate from the new version of stillett
  console.log("API.StilLett: Genererar förenklingsförslag för stillett2...");

  var url = "https://www.ida.liu.se/projects/scream/services/sapis/service/";

  var stilett2_data = JSON.stringify({ options: feedback, document: text });

  return jQuery.ajax({
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    type: "POST",
    url: url,
    data: stilett2_data,
    dataType: "json",
    success: function(resp) {
      console.log("Responsen:");
      console.log(resp);
      stillett_resp = resp._suggestions;
      console.log("Suggestions:");
      console.log(stillett_resp);
      makesimplification(text, stillett_resp);
    },
    error: function(xhr, textStatus, errorThrown) {
      calculatingStillett = false;
      console.log("API.StilLett2: ERROR", textStatus, errorThrown);
      endLoading();
      showNegativeFeedback("Något gick fel");
    }
  });
}

function activateSimplification() {
  var value = $("#show-simplification").attr("value");
  if (value == 0) {
    $("#show-simplification").slideDown("slow", function() {
      $("#show-simplification").attr("value", 1);
      sidenavControl("show-simplification");
    });
  } else {
    $("#show-simplification").slideUp("slow", function() {
      $("#show-simplification").attr("value", 0);
    });
  }
}

function createSimplification() {
  var currentText = $("#textarea").html();
  var removedSynonyms = removeSynonyms(currentText);
  $("#textarea").html(removedSynonyms);
  currentText = removedSynonyms;
  startLoading();
  var feedback = getStillettOptions();
  console.log("Dessa är checked...", feedback);

  $.when(simplify(currentText, feedback)).done(function() {
    $("#textarea").html(simplifiedtext);
    showFeedback("Texten är förenklad");
    endLoading();
  });
}

function getStillettOptions() {
  var opt_str = "Feedback(";
  var options = $("#stilletOptions")
    .children()
    .children("input");

  for (var i = 0; i < options.length; i++) {
    if (options[i].checked) {
      opt_str = opt_str + options[i].id + " ";
    } else {
      console.log("STILLETT: Unchecked", options[i]);
    }
  }
  // Array not null nor empty, cut off trailing whitespace
  if (!Array.isArray(options) || !array.length) {
    opt_str = opt_str.slice(0, -1) + ")";
  } else {
    opt_str += ")";
  }
  return opt_str;
}

function getSentences(text) {
  var items = text.match(/\S[^!?\.\t\n\r]+[!?\.]|[\S]+/g);
  return items;
}

/*This function collects all the key names in the dictionary created in the function simplify() and sorts them according to a certain priority*/
function getKeys(simpldict) {
  var keys = [];
  var svo = [];
  var pass2act = [];
  var prox = [];
  var split = [];
  var quoteInv = [];
  var itemsvo = "";
  var itempass2act = "";
  var itemprox = "";
  var itemsplit = "";
  var itemquoteInv = "";
  for (key in simpldict) {
    itemsvo = key.match(/-svo_[0-9]*/g);
    itempass2act = key.match(/-pass2act_[0-9]*/g);
    itemprox = key.match(/-prox_[0-9]*/g);
    itemsplit = key.match(/-split_[0-9]*/g);
    itemquoteInv = key.match(/-quoteInv_[0-9]*/g);
    if (itemsvo != null) {
      svo.push(itemsvo[0]);
    } else if (itempass2act != null) {
      pass2act.push(itempass2act[0]);
    } else if (itemprox != null) {
      prox.push(itemprox[0]);
    } else if (itemsplit != null) {
      split.push(itemsplit[0]);
    } else if (itemquoteInv != null) {
      quoteInv.push(itemquoteInv[0]);
    }
  }
  keys.push(svo);
  keys.push(pass2act);
  keys.push(prox);
  keys.push(split);
  keys.push(quoteInv);
  keynames = keys;
  console.log(keynames);
}

/*Simplify the sentences according to the prioritated list created in getKeys*/
function makesimplification(text, simpldict) {
  var sentenceArray = getSentences(text);
  var new_text = text;
  var sentsimpxist = false; //sentence simplification exist
  var sentsimpfound = false; //sentence simplification found
  for (var i = 0; i < sentenceArray.length; i++) {
    for (key in simpldict) {
      //This loop controls if there is a simplification for the sentence
      if (sentenceArray[i] == simpldict[key]["original"]) {
        sentsimpxist = true;
        break;
      }
    }
    if (sentsimpxist == true) {
      $.when(getKeys(simpldict)).done(function() {
        for (var rule = 0; rule < keynames.length; rule++) {
          var rulelist = keynames[rule];
          for (keyname in keynames[rule]) {
            var rulename = rulelist[keyname];
            if (sentenceArray[i] == simpldict[rulename]["original"]) {
              new_text = new_text.replace(
                sentenceArray[i],
                simpldict[rulename]["sent_suggestion"]
              );
              sentsimpfound = true;
              break;
            }
          }
          if (sentsimpfound == true) {
            break; //If a simplification has been found the loop needs to continue with the next sentence
          }
        }
      });
    }
    sentsimpxist = false; //Reset the values
    sentsimpfound = false;
  }
  simplifiedtext = new_text;
}
