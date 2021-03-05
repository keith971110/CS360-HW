var marginTop = 100;
var marginLeft = 40;
var marginRight = 20;
var marginBottom = 30;
var graphWidth = 900;
var graphHeight = 500;


function preload() {
  data = loadTable('covid.csv','csv','header');
}

function setup() {
  createCanvas(1200, 800);
}

function draw() {
  background(255);
  let numRows=data.getRowCount();
  let deaths = data.getColumn("Data.Deaths"); 
  dataShown=deaths
  for(let i=0; i<numRows;i++){
    let x=100;
    let y=100+(i*20);
    let w= deaths[i]*50;
    let h=10;
    rect(x,y,w,h)
  }
  
  //place title
  fill(0);
  textSize(20);
  text("The Number of Daily Deaths From Covid-19", width/2+marginLeft, marginTop/2);
  

}
