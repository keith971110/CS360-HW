let table;

function preload() {
  table = loadTable('covid.csv','csv','header');
}

function setup() {
  createCanvas(10000, 4000);
  background(220);
  console.log(table);
  textAlign(CENTER,TOP);
  for(let r=0; r< table.getRowCount();r++){
    const name = table.getString(r,"Location.Continent");
    const num = table.getNum(r,"Data.Deaths");
    const cases = table.getNum(r,"Data.Cases");
    const x=random(0,width);
    const y=random(0,height);
    const size=map(num,0,280,0,100);
    circle(x,y,size/10);
    fill(0);
  }
}
function draw() {

}