var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 1200
var GRAPHH = 800

var HASHMARKL = 5
var PADDINGX = 20
var PADDINGY = 45

var table
var numRows
var numColumns
var title
var highlightColor

var data = [
  { cases: 0, deaths: 0, month: 1, year: 2020, },
  { cases: 0, deaths: 0, month: 2, year: 2020, },
  { cases: 0, deaths: 0, month: 3, year: 2020, },
  { cases: 0, deaths: 0, month: 4, year: 2020, },
  { cases: 0, deaths: 0, month: 5, year: 2020, },
  { cases: 0, deaths: 0, month: 6, year: 2020, },
  { cases: 0, deaths: 0, month: 7, year: 2020, },
  { cases: 0, deaths: 0, month: 8, year: 2020, },
  { cases: 0, deaths: 0, month: 9, year: 2020, },
  { cases: 0, deaths: 0, month: 10, year: 2020, },
  { cases: 0, deaths: 0, month: 11, year: 2020, },
  { cases: 0, deaths: 0, month: 12, year: 2020, },
];

function preload() {
  table = loadTable("./covid.csv", "csv", "header")
}

function setup() {
  createCanvas(CANVASW, CANVASH)

  numRows = data.length;
  numColumns = table.getColumnCount()

  highlightColor = color(150, 82, 217)
  title = "2020 America COVID Deaths/Month Data"

  const csvData = table.getRows();
  for (let i = 0; i < csvData.length; i++) {
    const month = csvData[i].getNum("Date.Month");
    const cases = csvData[i].getNum("Data.Cases");
    const deaths = csvData[i].getNum("Data.Deaths");
    const continent = csvData[i].getString("Location.Continent");
    if (continent === 'America') {
      data[month - 1].cases += cases;
      data[month - 1].deaths += deaths;
    }
  }
  console.log(data);
}

/**
 * main loop
 */
function draw() {
  background(255)
  drawGraph()
}

