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
  // console.log(data);
  const barChartDataTemp = {};
  data.forEach((item) => {
    if (barChartDataTemp[item.continent]) {
      barChartDataTemp[item.continent] += Number(item.deaths);
    } else {
      barChartDataTemp[item.continent] = Number(item.deaths);
    }
    // plotChartDataTemp[item.cases] = item.deaths;
  });
  const barChartData = Object.entries(barChartDataTemp).map((item) => ({
    continent: item[0],
    value: item[1],
  }));
  renderBarChart(barChartData);
});

function renderBarChart(barChartData) {
  let svg = d3.select("#bar-chart"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  let xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  xScale.domain(
    barChartData.map(function (d) {
      return d.continent;
    })
  );
  yScale.domain([
    0,
    d3.max(barChartData, function (d) {
      return d.value;
    }),
  ]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  g.append("g")
    .call(d3.axisLeft(yScale).ticks(12))
    .append("text")
    .attr("y", 6)
    .attr("dy", "1em")
    .attr("text-anchor", "end")
    .text("value");

  g.selectAll(".bar")
    .data(barChartData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.continent);
    })
    .attr("y", function (d) {
      return yScale(d.value);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d.value);
    });

  g.selectAll(".text")
    .data(barChartData)
    .enter()
    .append("text")
    .attr("class", "nums")
    .attr("x", function (d) {
      return xScale(d.continent);
    })
    .attr("y", function (d) {
      return yScale(d.value);
    })
    .attr("dy", "-.71em")
    .attr("dx", "-.35em")
    // .attr('dx', function(d) { return xScale(d.continent); })
    .text(function (d) {
      return d.value;
    });

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("Covid Deaths Number");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("text-anchor", "middle")
    .attr("x", (svg.attr("width") - margin) / 2)
    .attr("y", svg.attr("height") - 50)
    .attr("font-size", "24px")
    .text("Continent");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("text-anchor", "middle")
    .attr("x", -10)
    .attr("y", svg.attr("height") / 2 - 50)
    .attr(
      "style",
      "transform-origin: left; transform:translateX(-40px) rotate(90deg)"
    )
    .attr("font-size", "24px")
    .text("Deaths");
}
