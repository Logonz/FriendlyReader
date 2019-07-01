var _GS = null;
var org_document = ""; //This keeps the text in its original form

$(document).ready(function () {

$(".navbar-options").hide();
$("#analys-mode").hide();
$("#text-container").hide();
$("#text").hide();
$(".sidenav-submenu").hide();
//Navigering mellan valen i navbar
$(".menu").click(function getNavbarOption(event){
  var idShow = "#" + $(this).attr("id") + "-container";
  $(".menu").each(function(){
    if ($(this).is(":visible")){
      var idHide = "#" + $(this).attr("id") + "-container";
      $(idHide).hide();
    };
  });
  $(idShow).show();
});


});

//Nedan följer fristående funktioner

function sidenavControl(){
  $(".sidenav-opt").each(function(){

    var value = $(this).attr("value");

    if (value == 1){
      var id = "#" + $(this).next().attr("id");
      console.log(id);
      $(id).slideUp( "slow", function() {
        $(this).attr("value") = 0;
  });
    }

  });

};

function setOrgDocument(docu) {
    org_document = docu;
}

// Tar bort html-formattering för att kunna skicka en föfrågan till SAPIS
function removeFormatting(text){
  var tmp = document.createElement("DIV");
  tmp.innerHTML = text;
  var clearedText = tmp.textContent||tmp.innerText;
  console.log(clearedText)
  return clearedText
};

function newPage() {
  //  var inputtext = document.getElementById("inputtext").value;
    var inputtext = $("#inputtext").val().replace(/\n/g, '<br>');
    console.log(inputtext)
    var firstpage = $("#first-page-container");
    var nextpage = $("#text-container");
    setOrgDocument(inputtext);

    $("#textarea").html(inputtext);
    $("#text").show();
    firstpage.hide();
    nextpage.show();
}

function showSentences(){
  sidenavControl();
  $("#show-sentences").slideToggle("slow", function(){
    textToSummary = $("#textarea").html();
    //Här ska något hända om man vill.
  })
};

function showInformation(){
  var text = $("#textarea").html();
  scream(text);
  $("#show-information").slideToggle("slow", function(){
  //Här ska saker hända
  });
};

function showVisualization(){
  var text = $("#textarea").html();
  scream(text);
  $("#show-visualization").slideToggle("slow", function(){
  });
};

function showFeedback(text){
  $("#pos").html(text);
  $("#pos").css({'opacity':0}).animate({'opacity':1}, 800).delay(1200);
  $("#pos").css({'opacity':1}).animate({'opacity':0}, 800);
};

function showNegativeFeedback(text){
  $("#neg").html(text);
  $("#neg").css({'opacity':0}).animate({'opacity':1}, 800).delay(1200);
  $("#neg").css({'opacity':1}).animate({'opacity':0}, 800);
}

function getOriginal(){
  $("#textarea").html(org_document);
  $("#sum-range").val("0");
  showFeedback("Texten är återställd");
};


function startLoading(){
  $("#refresh").css("display", "block");
  $("#textarea").css("opacity", "0.3");
}

function endLoading(){
  $("#textarea").css("opacity", "1");
  $("#refresh").css("display", "none");
}
