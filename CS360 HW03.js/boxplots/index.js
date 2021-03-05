var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 300
var GRAPHH = 800

var VERTICAL_PADDING = 20
var HORIZONTAL_PADDING = 50

var HASHMARKL = 5
var WHISKERL = 15
var RADIAN = 8

var maxVal = Number.MIN_VALUE
var minVal = Number.MAX_VALUE

var table
var deaths
var title
var highlightColor
var numHashMarks
var distY
var whiskerY

var firstQuartile
var median
var thirdQuartile
var iqr

var outliers = []
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
  table = loadTable("covid.csv", "csv", "header")
}

// only for display purpose, bad coding yikes!
function setup() {
  createCanvas(CANVASW, CANVASH)
  //count the columns
  numColumns = table.getColumnCount()

  title = "2020 COVID Deaths Data (unit: one hundred thousand)"

  const csvData = table.getRows();
  for (let i = 0; i < csvData.length; i++) {
    const month = csvData[i].getNum("Date.Month");
    const deaths = csvData[i].getNum("Data.Deaths");
    data[month - 1].deaths += deaths;
  }
  console.log(data)
  deaths = data.map(item => item.deaths / 100000)
  highlightColor = color(150, 82, 217)
  whiskerY = GRAPH_ORIGINY + VERTICAL_PADDING
  preprocessInputData()
}

// called after we've got first and thirdquartiles
function findOutliers(val) {
  if (val >= thirdQuartile + 3 * iqr || val <= firstQuartile - 3 * iqr) {
    outliers.push(val)
  }
}

function preprocessInputData() {
  deaths.sort()

  minVal = Math.ceil(deaths[0])
  maxVal = Math.ceil(deaths[deaths.length-1])
  numHashMarks = maxVal - minVal + 1
  distY = (GRAPHH - 2 * VERTICAL_PADDING) / (numHashMarks - 1)

  var medianIndex = Math.floor((deaths.length - 1) / 2)
  median = deaths[medianIndex]
  var firstQuartileIndex = Math.floor(medianIndex / 2)
  firstQuartile = deaths[firstQuartileIndex]
  var thirdQuartileIndex = Math.floor((medianIndex + deaths.length - 1) / 2)
  thirdQuartile = deaths[thirdQuartileIndex]
  iqr = thirdQuartile - firstQuartile

  deaths.forEach(findOutliers)
}

function draw() {
  background(255)
  drawGraph()
}

function drawGraph() {
  drawBox()
  drawSpine()
  drawIQR()
  drawTitle()
}

function drawBox() {
  noFill()
  stroke(51)
  rect(GRAPH_ORIGINX, GRAPH_ORIGINY, GRAPHW, GRAPHH)
  var lX
  for (var i = 0; i < numHashMarks; ++i) {
    var currentY = whiskerY + (i * distY)
    // draw left
    lX = GRAPH_ORIGINX
    stroke(51)
    line(lX, currentY, lX + HASHMARKL, currentY)
    // draw right
    lX = GRAPH_ORIGINX + GRAPHW - HASHMARKL
    stroke(51)
    line(lX, currentY, lX + HASHMARKL, currentY)
    // left and right mark and unit
    var valStr = (maxVal - i).toString()
    var len = textWidth(valStr)
    var x = GRAPH_ORIGINX - len - 5
    var yPos = currentY - 6
    stroke(51)
    text(valStr, x, yPos, len, 20)
    x = GRAPH_ORIGINX + GRAPHW + 5
    stroke(51)
    text(valStr, x, yPos, len, 20)
  }
}

function drawSpine() {
  var centerX = getCenterX()
  var whiskerX = centerX - WHISKERL / 2
  // upper whisker
  stroke(51)
  line(whiskerX, whiskerY, whiskerX + WHISKERL, whiskerY)
  // lower whisker
  var yL = GRAPH_ORIGINY + GRAPHH - VERTICAL_PADDING
  stroke(51)
  line(whiskerX, yL, whiskerX + WHISKERL, yL)
  // spine
  stroke(51)
  line(centerX, whiskerY, centerX, yL)
}

function drawIQR() {
  // draw IQR
  var x = GRAPH_ORIGINX + HORIZONTAL_PADDING
  var y = whiskerY + (maxVal - thirdQuartile) * distY
  var width = GRAPHW - HORIZONTAL_PADDING * 2
  var height = (thirdQuartile - firstQuartile) * distY
  fill(255)
  stroke(51)
  rect(x, y, width, height)

  // draw median line
  y = whiskerY + (maxVal - median) * distY
  stroke(51)
  line(x, y, x + width, y)

  outliers.forEach(drawPointForVal)
}

function getCenterX() {
  return GRAPH_ORIGINX + (GRAPHW / 2)
}

function drawPointForVal(val) {
  var difference = maxVal - val;
  var y = whiskerY + difference * distY
  fill(0)
  noStroke()
  ellipse(getCenterX(), y, RADIAN, RADIAN)
}

function drawTitle() {
  var textLen = textWidth(title)
  var padding = (GRAPHW - textLen) / 2

  fill(125)
  noStroke()
  textAlign(CENTER)
  textStyle(BOLD)
  text(title, GRAPH_ORIGINX, GRAPH_ORIGINY - 50, textLen + 50, 20)
}
