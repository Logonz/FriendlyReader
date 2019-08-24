/// Globals
// Libs
/* global $ */
// Functions
/* global initializeStateMachine */
/// Classes
/* global  */
var org_document = ""; // This keeps the text in its original form

// globalDebug is used to simplify development
var globalDebug = true;

$(document).ready(function() {
  $(".navbar-options").hide();
  $("#analys-mode").hide();
  $("#text-container").hide();
  $("#text").hide();
  $(".sidenav-submenu").hide();
  // Navigering mellan valen i navbar
  $(".menu").click(function getNavbarOption(event) {
    var idShow = "#" + $(this).attr("id") + "-container";
    $(".menu").each(function() {
      if ($(this).is(":visible")) {
        var idHide = "#" + $(this).attr("id") + "-container";
        $(idHide).hide();
      }
    });
    $(idShow).show();
  });
});

// Nedan följer fristående funktioner

function sidenavControl(id) {
  $(".sidenav-submenu").each(function() {
    var value = $(this).attr("value");
    var element = $(this).attr("id");

    if (value == 1) {
      // Checks if sidemenu-option is open and not the chosen one
      if (element != id) {
        // Closes the open and changes its value
        $(this).slideUp("slow", function() {
          $(this).attr("value", 0);
        });
      }
    }
  });
}

function setOrgDocument(docu) {
  org_document = docu;
}

// Tar bort html-formattering för att kunna skicka en föfrågan till SAPIS
function removeFormatting(text) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = text;
  var clearedText = tmp.textContent || tmp.innerText;
  console.log(clearedText);
  return clearedText;
}

function newPage() {
  var inputtext = $("#inputtext")
    .val()
    .replace(/\n/g, "<br>");
  var firstpage = $("#first-page-container");
  var nextpage = $("#text-container");
  setOrgDocument(inputtext);

  $("#textarea").html(inputtext);
  $("#text").show();
  firstpage.fadeOut("slow", function() {
    nextpage.fadeIn("slow");
  });

  console.log("FR MOBX - Initializing Mobx State machine.");
  // Get the text from the webpage.
  var text = $("#textarea").html();
  text = removeFormatting(text);
  // Initialize the MobX State machine.
  initializeStateMachine(text);
}

function goBack() {
  var firstpage = $("#first-page-container");
  var nextpage = $("#text-container");
  nextpage.fadeOut("slow", function() {
    firstpage.fadeIn("slow");
  });
}

function showSentences() {
  var value = $("#show-sentences").attr("value");
  if (value == 0) {
    $("#show-sentences").slideDown("slow", function() {
      textToSummary = _GS.TextStore.text;
      $("#show-sentences").attr("value", 1);
      sidenavControl("show-sentences");
    });
  } else {
    $("#show-sentences").slideUp("slow", function() {
      $("#show-sentences").attr("value", 0);
    });
  }
}

function showInformation() {
  var value = $("#show-information").attr("value");
  if (value == 0) {
    $("#show-information").slideDown("slow", function() {
      var text = _GS.TextStore.text;
      scream(text);
      $("#show-information").attr("value", 1);
      sidenavControl("show-information");
    });
  } else {
    $("#show-information").slideUp("slow", function() {
      $("#show-information").attr("value", 0);
    });
  }
}

function showVisualization() {
  var value = $("#show-visualization").attr("value");
  if (value == 0) {
    $("#show-visualization").slideDown("slow", function() {
      var text = _GS.TextStore.text;
      scream(text);
      $("#show-visualization").attr("value", 1);
      sidenavControl("show-visualization");
    });
  } else {
    $("#show-visualization").slideUp("slow", function() {
      $("#show-visualization").attr("value", 0);
    });
  }
}

/* Shows positive feedback if a request to the server was successfull */
function showFeedback(text) {
  $("#pos").html(text);
  $("#pos")
    .css({ opacity: 0 })
    .animate({ opacity: 1 }, 800)
    .delay(1200);
  $("#pos")
    .css({ opacity: 1 })
    .animate({ opacity: 0 }, 800);
}

/* Shows negative feedback if a request to the server was unsuccessfull */
function showNegativeFeedback(text) {
  $("#neg").html(text);
  $("#neg")
    .css({ opacity: 0 })
    .animate({ opacity: 1 }, 800)
    .delay(1200);
  $("#neg")
    .css({ opacity: 1 })
    .animate({ opacity: 0 }, 800);
}

/* Resets the text to its original design and form */
function getOriginal() {
  _GS.TextStore.newText(org_document);
  $("#textarea").html(_GS.TextStore.text);
  synOn = 0;
  $("#sum-range").val("0");

  // Closes open options in sidenav
  sidenavControl("none");

  // Graphical adjustments
  $("#textarea").css("padding-left", "3%");
  $("#textarea").css("padding-right", "3%");
  $("#textarea").css("font-size", "18px");
  $("#textarea").css("font-family", "Arial");
  $("#textarea").css("line-height", "1.5");

  // Feedback to the user
  showFeedback("Texten är återställd");
}

/* Shows a loading-icon */
function startLoading() {
  $("#refresh").css("display", "block");
  $("#textarea").css("opacity", "0.3");
}

/* Hides a loading-icon */
function endLoading() {
  $("#textarea").css("opacity", "1");
  $("#refresh").css("display", "none");
}
