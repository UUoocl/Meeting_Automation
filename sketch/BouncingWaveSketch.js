/*
----- Coding Tutorial by Patt Vira ----- 
Name: Bouncing Wave Typography
Video Tutorial: https://youtu.be/dBKilH7ljew

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

//console.log(t)
let size = 30;
let waves = []; let num; 

function setup() {
  createCanvas(1280, 820);
  colorMode(HSB);
  num = width/size;
  //frameRate(20);
  for (let i=0; i<num; i++) {
    let x = i*size + size/2;
    let amt = 1 / num * i;
    waves[i] = new Wave(t, x, amt);
  }
  
}

function draw() {
  background(240, 48, 20,0);
  clear()
  for (let i=0; i<num; i++) {
    waves[i].display();
  }
  
}