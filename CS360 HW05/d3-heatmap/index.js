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
  renderHeatmap(data);
});

function renderHeatmap(data) {
  let scale = d3
    .scaleQuantize()
    .domain([0, Math.max(...data.map((item) => item.deaths))])
    .range(["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]);
  let c = {
    China: 1,
    India: 1,
    France: 1,
    United_Kingdom: 1,
    United_States_of_America: 1,
  };
  let temp = data.reduce((acc, cur) => {
    if (c[cur.country]) {
      acc.push({
        group: cur.country,
        variable: scale(cur.deaths),
        value: cur.deaths,
      });
    }
    return acc;
  }, []);
  let country = Object.entries(c).map((item) => item[0]);
  let myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

  console.log(temp, country, myVars);

  let margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  let svg = d3
    .select("#heatmap-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let myColor = d3
    .scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0, Math.max(...temp.map((item) => item.value))]);
  let x = d3.scaleBand().range([0, width]).domain(country).padding(0.01);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

  let y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
  svg.append("g").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

  svg
    .selectAll()
    .data(temp, function (d) {
      return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8);
}
