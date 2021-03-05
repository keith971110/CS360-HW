d3.csv("./covid.csv", function (d) {
  return {
    day: d["Date.Day"], // convert "Year" column to Date
    month: d["Date.Month"],
    year: d["Date.Year"],
    date: `${d["Date.Year"]}-${d["Date.Month"]}-${d["Date.Day"]}`,
    cases: d["Data.Cases"],
    deaths: d["Data.Deaths"],
    population: d["Data.Population"],
    rate: d["Data.Rate"],
    country: d["Location.Country"],
    code: d["Location.Code"],
    continent: d["Location.Continent"],
  };
}).then(function (data) {
  renderPlotChart(data);
});

function renderPlotChart(data) {
  let maxX = Math.max(...data.map((item) => item.cases));
  let maxY = Math.max(...data.map((item) => item.deaths));

  let svg = d3.select("#plot-chart"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  let g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");
  // Add X axis
  let x = d3.scaleLinear().domain([0, maxX]).range([0, width]);
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  let y = d3.scaleLinear().domain([0, maxY]).range([height, 0]);
  g.append("g").call(d3.axisLeft(y));

  g.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.cases);
    })
    .attr("cy", function (d) {
      return y(d.deaths);
    })
    .attr("r", 1.5)
    .style("fill", "#69b3a2");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("Covid cases cause deaths");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("text-anchor", "middle")
    .attr("x", (svg.attr("width") - margin) / 2)
    .attr("y", svg.attr("height") - 50)
    .attr("font-size", "24px")
    .text("deaths");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", svg.attr("height") / 2 - 50)
    .attr("style", "transform-origin: left; transform:rotate(90deg)")
    .attr("font-size", "24px")
    .text("cases");
}
