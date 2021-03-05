function setup(){
  createCanvas(700, 700);
}

function draw(){
  background(240);
  for (var x = 5; x < 400; x = x+50){
    for (var y = 5; y < 400; y = y+50){
      push();
      translate(x, y);      
      rect(12, 30, 100, 100);
      pop();
    } 
  } 
}
