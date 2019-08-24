/*
This file contains functions
that gets the values for the graph/visualization
*/
var text_sentences = 0;

function scream(text) {
  console.log("API.Scream: Beräknar textkomplexitet...");
  startLoading();

  var url = "https://www.ida.liu.se/projects/scream/services/sapis/service/";
  var data = JSON.stringify({
    options: "LexicalMetrics()\tSurfaceMetrics()\tStructuralMetrics()",
    document: text
  });

  return jQuery.ajax({
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    type: "POST",
    url: url,
    data: data,
    dataType: "json",
    success: function(resp) {
      console.log("API.Scream: Beräkning klar!");
      drawGraphs(resp);
      getInformation(resp);
      text_sentences = parseFloat(resp._numberOfSentences);
      console.log("Funktioner körda!");
      endLoading();
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log("API.Scream: ERROR Något gick fel, se JS-logg.");
      console.log(xhr.responseText);
      endLoading();
      showNegativeFeedback("Någonting gick fel");
    }
  });
}

function getInformation(resp) {
  var sentences = parseFloat(resp._numberOfSentences);
  var words = parseFloat(resp._numberOfWords);
  var tokens = parseFloat(resp._numberOfTokens);
  var lix = parseFloat(resp._lixValue);
  var ovix = parseFloat(resp._ovixValue);
  $("#numb_sentences").html(sentences);
  $("#numb_words").html(words);
  $("#numb_tokens").html(tokens);
  $("#lix").html(lix);
  $("#ovix").html(ovix);
}

function drawGraphs(resp) {
  //All these aren't relevant for this website, and there possibly needs new values
  var sweVocNorm = 0.407;
  var ovixNorm = 61;
  var lixNorm = 48.86;
  var avgSentNorm = 16.924;
  var avgWordNorm = 5.476;
  var rSubClausesNorm = 0.426;
  var avgSentDepthNorm = 8.281;

  var sweVoc = parseFloat(resp._SweVocTotal);
  var ovix = parseFloat(resp._ovixValue);
  var lix = parseFloat(resp._lixValue);
  var avgSent = parseFloat(resp._avgSentenceLength);
  var avgWord = parseFloat(resp._avgWordLength);
  var rSubClauses = parseFloat(resp._ratioSubClauses);
  var avgSentDepth = parseFloat(resp._avgSentenceDepth);

  var numberOfWords = parseFloat(resp._numberOfWords);

  var ratioSweVocTotal = parseFloat(resp._SweVocTotal);

  var totalVerbArity = parseFloat(totalVerbArity);

  var avgNominalPostmodifiers = parseFloat(resp._avgNominalPostmodifiers);
  var avgNominalPremodifiers = parseFloat(resp._avgNominalPremodifiers);
  var avgPrepComp = parseFloat(resp._avgPrepComp);
  var avgSentenceDepth = parseFloat(resp._avgSentenceDepth);
  var avgSentenceLength = parseFloat(resp._avgSentenceLength);
  var avgWordsPerClause = parseFloat(resp._avgWordsPerClause);
  var dep_ET = parseFloat(resp._depTypeOccurrences.ET) / numberOfWords;
  var dep_IP = parseFloat(resp._depTypeOccurrences.IP) / numberOfWords;
  var dep_SS = parseFloat(resp._depTypeOccurrences.SS) / numberOfWords;
  var meanDepDistanceDependent = parseFloat(resp._meanDepDistanceDependent);
  var meanDepDistanceSentence = parseFloat(resp._meanDepDistanceSentence);
  var nrValue = 0; /* #Nominal ratio (???) */
  var pos_MAD = parseFloat(resp._posOccurrences.MAD) / numberOfWords;
  var dep_UA = parseFloat(resp._depTypeOccurrences.UA) / numberOfWords;
  var pos_SN = parseFloat(resp._posOccurrences.SN) / numberOfWords;
  var pos_VB = parseFloat(resp._posOccurrences.VB) / numberOfWords;
  var verbArity2 = parseFloat(resp._verbArities[2]) / totalVerbArity;
  var dep_IK = parseFloat(resp._depTypeOccurrences.IK) / numberOfWords;
  var dep_IT = parseFloat(resp._depTypeUnigramProbs.IT);
  var pos_MID = parseFloat(resp._posOccurrences.MID) / numberOfWords;
  var dep_AT = parseFloat(resp._depTypeOccurrences.AT) / numberOfWords;
  var pos_JJ = parseFloat(resp._posOccurrences.JJ) / numberOfWords;
  var ratioRightDeps = parseFloat(resp._ratioRightDeps);
  var dep_AN = parseFloat(resp._depTypeOccurrences.AN) / numberOfWords;
  var dep_IR = parseFloat(resp._depTypeOccurrences.IR) / numberOfWords;
  var dep_JR = parseFloat(resp._depTypeOccurrences.JR) / numberOfWords;
  var pos_PAD = parseFloat(resp._posOccurrences.PAD) / numberOfWords;
  var dep_F = parseFloat(resp._depTypeOccurrences["+F"] / numberOfWords);
  var dep_MS = parseFloat(resp._depTypeOccurrences.MS) / numberOfWords;
  var pos_KN = parseFloat(resp._posOccurrences.KN) / numberOfWords;
  var ratioVerbalRoots = parseFloat(resp._ratioVerbalRoots) / totalVerbArity;
  var dep_IC = parseFloat(resp._depTypeOccurrences.IC) / numberOfWords;
  var dep_JC = parseFloat(resp._depTypeOccurrences.JC) / numberOfWords;
  var pos_CITE = parseFloat(resp._posUnigramProbs.CITE);
  var dep_IF = parseFloat(resp._depTypeOccurrences.IF) / numberOfWords;
  var pos_IE = parseFloat(resp._posOccurrences.IE) / numberOfWords;
  var avgNoSyllables = parseFloat(resp._avgNoSyllables);
  var avgWordLength = parseFloat(resp._avgWordLength);
  var pos_PN = parseFloat(resp._posOccurrences.PN);
  var ratioSweVocC = parseFloat(resp._SweVocC) / ratioSweVocTotal;
  var dep_EF = parseFloat(resp._depTypeUnigramProbs.EF);
  var dep_XX = parseFloat(resp._depTypeUnigramProbs.XX);
  var pos_HP = parseFloat(resp._posOccurrences.HP) / numberOfWords;
  var dep_PL = parseFloat(resp._depTypeOccurrences.PL) / numberOfWords;
  var pos_PL = parseFloat(resp._posOccurrences.PL) / numberOfWords;
  var dep_AA = parseFloat(resp._depTypeOccurrences.AA) / numberOfWords;
  var dep_NA = parseFloat(resp._depTypeOccurrences.NA) / numberOfWords;
  var pos_AB = parseFloat(resp._posOccurrences.AB) / numberOfWords;
  var pos_DT = parseFloat(resp._posOccurrences.DT) / numberOfWords;
  var dep_I = 0; /* dep_I.-  Question mark (???) */
  var dep_IQ = parseFloat(resp._depTypeOccurrences.IQ) / numberOfWords;
  var dep_IU = parseFloat(resp._depTypeOccurrences.IU) / numberOfWords;
  var dep_ET = parseFloat(resp._numberOfNominalPostmodifiers);
  var dep_RA = parseFloat(resp._depTypeOccurrences.RA) / numberOfWords;
  var pos_PP = parseFloat(resp._posOccurrences.PP) / numberOfWords;
  var dep_CJ = parseFloat(resp._depTypeOccurrences.CJ) / numberOfWords;
  var dep_VA = parseFloat(resp._depTypeUnigramProbs.VA);
  var dep_TA = parseFloat(resp._depTypeOccurrences.TA) / numberOfWords;
  var pos_HA = parseFloat(resp._posOccurrences.HA) / numberOfWords;
  var dep_EO = parseFloat(resp._depTypeUnigramProbs.EO);
  var dep_FO = parseFloat(resp._depTypeUnigramProbs.FO);
  var dep_OP = parseFloat(resp._depTypeUnigramProbs.OP);
  var dep_HD = parseFloat(resp._depTypeUnigramProbs.HD);
  var lexicalDensity = parseFloat(resp._lexicalDensity);
  var ratioSweVocD = parseFloat(resp._SweVocD) / ratioSweVocTotal;
  var ratioSweVocH = parseFloat(resp._SweVocH) / ratioSweVocTotal;
  var pos_RG = parseFloat(resp._posOccurrences.RG) / numberOfWords;
  var dep_AG = parseFloat(resp._depTypeUnigramProbs.AG);
  var dep_PT = parseFloat(resp._depTypeOccurrences.PT) / numberOfWords;
  var pos_PC = parseFloat(resp._posOccurrences.PC) / numberOfWords;
  var verbArity3 = parseFloat(resp._verbArities[3]) / totalVerbArity;
  var verbArity4 = parseFloat(resp._verbArities[4]) / totalVerbArity;
  var dep_OA = parseFloat(resp._depTypeOccurrences.OA) / numberOfWords;
  var avgVerbalArity = parseFloat(resp._avgVerbalArity);
  var dep_VG = parseFloat(resp._depTypeOccurrences.VG) / numberOfWords;
  var verbArity1 = parseFloat(resp._verbArities[1]) / totalVerbArity;
  var dep_IO = parseFloat(resp._depTypeUnigramProbs.IO);
  var dep_ES = parseFloat(resp._depTypeOccurrences.ES) / numberOfWords;
  var dep_FS = parseFloat(resp._depTypeOccurrences.FS) / numberOfWords;
  var dep_VS = parseFloat(resp._depTypeUnigramProbs.VS);
  var dep_IS = parseFloat(resp._depTypeUnigramProbs.IS);
  var dep_JT = parseFloat(resp._depTypeUnigramProbs.JT);
  var verbArity0 = parseFloat(resp._verbArities[0]) / totalVerbArity;

  if (sweVoc > sweVocNorm) {
    sweVoc = 1;
  } else {
    sweVoc = sweVoc / sweVocNorm;
  }

  var comp1 =
    avgNominalPostmodifiers +
    avgNominalPostmodifiers +
    avgPrepComp +
    avgSentenceDepth +
    avgSentenceLength +
    avgWordsPerClause +
    dep_ET +
    dep_IP +
    dep_SS +
    lix +
    meanDepDistanceDependent +
    meanDepDistanceSentence +
    nrValue +
    pos_MAD;

  var comp2 = dep_SS + dep_UA + pos_SN + pos_VB + verbArity2;

  var comp3 = dep_IK + dep_IT + pos_MID;

  var comp4 = avgNominalPremodifiers + dep_AT + pos_JJ + ratioRightDeps;

  var comp5 = dep_AN + dep_IR + dep_JR + pos_PAD;
  var comp6 = dep_F + dep_MS + pos_KN + ratioVerbalRoots;
  var comp7 = dep_IC + dep_JC + pos_CITE;
  var comp8 = dep_IF + pos_IE;
  var comp9 =
    avgNoSyllables + avgWordLength + lix + ovix + pos_PN + ratioSweVocC;
  var comp10 = dep_EF + dep_XX + pos_HP;
  var comp11 = dep_PL + pos_PL;
  var comp12 = dep_AA + dep_NA + pos_AB;
  var comp13 = pos_DT;
  var comp14 = dep_I + dep_IQ + dep_IU;
  var comp15 = dep_ET + dep_RA + pos_PP;
  var comp16 = dep_CJ + dep_VA + pos_KN;
  var comp17 = dep_TA + pos_HA;
  var comp18 = dep_EO + dep_FO + dep_OP;
  var comp19 =
    dep_HD +
    lexicalDensity +
    pos_VB +
    ratioSweVocC +
    ratioSweVocD +
    ratioSweVocH +
    ratioSweVocTotal;
  var comp20 = dep_SS + pos_RG;
  var comp21 = dep_AG + dep_PT + pos_PC;
  var comp22 = verbArity3 + verbArity4;
  var comp23 = dep_OA;
  var comp24 = avgVerbalArity + dep_VG + pos_VB + verbArity1;
  var comp25 = dep_IO;
  var comp26 = dep_ES + dep_FS;
  var comp27 = dep_VS;
  var comp28 = dep_IS + dep_JT;
  var comp29 = avgVerbalArity + verbArity0;

  var comp_arr = [
    comp1,
    comp2,
    comp3,
    comp4,
    comp5,
    comp6,
    comp7,
    comp8,
    comp9,
    comp10,
    comp11,
    comp12,
    comp13,
    comp14,
    comp15,
    comp16,
    comp17,
    comp18,
    comp19,
    comp20,
    comp21,
    comp22,
    comp23,
    comp24,
    comp25,
    comp26,
    comp27,
    comp28,
    comp29
  ];

  var norm_comp = new Array();
  for (i = 0; i < comp_arr.length; i++) {
    var x = comp_arr[i];
    if (Number.isNaN(x)) {
      x = 0;
    }
    x = x * 10;
    norm_comp.push(x);
  }

  var data = [
    { axis: "SweVoc (Total)", value: sweVoc }, // not standardized
    { axis: "Ovix", value: ovix / ovixNorm },
    { axis: "Lix", value: lix / lixNorm },
    { axis: "Genomsnittlig meningslängd", value: avgSent / avgSentNorm },
    { axis: "Genomsnittlig ordlängd", value: avgWord / avgWordNorm },
    { axis: "Andel bisatser", value: rSubClauses / rSubClausesNorm },
    { axis: "Meningsdjup", value: avgSentDepth / avgSentDepthNorm }
    /*

			 {axis:"Medelmeningslängd", value: norm_comp[0]},

			 {axis:"Bisatsförekomst", value: norm_comp[1]},

			 {axis:"Meningsintern interpunktion", value: norm_comp [2]},

			 {axis:"vänsterattribut", value: norm_comp[3]}, //borde kanske kallas högerattribut??

			 {axis:"Parentetiska inskott", value: norm_comp[4]},

			 {axis:"Enkla meningar**", value: norm_comp[5]},

			 {axis:"(direkt) anföring", value: norm_comp[6]},

			 {axis:"Förekomst av infinitiva verbfraser", value: norm_comp[7]},

			 {axis:"Ordlängd", value: norm_comp[8]},

			 {axis:"Klyvna satser", value: norm_comp[9]},

			 {axis:"Partikelverbförekomst", value: norm_comp[10]},

			 {axis:"Adverbial", value: norm_comp[11]},

			 {axis:"Artikelförekomst", value: norm_comp[12]},

			 {axis:"Neutralitet**", value: norm_comp[13]}*/
  ];

  drawChart("#graph", data, "100%");
}
