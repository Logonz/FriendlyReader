/*
This file contains functions regarding synonyms
*/
/// Globals

// Libs
/* global $ */

// Functions
/* global startLoading endLoading showNegativeFeedback sidenavControl */

/// Classes

var _GS = null;
// This variable tells the rest of the application that the synonyms view is active.
var synOn = 0;

// Don't call SAPIS but instead use a string.
var synonymDebug = false;

function removeSynonyms(text) {
  /* Rensar bort alla word-tooltip */
  $(".word-wrapper").each(function() {
    var tooltip = $(this).parent();
    tooltip.remove();
  });
  /* Tar bort alla spans runt ord med synonymer */
  $(".synonyms")
    .contents()
    .unwrap();
  var text = $("#textarea").html();
  return text;
}

function updateSynonyms() {
  let words = _GS.SynonymStore.tagText(
    _GS.TextStore.tokenizedText,
    "mouseenter",
    function(event) {
      let parentSpan = $(this);
      let intId = parseInt($(this).data("word-id"));
      let word = $(this).data("word");
      if (event.type === "mouseenter") {
        // Does the child already exist? Remove it to refresh the elements.
        if ($(this).children(".wordtooltip").length) {
          $(this)
            .children(".wordtooltip")
            .remove();
        }
        // Create the element if it doesn't exist.
        if (!$(this).children(".wordtooltip").length) {
          // Create the tooltip in code and Destroy the tooltip when leaving
          let div = $("<div>", { class: "wordtooltip" }).on(
            "mouseleave",
            function(event) {
              $(this).remove();
            }
          );

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

            console.log(
              "Clicked tooltip: Word-Id:",
              id,
              "Synonym:",
              synonym,
              "Event:",
              event,
              "this:",
              $(this)
            );
          };

          // Get three synoynms for the word
          let synonyms = _GS.SynonymStore.getSynonyms(word, 3);
          // Create three elements, one for each synonym and set the text and click callback
          for (const index in synonyms) {
            div.append(
              $("<div>", {
                class: "word-wrapper",
                "data-word-id": intId,
                "data-synonym": synonyms[index].synonym
              })
                .text(synonyms[index].synonym)
                .click(_callback)
            );
          }
          // Append the wordtooltip to the synonyms span
          $(this).append(div);
        }
      }
    }
  );
  return words;
}

// This function is activated from the side menu
function activateSynonyms() {
  if (synOn === 0) {
    console.log("FR - synonyms -> Activating synonyms");
    // Start the loading UI
    startLoading();

    // Fetch the synonyms for the current text.
    _GS.SynonymStore.analyzeText(_GS.TextStore.text, function(data) {
      if (data) {
        let words = updateSynonyms();
        console.log("TeST", words);
        $("#textarea").html(words.join(""));
        endLoading();
      } else {
        console.log("Error analyzing text");
        showNegativeFeedback("Någonting gick fel");
        endLoading();
        // FEL!
      }
    });

    synOn = 1;
    sidenavControl("none");
  } else {
    newtext = removeSynonyms(_GS.TextStore.text);
    $("#textarea").html(newtext);
    synOn = 0;
    sidenavControl("none");
  }
}

// Old code, keeping it if someone wants it.
/* // This function is activated from the side menu
function activateSynonymsOLD() {
  var text = $("#textarea").html();
  text = removeFormatting(text);
  if (synOn == 0) {
    startLoading();
    _GS = Database.initialize();
    $("#undo").click(function() {
      _GS.resetState();
      let words = updateSynonyms();
      console.log("TeST", words);
      $("#textarea").html(words.join(""));
    });
    _GS.addStore("TextStore", new TextStore(text));
    _GS.addStore("SynonymStore", new SynonymStore());
    if (synonymDebug) {
      _GS.SynonymStore.data = JSON.parse(
        "{\"med\":[{\"synonym\":\"tillsammans\",\"level\":3.3},{\"synonym\":\"och\",\"level\":0.3},{\"synonym\":\"mot\",\"level\":0.1},{\"synonym\":\"använda\",\"level\":0},{\"synonym\":\"därmed\",\"level\":0},{\"synonym\":\"delta\",\"level\":0},{\"synonym\":\"samman\",\"level\":0.1},{\"synonym\":\"omfatta\",\"level\":0.1},{\"synonym\":\"inkludera\",\"level\":0.1},{\"synonym\":\"härmed\",\"level\":0}],\"över\":[{\"synonym\":\"kvar\",\"level\":3.5},{\"synonym\":\"ovan\",\"level\":4.2},{\"synonym\":\"ovanför\",\"level\":3.7},{\"synonym\":\"slut\",\"level\":4.3},{\"synonym\":\"under\",\"level\":0},{\"synonym\":\"dominera\",\"level\":0},{\"synonym\":\"tak\",\"level\":0},{\"synonym\":\"himmel\",\"level\":0}],\"av\":[{\"synonym\":\"bruten\",\"level\":3.4},{\"synonym\":\"från\",\"level\":3.2},{\"synonym\":\"itu\",\"level\":4},{\"synonym\":\"varav\",\"level\":0.4},{\"synonym\":\"därav\",\"level\":0}],\"bokstav\":[{\"synonym\":\"i\",\"level\":-0.1},{\"synonym\":\"ny\",\"level\":0},{\"synonym\":\"delta\",\"level\":-0.1},{\"synonym\":\"å\",\"level\":0},{\"synonym\":\"s\",\"level\":0},{\"synonym\":\"a\",\"level\":0.1},{\"synonym\":\"ö\",\"level\":0},{\"synonym\":\"b\",\"level\":0.1},{\"synonym\":\"m\",\"level\":0},{\"synonym\":\"c\",\"level\":0.1},{\"synonym\":\"beta\",\"level\":0},{\"synonym\":\"d\",\"level\":0.1},{\"synonym\":\"gemen\",\"level\":0},{\"synonym\":\"h\",\"level\":0.2},{\"synonym\":\"g\",\"level\":0.1},{\"synonym\":\"x\",\"level\":0.2},{\"synonym\":\"stava\",\"level\":0.3},{\"synonym\":\"p\",\"level\":0.1}],\"kalla\":[{\"synonym\":\"benämna\",\"level\":3.5},{\"synonym\":\"ropa\",\"level\":3.8},{\"synonym\":\"titulera\",\"level\":3.1},{\"synonym\":\"namn\",\"level\":0},{\"synonym\":\"tillkalla\",\"level\":0.3},{\"synonym\":\"återkalla\",\"level\":0},{\"synonym\":\"instämma\",\"level\":0}],\"vill\":[{\"synonym\":\"vilja\",\"level\":1},{\"synonym\":\"kräva\",\"level\":0},{\"synonym\":\"gärna\",\"level\":0},{\"synonym\":\"intresse\",\"level\":0.3},{\"synonym\":\"hoppas\",\"level\":0.2},{\"synonym\":\"be\",\"level\":0.1},{\"synonym\":\"undvika\",\"level\":0},{\"synonym\":\"önska\",\"level\":0},{\"synonym\":\"angelägen\",\"level\":0},{\"synonym\":\"lust\",\"level\":0.5},{\"synonym\":\"längta\",\"level\":0},{\"synonym\":\"ivrig\",\"level\":0.1},{\"synonym\":\"hungrig\",\"level\":0.1},{\"synonym\":\"impuls\",\"level\":0.2},{\"synonym\":\"benägen\",\"level\":0},{\"synonym\":\"ovilja\",\"level\":0.6},{\"synonym\":\"behaga\",\"level\":0.1},{\"synonym\":\"envis\",\"level\":0.1}],\"bruket\":[{\"synonym\":\"användning\",\"level\":4.2},{\"synonym\":\"drift\",\"level\":3.5},{\"synonym\":\"fabrik\",\"level\":3.4},{\"synonym\":\"hantering\",\"level\":3.2},{\"synonym\":\"praxis\",\"level\":4},{\"synonym\":\"sed\",\"level\":3.1},{\"synonym\":\"sedvänja\",\"level\":3.2},{\"synonym\":\"tillämpning\",\"level\":3.1},{\"synonym\":\"vana\",\"level\":3.3},{\"synonym\":\"språkbruk\",\"level\":0}],\"tydligt\":[{\"synonym\":\"klart\",\"level\":4.2},{\"synonym\":\"tydlig\",\"level\":3}],\"korrekt\":[{\"synonym\":\"precis\",\"level\":3.1},{\"synonym\":\"riktig\",\"level\":4.7},{\"synonym\":\"riktigt\",\"level\":5},{\"synonym\":\"rätt\",\"level\":4.8},{\"synonym\":\"sann\",\"level\":5},{\"synonym\":\"korrigera\",\"level\":0.2}],\"så\":[{\"synonym\":\"sådan\",\"level\":0},{\"synonym\":\"sålunda\",\"level\":0}],\"frågar\":[{\"synonym\":\"spörsmål\",\"level\":5},{\"synonym\":\"undra\",\"level\":3.1},{\"synonym\":\"ärende\",\"level\":4.5},{\"synonym\":\"om\",\"level\":0},{\"synonym\":\"fråga\",\"level\":0},{\"synonym\":\"höra\",\"level\":0},{\"synonym\":\"intervju\",\"level\":0},{\"synonym\":\"frågeställning\",\"level\":0},{\"synonym\":\"förhöra\",\"level\":0},{\"synonym\":\"huvudfråga\",\"level\":0},{\"synonym\":\"frågande\",\"level\":0},{\"synonym\":\"tillfråga\",\"level\":0},{\"synonym\":\"sakfråga\",\"level\":0},{\"synonym\":\"framtidsfråga\",\"level\":0},{\"synonym\":\"månne\",\"level\":0}],\"nu\":[{\"synonym\":\"genast\",\"level\":3.5},{\"synonym\":\"omedelbart\",\"level\":4.3},{\"synonym\":\"nu\",\"level\":1},{\"synonym\":\"ännu\",\"level\":0},{\"synonym\":\"numera\",\"level\":0.4},{\"synonym\":\"aktuell\",\"level\":0},{\"synonym\":\"hittills\",\"level\":0.2},{\"synonym\":\"nuvarande\",\"level\":0.2},{\"synonym\":\"akut\",\"level\":0.1},{\"synonym\":\"nutid\",\"level\":0.1},{\"synonym\":\"dagsläge\",\"level\":0},{\"synonym\":\"nuläge\",\"level\":0}],\"tillämpar\":[{\"synonym\":\"använda\",\"level\":3.3},{\"synonym\":\"begära\",\"level\":3.5},{\"synonym\":\"praktisera\",\"level\":4.2},{\"synonym\":\"utnyttja\",\"level\":3.4},{\"synonym\":\"tillämpning\",\"level\":0},{\"synonym\":\"tillämplig\",\"level\":0}],\"inte\":[{\"synonym\":\"ej\",\"level\":4.8},{\"synonym\":\"icke\",\"level\":4.8},{\"synonym\":\"ingen\",\"level\":0.6},{\"synonym\":\"utan\",\"level\":0.3},{\"synonym\":\"heller\",\"level\":0.3},{\"synonym\":\"ens\",\"level\":0.2},{\"synonym\":\"alls\",\"level\":0.3},{\"synonym\":\"utom\",\"level\":0},{\"synonym\":\"förneka\",\"level\":0},{\"synonym\":\"ingalunda\",\"level\":0.4}],\"vet\":[{\"synonym\":\"kunna\",\"level\":4},{\"synonym\":\"känna\",\"level\":0},{\"synonym\":\"höra\",\"level\":0},{\"synonym\":\"förstå\",\"level\":0},{\"synonym\":\"betyda\",\"level\":0.4},{\"synonym\":\"minnas\",\"level\":0.6},{\"synonym\":\"säker\",\"level\":0},{\"synonym\":\"undra\",\"level\":0.6},{\"synonym\":\"undersöka\",\"level\":0},{\"synonym\":\"medveten\",\"level\":0.3},{\"synonym\":\"besked\",\"level\":0.5},{\"synonym\":\"vetenskap\",\"level\":0},{\"synonym\":\"informera\",\"level\":0.5},{\"synonym\":\"erfara\",\"level\":0.5},{\"synonym\":\"vetande\",\"level\":0},{\"synonym\":\"nyfiken\",\"level\":0.2},{\"synonym\":\"vetskap\",\"level\":0.5},{\"synonym\":\"förtrogen\",\"level\":0},{\"synonym\":\"ovetande\",\"level\":0.3}],\"Men\":[{\"synonym\":\"skada\",\"level\":4.1},{\"synonym\":\"ändock\",\"level\":4},{\"synonym\":\"men\",\"level\":1},{\"synonym\":\"utan\",\"level\":0.4},{\"synonym\":\"dock\",\"level\":0.7},{\"synonym\":\"ändå\",\"level\":0},{\"synonym\":\"medan\",\"level\":0.3},{\"synonym\":\"däremot\",\"level\":0},{\"synonym\":\"emellertid\",\"level\":0.6},{\"synonym\":\"visserligen\",\"level\":0.2},{\"synonym\":\"fast\",\"level\":0.5},{\"synonym\":\"fastän\",\"level\":0}],\"många\":[{\"synonym\":\"få\",\"level\":0},{\"synonym\":\"flera\",\"level\":0},{\"synonym\":\"antal\",\"level\":0},{\"synonym\":\"tal\",\"level\":0},{\"synonym\":\"flertal\",\"level\":0},{\"synonym\":\"åtskillig\",\"level\":0},{\"synonym\":\"otalig\",\"level\":0},{\"synonym\":\"alltfler\",\"level\":0}],\"i\":[{\"synonym\":\"inom\",\"level\":3},{\"synonym\":\"genom\",\"level\":0.2},{\"synonym\":\"in\",\"level\":0.1},{\"synonym\":\"bland\",\"level\":0.1},{\"synonym\":\"innehålla\",\"level\":0},{\"synonym\":\"mitt\",\"level\":0.1},{\"synonym\":\"inne\",\"level\":0.1},{\"synonym\":\"inre\",\"level\":0},{\"synonym\":\"innefatta\",\"level\":0},{\"synonym\":\"inlägg\",\"level\":0},{\"synonym\":\"inuti\",\"level\":0.2},{\"synonym\":\"däri\",\"level\":0},{\"synonym\":\"inneboende\",\"level\":0}],\"gången\":[{\"synonym\":\"passage\",\"level\":4.8},{\"synonym\":\"stig\",\"level\":3.2},{\"synonym\":\"korridor\",\"level\":0},{\"synonym\":\"nedgång\",\"level\":0},{\"synonym\":\"undergång\",\"level\":0}],\"anger\":[{\"synonym\":\"nämna\",\"level\":4.1},{\"synonym\":\"röja\",\"level\":3},{\"synonym\":\"uppge\",\"level\":3.1}],\"trots\":[{\"synonym\":\"trotsa\",\"level\":0.3}],\"skall\":[{\"synonym\":\"akademi\",\"level\":4},{\"synonym\":\"skola\",\"level\":1},{\"synonym\":\"klass\",\"level\":0.4},{\"synonym\":\"högskola\",\"level\":0},{\"synonym\":\"gymnasium\",\"level\":0.4},{\"synonym\":\"grundskola\",\"level\":0.7},{\"synonym\":\"högstadium\",\"level\":0},{\"synonym\":\"realskola\",\"level\":0.4}],\"om\":[{\"synonym\":\"ifall\",\"level\":4},{\"synonym\":\"om\",\"level\":1},{\"synonym\":\"endast\",\"level\":0},{\"synonym\":\"bero\",\"level\":0.2},{\"synonym\":\"villkor\",\"level\":0.2},{\"synonym\":\"huruvida\",\"level\":0.5},{\"synonym\":\"därom\",\"level\":0},{\"synonym\":\"såvida\",\"level\":0},{\"synonym\":\"härom\",\"level\":0}],\"brukar\":[{\"synonym\":\"använda\",\"level\":4.3},{\"synonym\":\"hantera\",\"level\":3.2},{\"synonym\":\"nyttja\",\"level\":4.6},{\"synonym\":\"odla\",\"level\":3.1},{\"synonym\":\"bryta\",\"level\":0.3},{\"synonym\":\"bruk\",\"level\":0.1},{\"synonym\":\"bonde\",\"level\":0.1},{\"synonym\":\"jordbruk\",\"level\":0.2},{\"synonym\":\"jordbrukare\",\"level\":0.2}],\"man\":[{\"synonym\":\"herre\",\"level\":3.3},{\"synonym\":\"karl\",\"level\":4},{\"synonym\":\"man\",\"level\":1},{\"synonym\":\"folk\",\"level\":0.7},{\"synonym\":\"far\",\"level\":0.1},{\"synonym\":\"make\",\"level\":0.1},{\"synonym\":\"gubbe\",\"level\":0.3},{\"synonym\":\"manlig\",\"level\":0.2},{\"synonym\":\"farbror\",\"level\":0.2},{\"synonym\":\"yngling\",\"level\":0.3}],\"vara\":[{\"synonym\":\"befinna\",\"level\":4.3},{\"synonym\":\"bestå\",\"level\":3},{\"synonym\":\"existera\",\"level\":3.9},{\"synonym\":\"finnas\",\"level\":3.2},{\"synonym\":\"produkt\",\"level\":5},{\"synonym\":\"stå\",\"level\":0},{\"synonym\":\"hålla\",\"level\":0},{\"synonym\":\"leva\",\"level\":0.5},{\"synonym\":\"utgöra\",\"level\":0},{\"synonym\":\"situation\",\"level\":0.1},{\"synonym\":\"förekomma\",\"level\":0},{\"synonym\":\"tillstånd\",\"level\":0},{\"synonym\":\"parti\",\"level\":0.1},{\"synonym\":\"artikel\",\"level\":0},{\"synonym\":\"uppträda\",\"level\":0},{\"synonym\":\"märke\",\"level\":0},{\"synonym\":\"faktisk\",\"level\":0},{\"synonym\":\"långvarig\",\"level\":0},{\"synonym\":\"varaktig\",\"level\":0.1}],\"visningen\":[{\"synonym\":\"demonstration\",\"level\":3.3},{\"synonym\":\"föreställning\",\"level\":4},{\"synonym\":\"show\",\"level\":3.2},{\"synonym\":\"utställning\",\"level\":4.1}],\"ofta\":[{\"synonym\":\"mycket\",\"level\":3.5},{\"synonym\":\"vanligtvis\",\"level\":3.1},{\"synonym\":\"vanlig\",\"level\":0.2},{\"synonym\":\"ibland\",\"level\":0.7},{\"synonym\":\"sällan\",\"level\":0},{\"synonym\":\"flitig\",\"level\":0.1}],\"skrivas\":[{\"synonym\":\"anteckna\",\"level\":4},{\"synonym\":\"berätta\",\"level\":4},{\"synonym\":\"författa\",\"level\":3.5},{\"synonym\":\"notera\",\"level\":3.1},{\"synonym\":\"uppge\",\"level\":4},{\"synonym\":\"kort\",\"level\":0.1},{\"synonym\":\"skrift\",\"level\":0.2},{\"synonym\":\"kontor\",\"level\":-0.1},{\"synonym\":\"sekreterare\",\"level\":0},{\"synonym\":\"tavla\",\"level\":0},{\"synonym\":\"skriftlig\",\"level\":0.1},{\"synonym\":\"tillskriva\",\"level\":0.3},{\"synonym\":\"penna\",\"level\":0.2},{\"synonym\":\"dagbok\",\"level\":0.1},{\"synonym\":\"skribent\",\"level\":0.2},{\"synonym\":\"rista\",\"level\":0.3},{\"synonym\":\"skrivare\",\"level\":0.1},{\"synonym\":\"oskriven\",\"level\":0.1},{\"synonym\":\"skrivande\",\"level\":0.2},{\"synonym\":\"underteckna\",\"level\":0.6}],\"skriver\":[{\"synonym\":\"anteckna\",\"level\":4},{\"synonym\":\"berätta\",\"level\":4},{\"synonym\":\"författa\",\"level\":3.5},{\"synonym\":\"notera\",\"level\":3.1},{\"synonym\":\"uppge\",\"level\":4},{\"synonym\":\"kort\",\"level\":0.1},{\"synonym\":\"skrift\",\"level\":0.2},{\"synonym\":\"kontor\",\"level\":-0.1},{\"synonym\":\"sekreterare\",\"level\":0},{\"synonym\":\"tavla\",\"level\":0},{\"synonym\":\"skriftlig\",\"level\":0.1},{\"synonym\":\"tillskriva\",\"level\":0.3},{\"synonym\":\"penna\",\"level\":0.2},{\"synonym\":\"dagbok\",\"level\":0.1},{\"synonym\":\"skribent\",\"level\":0.2},{\"synonym\":\"rista\",\"level\":0.3},{\"synonym\":\"skrivare\",\"level\":0.1},{\"synonym\":\"oskriven\",\"level\":0.1},{\"synonym\":\"skrivande\",\"level\":0.2},{\"synonym\":\"underteckna\",\"level\":0.6}],\"sista\":[{\"synonym\":\"slutlig\",\"level\":3},{\"synonym\":\"slut\",\"level\":0.5},{\"synonym\":\"sista\",\"level\":0.4},{\"synonym\":\"kö\",\"level\":0}],\"ganska\":[{\"synonym\":\"nästan\",\"level\":4},{\"synonym\":\"någorlunda\",\"level\":3.7},{\"synonym\":\"relativt\",\"level\":3.6},{\"synonym\":\"typ\",\"level\":3},{\"synonym\":\"tämligen\",\"level\":4.7},{\"synonym\":\"ungefär\",\"level\":3.4},{\"synonym\":\"bra\",\"level\":0.2},{\"synonym\":\"rätt\",\"level\":0}],\"ser\":[{\"synonym\":\"betrakta\",\"level\":4.2},{\"synonym\":\"flyga\",\"level\":4.3},{\"synonym\":\"kolla\",\"level\":3.5},{\"synonym\":\"observera\",\"level\":5},{\"synonym\":\"skåda\",\"level\":5},{\"synonym\":\"titta\",\"level\":3.4},{\"synonym\":\"uppmärksamma\",\"level\":3.3},{\"synonym\":\"visa\",\"level\":0.7},{\"synonym\":\"läsa\",\"level\":0},{\"synonym\":\"öga\",\"level\":0},{\"synonym\":\"blick\",\"level\":0.1},{\"synonym\":\"märka\",\"level\":0},{\"synonym\":\"syn\",\"level\":0.2},{\"synonym\":\"synas\",\"level\":0.6},{\"synonym\":\"sikt\",\"level\":0.1},{\"synonym\":\"utseende\",\"level\":0.1},{\"synonym\":\"utsikt\",\"level\":0.1},{\"synonym\":\"synlig\",\"level\":0.1},{\"synonym\":\"vittna\",\"level\":0.4},{\"synonym\":\"skymta\",\"level\":0.5},{\"synonym\":\"horisont\",\"level\":0.1},{\"synonym\":\"bevittna\",\"level\":0.5},{\"synonym\":\"skönja\",\"level\":0},{\"synonym\":\"åskådare\",\"level\":0},{\"synonym\":\"blind\",\"level\":0},{\"synonym\":\"si\",\"level\":0},{\"synonym\":\"återse\",\"level\":0},{\"synonym\":\"visuell\",\"level\":0.1},{\"synonym\":\"synbar\",\"level\":0.1}],\"ett\":[{\"synonym\":\"ett\",\"level\":3.2},{\"synonym\":\"någon\",\"level\":4},{\"synonym\":\"själv\",\"level\":0},{\"synonym\":\"första\",\"level\":0},{\"synonym\":\"samma\",\"level\":0.4},{\"synonym\":\"viss\",\"level\":0.3},{\"synonym\":\"enkel\",\"level\":0.3},{\"synonym\":\"enskild\",\"level\":0.3},{\"synonym\":\"ensam\",\"level\":0.1},{\"synonym\":\"enhet\",\"level\":-0.1},{\"synonym\":\"enstaka\",\"level\":0.1}],\"olika\":[{\"synonym\":\"annorlunda\",\"level\":3.4},{\"synonym\":\"avvikande\",\"level\":3.5},{\"synonym\":\"variera\",\"level\":0.1},{\"synonym\":\"skild\",\"level\":0.3},{\"synonym\":\"olika\",\"level\":0},{\"synonym\":\"olikhet\",\"level\":0.1}],\"det\":[{\"synonym\":\"en\",\"level\":0.2},{\"synonym\":\"att\",\"level\":0.2},{\"synonym\":\"denna\",\"level\":0.4}],\"och\":[{\"synonym\":\"samt\",\"level\":4.3},{\"synonym\":\"också\",\"level\":0},{\"synonym\":\"både\",\"level\":0},{\"synonym\":\"såväl\",\"level\":0}],\"som\":[{\"synonym\":\"såsom\",\"level\":4},{\"synonym\":\"roll\",\"level\":0.1},{\"synonym\":\"fungera\",\"level\":0.1},{\"synonym\":\"liksom\",\"level\":0.2}],\"skrivs\":[{\"synonym\":\"anteckna\",\"level\":4},{\"synonym\":\"berätta\",\"level\":4},{\"synonym\":\"författa\",\"level\":3.5},{\"synonym\":\"notera\",\"level\":3.1},{\"synonym\":\"uppge\",\"level\":4},{\"synonym\":\"kort\",\"level\":0.1},{\"synonym\":\"skrift\",\"level\":0.2},{\"synonym\":\"kontor\",\"level\":-0.1},{\"synonym\":\"sekreterare\",\"level\":0},{\"synonym\":\"tavla\",\"level\":0},{\"synonym\":\"skriftlig\",\"level\":0.1},{\"synonym\":\"tillskriva\",\"level\":0.3},{\"synonym\":\"penna\",\"level\":0.2},{\"synonym\":\"dagbok\",\"level\":0.1},{\"synonym\":\"skribent\",\"level\":0.2},{\"synonym\":\"rista\",\"level\":0.3},{\"synonym\":\"skrivare\",\"level\":0.1},{\"synonym\":\"oskriven\",\"level\":0.1},{\"synonym\":\"skrivande\",\"level\":0.2},{\"synonym\":\"underteckna\",\"level\":0.6}],\"Svenska\":[{\"synonym\":\"svenska\",\"level\":0.4}],\"Kanske\":[{\"synonym\":\"antagligen\",\"level\":3.4},{\"synonym\":\"eventuellt\",\"level\":4},{\"synonym\":\"måhända\",\"level\":4},{\"synonym\":\"möjligen\",\"level\":4.6},{\"synonym\":\"möjligtvis\",\"level\":4.6},{\"synonym\":\"nog\",\"level\":3},{\"synonym\":\"troligen\",\"level\":4.2},{\"synonym\":\"kunna\",\"level\":0.2},{\"synonym\":\"försöka\",\"level\":0},{\"synonym\":\"möjlig\",\"level\":0},{\"synonym\":\"förmodligen\",\"level\":0},{\"synonym\":\"eventuell\",\"level\":0},{\"synonym\":\"trolig\",\"level\":0.1}],\"regeln\":[{\"synonym\":\"bestämmelse\",\"level\":4.8},{\"synonym\":\"föreskrift\",\"level\":3.6},{\"synonym\":\"förordning\",\"level\":4.1},{\"synonym\":\"lag\",\"level\":3.1},{\"synonym\":\"norm\",\"level\":4.2},{\"synonym\":\"reglera\",\"level\":0.1},{\"synonym\":\"huvudregel\",\"level\":0.5},{\"synonym\":\"regelsystem\",\"level\":0.2},{\"synonym\":\"spelregel\",\"level\":0}],\"avvikande\":[{\"synonym\":\"dra\",\"level\":4},{\"synonym\":\"sticka\",\"level\":4},{\"synonym\":\"avvikelse\",\"level\":0.3},{\"synonym\":\"avvikande\",\"level\":0.3},{\"synonym\":\"frångå\",\"level\":0}],\"skrivsätt\":[{\"synonym\":\"formulering\",\"level\":3.2}],\"markeras\":[{\"synonym\":\"betona\",\"level\":3.3},{\"synonym\":\"märka\",\"level\":3.1},{\"synonym\":\"poängtera\",\"level\":3},{\"synonym\":\"understryka\",\"level\":4.4},{\"synonym\":\"markering\",\"level\":0.4}],\"den\":[{\"synonym\":\"en\",\"level\":0.2},{\"synonym\":\"att\",\"level\":0.2},{\"synonym\":\"denna\",\"level\":0.4}],\"helt\":[{\"synonym\":\"alldeles\",\"level\":4.3},{\"synonym\":\"fullkomligt\",\"level\":4.6},{\"synonym\":\"fullständig\",\"level\":4},{\"synonym\":\"fullständigt\",\"level\":4},{\"synonym\":\"fullt\",\"level\":4.1},{\"synonym\":\"total\",\"level\":3},{\"synonym\":\"totalt\",\"level\":4.5}],\"just\":[{\"synonym\":\"exakt\",\"level\":4},{\"synonym\":\"hederlig\",\"level\":3.6},{\"synonym\":\"hygglig\",\"level\":4},{\"synonym\":\"nyligen\",\"level\":4.5},{\"synonym\":\"nyss\",\"level\":4.1},{\"synonym\":\"precis\",\"level\":4.6},{\"synonym\":\"rättvis\",\"level\":4.2},{\"synonym\":\"själv\",\"level\":0},{\"synonym\":\"noggrann\",\"level\":0.1}],\"förvånad\":[{\"synonym\":\"slå\",\"level\":0},{\"synonym\":\"förvånad\",\"level\":0},{\"synonym\":\"förvåning\",\"level\":0},{\"synonym\":\"förvånande\",\"level\":0},{\"synonym\":\"överraska\",\"level\":0}],\"slag\":[{\"synonym\":\"art\",\"level\":4},{\"synonym\":\"kamp\",\"level\":3.4},{\"synonym\":\"kategori\",\"level\":3},{\"synonym\":\"klass\",\"level\":4.3},{\"synonym\":\"krig\",\"level\":4.3},{\"synonym\":\"smäll\",\"level\":3.1},{\"synonym\":\"sort\",\"level\":4.1},{\"synonym\":\"strid\",\"level\":3.4},{\"synonym\":\"stöt\",\"level\":3},{\"synonym\":\"typ\",\"level\":4.1},{\"synonym\":\"form\",\"level\":0.2},{\"synonym\":\"variant\",\"level\":0.1},{\"synonym\":\"kön\",\"level\":0},{\"synonym\":\"ras\",\"level\":0.2},{\"synonym\":\"slagfält\",\"level\":0}],\"alltså\":[{\"synonym\":\"nämligen\",\"level\":4},{\"synonym\":\"således\",\"level\":4.6},{\"synonym\":\"ju\",\"level\":0},{\"synonym\":\"följaktligen\",\"level\":0}],\"enkelt\":[{\"synonym\":\"lätt\",\"level\":5}],\"är\":[{\"synonym\":\"befinna\",\"level\":4.3},{\"synonym\":\"bestå\",\"level\":3},{\"synonym\":\"existera\",\"level\":3.9},{\"synonym\":\"finnas\",\"level\":3.2},{\"synonym\":\"produkt\",\"level\":5},{\"synonym\":\"stå\",\"level\":0},{\"synonym\":\"hålla\",\"level\":0},{\"synonym\":\"leva\",\"level\":0.5},{\"synonym\":\"utgöra\",\"level\":0},{\"synonym\":\"situation\",\"level\":0.1},{\"synonym\":\"förekomma\",\"level\":0},{\"synonym\":\"tillstånd\",\"level\":0},{\"synonym\":\"parti\",\"level\":0.1},{\"synonym\":\"artikel\",\"level\":0},{\"synonym\":\"uppträda\",\"level\":0},{\"synonym\":\"märke\",\"level\":0},{\"synonym\":\"faktisk\",\"level\":0},{\"synonym\":\"långvarig\",\"level\":0},{\"synonym\":\"varaktig\",\"level\":0.1}],\"säga\":[{\"synonym\":\"berätta\",\"level\":3},{\"synonym\":\"framföra\",\"level\":4.3},{\"synonym\":\"prata\",\"level\":3.1},{\"synonym\":\"tala\",\"level\":3.8},{\"synonym\":\"uppge\",\"level\":5},{\"synonym\":\"uttala\",\"level\":3},{\"synonym\":\"yttra\",\"level\":4.7},{\"synonym\":\"svara\",\"level\":0},{\"synonym\":\"typ\",\"level\":0},{\"synonym\":\"liksom\",\"level\":0},{\"synonym\":\"nämna\",\"level\":0},{\"synonym\":\"konstatera\",\"level\":0},{\"synonym\":\"uttrycka\",\"level\":0},{\"synonym\":\"sagd\",\"level\":0},{\"synonym\":\"meddela\",\"level\":0},{\"synonym\":\"påpeka\",\"level\":0},{\"synonym\":\"påstå\",\"level\":0},{\"synonym\":\"framställa\",\"level\":0},{\"synonym\":\"framhålla\",\"level\":0},{\"synonym\":\"föredra\",\"level\":0},{\"synonym\":\"medge\",\"level\":0},{\"synonym\":\"antyda\",\"level\":0},{\"synonym\":\"anföra\",\"level\":0},{\"synonym\":\"citera\",\"level\":0},{\"synonym\":\"protestera\",\"level\":0},{\"synonym\":\"replik\",\"level\":0},{\"synonym\":\"fras\",\"level\":0},{\"synonym\":\"svära\",\"level\":0},{\"synonym\":\"invända\",\"level\":0},{\"synonym\":\"förutsäga\",\"level\":0},{\"synonym\":\"motsäga\",\"level\":0}]}"
      );
      let words = updateSynonyms();
      console.log("TeST", words);
      $("#textarea").html(words.join(""));
      endLoading();
    } else {
      let resp = _GS.SynonymStore.analyzeText(text, function(data) {
        if (data) {
          let words = updateSynonyms();
          console.log("TeST", words);
          $("#textarea").html(words.join(""));
          endLoading();
        } else {
          console.log("Error analyzing text");
          showNegativeFeedback("Någonting gick fel");
          var localSynonyms = loadSynonymsXML();
          console.log(localSynonyms);
          _GS.SynonymStore.data = localSynonyms;
          let words = updateSynonyms();
          console.log("TeST", words);
          $("#textarea").html(words.join(""));
          endLoading();
          // FEL!
        }
      });
    }
    synOn = 1;
    sidenavControl("none");
  } else {
    newtext = removeSynonyms(text);
    $("#textarea").html(newtext);
    synOn = 0;
    sidenavControl("none");
  }
} */

function loadSynonymsXML() {
  /*
    Öppnar XML-fil och returnerar innehållet i ett objekt.
  */
  var xmlDict = [];
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      var xml = xmlhttp.responseXML;
      var synonyms = xml.getElementsByTagName("syn");

      for (var i = 0; i < synonyms.length; i++) {
        // Gör variabler för att återanvända dem i kortare kod nedan
        var _w1 = synonyms[i].getElementsByTagName("w1")[0].childNodes[0];
        var _w2 = synonyms[i].getElementsByTagName("w2")[0].childNodes[0];

        // Kollar att alla ord i lexikonet har synonymer till sig
        if (_w1 === undefined || _w2 === undefined) {
          console.log("saknas text i:", _w1, _w2);
        }
        // Gör variabler för att korta ner koden nedan
        var w1 = _w1.nodeValue;
        var w2 = _w2.nodeValue;
        var level = synonyms[i].getAttribute("level");

        // Synonymerna läggs in i ett dictionary
        if (w1 in xmlDict) {
          // xmlDict[w1].push([level, w2]);
          // console.log(xmlDict[w1]);
          if (Array.isArray(xmlDict[w1]) == false) {
            xmlDict[w1] = [];
          }
          xmlDict[w1].push({ level: parseFloat(level), synonym: w2 });
        } else {
          xmlDict[w1] = [];
          xmlDict[w1].push({ level: parseFloat(level), synonym: w2 });
        }
        // xmlDict[w1].push({"level": parseFloat(level), "synonym": w2});
      }
      console.log("CLIENT.Synonyms: Inläsning klar!");
    }
  };
  xmlhttp.open("GET", "synpairs_emojis.xml", false);
  xmlhttp.send();
  console.log("CLIENT.Synonyms: Läser in synonymlexikon...");
  return xmlDict;
}
