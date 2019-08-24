/*
This script contains the functions
that concern grafical adjustments
*/

//Gathered "static" variables
var lineheight = 1.5; //Variable for line space, that changes i moreLineSpace and lessLineSpace()
var lettersizenr = 14; //Variable for font size, that changes in smallerLetters() and biggerLetters()
var textpadding = 3; //Textarea padding, standard set to 3 (%) (30% is max)

function toggleSettings() {
  var settingsmenu = document.getElementById("getSettings");
  var settingsbutton = document.getElementsByClassName("settingsicon");
  if (settingsmenu.style.width === "250px") {
    /*Stänger menyn*/
    settingsmenu.style.width = "0px";
    //  settingsbutton[0].className = settingsbutton[0].className.replace(" pressed", "");
  } else {
    settingsmenu.style.width = "250px";
    //    settingsbutton[0].classList += " pressed";
  }
}

function closeSettings() {
  var settingsbutton = document.getElementsByClassName("settingsicon");
  //settingsbutton[0].className = settingsbutton[0].className.replace(" pressed", "");
  document.getElementById("getSettings").style.width = "0";
}

function changeLetterSize(size) {
  var lettersize = document.getElementById("textarea");
  var displaylettersize = document.getElementById("lettersize");
  if (size == "smaller") {
    if (lettersizenr > 12) {
      lettersizenr = lettersizenr - 2;
      //  displaylettersize.innerHTML = lettersizenr;
    }
  } else {
    if (lettersizenr < 20) {
      lettersizenr = lettersizenr + 2;
      //    displaylettersize.innerHTML = lettersizenr;
    }
  }
  lettersize.style.fontSize = lettersizenr + "pt";
}

function changeLineSpace(size) {
  var linespace = document.getElementById("textarea");
  var displaylinespace = document.getElementById("lineheight");
  if (size == "smaller") {
    if (lineheight >= 1.5) {
      lineheight = lineheight - 0.5;
      //  displaylinespace.innerHTML = lineheight;
    }
  } else {
    if (lineheight <= 2.5) {
      lineheight = lineheight + 0.5;
      //  displaylinespace.innerHTML = lineheight;
    }
  }
  linespace.style.lineHeight = lineheight;
}

function changeFont(font) {
  var text = document.getElementById("textarea");
  text.style.fontFamily = font;
}

function changeWidth(size) {
  //  var disp = $("#textwidth").html();
  //  var dispwid = parseInt(disp.substring(0, disp.length-1));
  if (size == "smaller") {
    if (textpadding < 30) {
      textpadding = textpadding + 3;
      changepadd = textpadding + "%";
      $("#textarea").css("padding-left", changepadd);
      $("#textarea").css("padding-right", changepadd);
      //    newdisp = dispwid - 10;
      //    $("#textwidth").html(newdisp + "%");
    }
  } else {
    if (textpadding > 3) {
      textpadding = textpadding - 3;
      changepadd = textpadding + "%";
      $("#textarea").css("padding-left", changepadd);
      $("#textarea").css("padding-right", changepadd);
      //    newdisp = dispwid + 10;
      //    $("#textwidth").html(newdisp + "%");
    }
  }
}
