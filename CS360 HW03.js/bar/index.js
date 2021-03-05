
function drawGraph() {
  drawHashMarksForXAxes()
  drawBars()
  drawTitle()
}

function drawHashMarksForXAxes() {
  var numHashMarks = 12
  var dist = GRAPHW - 2 * PADDINGX
  var unitDist = dist / numHashMarks
  var startX = GRAPH_ORIGINX + PADDINGX
  var hashMarkB = GRAPH_ORIGINY + GRAPHH - 1
  // draw x axis
  for (var i = 0; i < numHashMarks; ++i) {
    var hashMarkX = startX + (i * unitDist)
    stroke(51)
    line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
    var x = hashMarkX + unitDist / 2
    var y = hashMarkB + 5
    drawTextForXHashMark(x, y, data[i].month + '')
  }
  // attribute name for x axis
  var x = GRAPH_ORIGINX + GRAPHW
  var y = GRAPH_ORIGINY + GRAPHH
  drawTextForXHashMark(x, y, "Month")
}

function drawTextForXHashMark(x, y, str) {
  var len = str.length * 10
  var height = 15
  text(str, x, y, len, height)
}

/**
 * draw bar chart
 */
function drawBars() {
  var distY = parseFloat((GRAPHH - PADDINGY) / 1000)
  var distX = (GRAPHW - 2 * PADDINGX) / numRows

  var startX = GRAPH_ORIGINX + PADDINGX
  for (var i = 0; i < numRows; ++i) {
    var height = parseFloat(data[i].cases) * distY / 4000
    var x = startX + (i * distX)
    var y = GRAPH_ORIGINY + GRAPHH - height
    fill(getColorForBar(x, y, distX, height, data[i].cases)) // over color change
    noStroke()
    rect(x, y, distX, height)
  }
}

function getColorForBar(x, y, w, h, val) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    drawToolTipForVal(val, x, y, w)
    return highlightColor
  }
  return color(50, 70, 117)
}

function drawToolTipForVal(val, x, y, w) {
  fill(51)
  stroke(51)
  textStyle(NORMAL)
  textAlign(CENTER)
  text(val, x, y - 20, w, 100)
}

function drawTitle() {
  var textLen = textWidth(title)
  var padding = (GRAPHW - textLen) / 2

  fill(125)
  textAlign(CENTER)
  textStyle(BOLD)
  text(title, GRAPH_ORIGINX + padding, GRAPH_ORIGINY, textLen + 50, 20)
}
