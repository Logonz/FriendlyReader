/*Draw the graph/visualization*/
function drawChart(id, data, width) {
  // Get the average of data values. Used with xScale() for bar chart.
  for (var avg = 0, i = 0; i < data.length; i++) {
    if (data[i].value > 2) {
      data[i].value = 2;
    } else if (data[i].value > 2) {
      data[i].value = 1;
    }
    avg += Math.pow(1 - data[i].value, 2);
  }
  avg = Math.pow(avg, 1) / data.length;

  ///////////////////////////////////////////////////////////////////////////
  // -------------------------- RADIAL GRADIENT -------------------------- //
  ///////////////////////////////////////////////////////////////////////////

  /*

    Making stuff dynamic - Jasmina version
    If using this snippet, remember to uncomment .svg-content and .svg-container in the css!

    // Create SVG canvas
    var svgContainer = d3.select(id).append("svg")
                                    .attr("viewBox", "-180 -200 400 400") // How "zoomed in" the content is. These values work well for 30% canvas size.
                                    .attr("preserveAspectRatio", "xMidYMid meet")
                                    .classed("svg-content", true)
                                    //.style("border", "1px solid black"); // Added to see how big the canvas is
    */

  // Size for SVG canvas
  // var width = "100%";//, height = "100%";

  // Remove chart at id before drawing new one
  d3.select(id)
    .select("svg")
    .remove();

  // Create SVG canvas
  var svgContainer = d3
    .select(id)
    .append("svg")
    .attr("viewBox", "-180 -200 400 400") // How "zoomed in" the content is. These values work well for 30% canvas size.
    .attr("width", width);

  // Create the radial gradient

  // Colour properties used in the radial gradient are created as objects in an array.
  // They go in order, so the first object is the colour in the center of the circle.
  // Is it possible to use d3.scale + rgb/hsl as range instead for smoother transition?
  var offsetData = [
    /*{offset: "5%", color: "rgb(255,0,0)", opacity: "0.7"},
                      {offset: "40%", color: "rgb(255,255,0)", opacity: "0.5"},
                      {offset: "47%", color: "rgb(0,255,0)", opacity: "0.6"},
                      {offset: "62%", color: "rgb(255,255,0)", opacity: "0.5"},
                      {offset: "99%", color: "rgb(255,0,0)", opacity: "0.6"}*/
    { offset: "10%", color: "rgb(0,255,0)", opacity: "0.8" },
    { offset: "50%", color: "rgb(255,255,0)", opacity: "0.6" },
    { offset: "60%", color: "rgb(255,255,0)", opacity: "0.6" },
    { offset: "99%", color: "rgb(255,0,0)", opacity: "0.6" }
  ];

  // About the variable radius:
  // If you change this all other elements will change with it! Neat.
  // 50% of the SVG viewBox will fill it - but leaving no room for labels.
  // As of now, the value must be in numbers/pixels and not percent.
  // Otherwise it can't be used to scale/compute the proportions of everything else.
  var radius = 115;
  var defs = svgContainer.append("defs");

  defs
    .append("radialGradient")
    .attr("id", "dia-gradient")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .selectAll("stop")
    .data(offsetData)
    .enter()
    .append("stop")
    .attr("offset", function(d) {
      return d.offset;
    })
    .attr("stop-color", function(d) {
      return d.color;
    })
    .attr("stop-opacity", function(d) {
      return d.opacity;
    });

  // Draw the radial gradient
  svgContainer
    .append("circle")
    .attr("r", radius)
    .attr("cx", "0%") // Changes position of center of the circle
    .attr("cy", "0%")
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .attr("stroke-opacity", 0.5)
    .style("fill", "url(#dia-gradient)");

  ///////////////////////////////////////////////////////////////
  // ---------------------- CREATE AXES ---------------------- //
  ///////////////////////////////////////////////////////////////

  // Inspired by http://bl.ocks.org/nbremer/21746a9668ffdf6d8242

  var max = 1; // Used to scale data
  var angleDict = {};
  var rScale = d3
    .scaleLinear()
    .range([0, radius])
    .domain([0, max]);
  var wrapWidth = 45; // How many pixels one line of text is allowed to be
  var labelFactor = 1.35; // How far away the labels should be placed
  var axisGrid = svgContainer.append("g").attr("class", "axisWrapper");
  var allAxis = data.map(function(i, j) {
      return i.axis;
    }), //Names of each axis
    total = allAxis.length, // The number of different axes
    angleSlice = (Math.PI * 2) / total; // The width in radians of each "slice"
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function(d, i) {
      angleDict[d] = angleSlice * i - Math.PI / 2;
      return rScale(max * 1.05) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y2", function(d, i) {
      return rScale(max * 1.05) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .attr("class", "line")
    .attr("stroke-opacity", 0.5)
    .style("stroke", "black")
    .style("stroke-width", "2px");

  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("dy", "0em")
    .attr("x", function(d, i) {
      return rScale(max * labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
    })
    .attr("y", function(d, i) {
      return rScale(max * labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
    })
    .text(function(d) {
      return d;
    })
    .call(wrap, wrapWidth);

  ////////////////////////////////////////////////////////////
  // ------------ HELPER FUNCTION | WRAP TEXT ------------- //
  ////////////////////////////////////////////////////////////

  // Wrap the label names (i.e. make line breaks) if they're too long.
  // Control length with variable wrapWidth.
  // Original: http://bl.ocks.org/mbostock/7555321

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = 0;
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", lineNumber * lineHeight + "em")
          .text(word);
        lineNumber++;
      }
    });
  }

  /////////////////////////////////////////////////////////////
  // ---------------------- BAR CHART ---------------------- //
  /////////////////////////////////////////////////////////////

  var barData = [
    //{offset: "0%", color: "rgb(255,0,0)", opacity: "0.7"},
    //{offset: "40%", color: "rgb(255,255,0)", opacity: "0.7"},
    { offset: "0%", color: "rgb(0,255,0)", opacity: "0.5" },
    { offset: "50%", color: "rgb(255,255,0)", opacity: "0.6" },
    { offset: "99%", color: "rgb(255,0,0)", opacity: "0.5" }
  ];

  defs
    .append("linearGradient")
    .attr("id", "linGradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%")
    .selectAll("stop")
    .data(barData)
    .enter()
    .append("stop")
    .attr("offset", function(d) {
      return d.offset;
    })
    .attr("stop-color", function(d) {
      return d.color;
    })
    .attr("stop-opacity", function(d) {
      return d.opacity;
    });

  svgContainer
    .append("rect")
    .attr("x", radius * 1.55) // Distance from circle
    .attr("y", 0 - radius / 2)
    .attr("width", 15)
    .attr("height", radius)
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .attr("stroke-opacity", 0.5)
    .style("fill", "url(#linGradient)");

  var pos = avg; // Ellipse position
  var xScale = d3
    .scaleLinear()
    .range([radius / 2, 0 - radius / 2])
    .domain([0, 1]);
  var ellipse = svgContainer
    .append("ellipse")
    .data(data)
    .attr("cx", radius * 1.55 + 7) // Distance from circle
    .attr("cy", xScale(pos))
    .attr("rx", 15) // Length of ellipse
    .attr("ry", 3); // Height of ellipse

  ////////////////////////////////////////////////////////////////
  // ------------------------ DRAW CURVE ---------------------- //
  ////////////////////////////////////////////////////////////////

  // Plot the points from data for the curve.
  var curveFunction = d3
    .line()
    .x(function(d) {
      return (Math.cos(angleDict[d.axis]) * d.value * radius) / 2;
    })
    .y(function(d) {
      return (Math.sin(angleDict[d.axis]) * d.value * radius) / 2;
    })
    .curve(d3.curveLinearClosed); // Type of curve can be changed. Rec: CatmullRom and Linear

  // Draw the curve
  var curveGraph = svgContainer
    .append("path")
    .attr("d", curveFunction(data))
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("fill", "none");
}
