let formatDateData;

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
  formatDateData = formatData(data);
});

var dataContainer;
var margin = 30;
var index = 0;

function setup() {
  console.log("setup");

  width = 680;
  height = 500;

  var c = createCanvas(width, height);
  c.parent("p5-container");
  translate(margin, margin);
  //Using custom DOM elements to store and access animated variables
  dataContainer = d3.select("body").append("custom");
  // dataContainer.attr("transform", "translate(100,0)")
  //     .attr('text-anchor', "middle")
  //     .attr("x", 0)
  //     .attr("y", dataContainer.attr("height") / 2 - 50).append('text').attr('class', 'title').text('Covid cases by date')

  textAlign(CENTER);

  //Periodic function that produces a series of D3 transitions.
    setTimeout(() => {
    refresh();
    setInterval(refresh, 1000);
  }, 2000)
}

//Refresh function contains only D3
function refresh() {
  var values;
  index++;

  let data = formatDateData[index];
  values = data[1].sort((a, b) => b.value - a.value);
  console.log("refresh", values);

  x = d3
    .scaleBand()
    // .domain([0, values.length])
    .domain(
      values.map(function (d) {
        return d.country;
      })
    )
    .range([0, width - margin])
    .padding(0.4);

  y = d3
    .scaleLinear()
    .domain([0, Math.max(...values.map((item) => item.value))])
    .range([height - margin, 0]);
  //bind generated data to custom dom elements
  var bars = dataContainer.selectAll(".p5bars").data(values);
  var text = dataContainer.selectAll(".p5text").data(values);
  var textvalue = dataContainer.selectAll(".p5textvalue").data(values);
  var textDate = dataContainer.selectAll(".p5textDate").data([data[0]]);
  console.log(textDate, data[0]);
  //store variables for visual representation. These will be used
  //later by p5 methods.
  textDate
    .enter()
    .append("text")
    .attr("class", "p5textDate")
    .text((d) => d);

  bars
    .enter()
    .append("rect")
    // .attr('height', 120)
    .attr("class", "p5bars")
    .attr("data-value", (d) => d.value)
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      console.log(height - y(d.value), "height");
      return height - y(d.value);
    })
    .attr("dx", function (d) {
      return (width - margin * 2) / values.length - 1;
    });
  // text.exit().remove();
  text
    .enter()
    .append("text")
    .attr("class", "p5text")
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("dy", "-.71em")
    .attr("dx", "-.35em")
    .attr("style", "display: none")
    // .attr('dx', function(d) { return x(d.country); })
    .text(function (d) {
      console.log(d, "text");
      return d.country;
    });
  textvalue
    .enter()
    .append("text")
    .attr("class", "p5textvalue")
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("dy", "-.71em")
    .attr("dx", "-.35em")
    .attr("style", "display: none")
    // .attr('dx', function(d) { return x(d.country); })
    .text(function (d) {
      console.log(d, "text");
      return d.country;
    });
  // .attr('x', function (d, i) {
  //     return x(d.country)
  // })
  // .attr('y', function (d) {
  //     return height;
  // })

  text
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("dy", "-.71em")
    .attr("dx", "-.35em")
    // .attr('style', 'display: none')
    // .attr('dx', function(d) { return x(d.country); })
    .text(function (d) {
      console.log(d, "text");
      return d.country;
    });
  textvalue
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("dy", "-.71em")
    .attr("dx", "-.35em")
    // .attr('style', 'display: none')
    // .attr('dx', function(d) { return x(d.country); })
    .text(function (d) {
      console.log(d, "text");
      return d.value;
    });
  textDate
    .transition()
    .duration(1000)
    .text((d) => d);
  bars
    .transition()
    .duration(1000)
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("x", function (d, i) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.value);
    });
}

//Draw function contains no D3.
function draw() {
  background(255);
  noStroke();
  y = d3
    .scaleLinear()
    .domain([0, 10000])
    .range([height - margin, 0]);
  //p5.dom
  var bars = getElements("p5bars");
  var texts = getElements("p5text");
  var p5textvalue = getElements("p5textvalue");
  var p5textDate = getElements("p5textDate");
  push();
  fill(50);
  textSize(32);
  text("Covid cases by date", width / 2, 25);
  pop();
  push();
  textSize(24);
  p5textDate[0] && text(`Date: ${p5textDate[0].elt.innerText}`, width / 2, 55);
  pop();

  for (let i = 0; i < bars.length; i++) {
    let thisbar = bars[i];
    let thistext = texts[i];
    let thistextvalue = p5textvalue[i];
    push();
    translate(thisbar.attribute("x"), thisbar.attribute("y"));
    if (
      mouseX > thisbar.attribute("x") &&
      mouseX < int(thisbar.attribute("x")) + int(thisbar.attribute("dx"))
    ) {
      fill("brown");
    } else {
      fill("steelblue");
    }
    rect(0, 0, thisbar.attribute("dx"), thisbar.attribute("height"));
    fill("rgb(222, 82, 70)");
    text(thistext.elt.innerText, thisbar.attribute("dx") / 2, 15);
    fill("rgb(255, 206, 67)");

    text(thistextvalue.elt.innerText, thisbar.attribute("dx") / 2, 25);
    pop();
  }
  // stroke('yellow');
  // strokeWeight(3);
  // line(0, height - margin, width, height - margin);
  noStroke();
}

function formatData(data) {
  let c = {
    China: 1,
    India: 1,
    France: 1,
    United_Kingdom: 1,
    United_States_of_America: 1,
    Canada: 1,
    Germany: 1,
  };

  let dateData = data.reduce((acc, cur) => {
    if (acc[cur.date] && c[cur.country]) {
      acc[cur.date].push({
        country: cur.country,
        value: cur.cases,
      });
    } else if (!acc[cur.date] && c[cur.country]) {
      acc[cur.date] = [
        {
          country: cur.country,
          value: cur.cases,
        },
      ];
    }
    return acc;
  }, {});
  return Object.entries(dateData).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
}
