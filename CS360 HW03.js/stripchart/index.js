var DEFAULT_RADIAN = 10

function drawGraph() {
  drawAxes()
  drawPoints()
  drawTitle()
}

function drawAxes() {
  drawHashMarksForYAxes()
  drawHashMarksForXAxes()
}

function drawPoints() {
  var distY = (GRAPHH - PADDINGY) / 150000
  var distX = (GRAPHW - 2 * PADDINGX) / numRows

  var startX = GRAPH_ORIGINX + PADDINGX
  for (var i = 0; i < numRows; ++i) {
    var y = GRAPH_ORIGINY +GRAPHH - parseFloat(data[i].deaths) * distY
    var x = startX + (i * distX)

    fill(getColorForPoint(x, y, DEFAULT_RADIAN, data[i].deaths))
    noStroke()
    ellipse(x, y, DEFAULT_RADIAN, DEFAULT_RADIAN)
  }
}

function drawHashMarksForYAxes() {
  var numHashMarks = 150000
  var hashMarkL = GRAPH_ORIGINX
  var hashMarkR = hashMarkL + HASHMARKL
  var dist = (GRAPHH - PADDINGY) / numHashMarks
  for (var i = 1; i <= numHashMarks; ++i) {
    var hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist)
    if (i % 5000 == 0) {
      drawTextForYHashMarkAtY(hashMarkY, hashMarkR, i.toString())
      stroke(51)
      line(hashMarkL, hashMarkY, hashMarkR, hashMarkY)
    }
  }
  // attribute name for y axis
  drawTextForYHashMarkAtY(GRAPH_ORIGINY, hashMarkR, "Deaths")
}

function drawHashMarksForXAxes() {
  var numHashMarks = numRows
  var dist = GRAPHW - 2 * PADDINGX
  var unitDist = dist / numHashMarks
  var startX = GRAPH_ORIGINX + PADDINGX
  var hashMarkB = GRAPH_ORIGINY + GRAPHH - 1
  for (var i = 0; i < numHashMarks; ++i) {
    var hashMarkX = startX + (i * unitDist)
    stroke(51)
    line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
    var x = hashMarkX
    var y = hashMarkB + 5
    drawTextForXHashMark(x, y, data[i].month + '')
  }
  // attribute name for x axis
  var x = GRAPH_ORIGINX + GRAPHW
  var y = GRAPH_ORIGINY + GRAPHH
  drawTextForXHashMark(x, y, "Month")
}

function drawTextForYHashMarkAtY(hashMarkY, hashMarkL, str) {
  var len = str.length * 10
  var height = 15;
  var padding = 10
  var x = hashMarkL - padding - len
  var y = hashMarkY - height / 2

  textAlign(RIGHT)
  text(str, x, y, len, height)
}

function drawTextForXHashMark(x, y, str) {
  var len = str.length * 10
  var height = 15
  text(str, x, y, len, height)
}

function getColorForPoint(x, y, r, val) {
  if (mouseX > x - r && mouseX < x + r && mouseY > y-r && mouseY < y + r) {
    drawToolTipForVal(val, x, y, r)
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
