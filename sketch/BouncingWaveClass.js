class Wave {
  constructor(t, x, amt) {
    this.t = t;
    this.tArray = this.t.split("");
    this.x = x;
    this.y = 0;
    
    this.wave = [];
    for (let i=0; i<this.tArray.length; i++) {
      let distance = height/2 + (height/2)/this.tArray.length * (i + 1);
      let c = 200 + 100 / this.tArray.length * i;
      this.wave[i] = new Text(this.tArray[i], this.x, this.y, distance, amt, c);
    }
  }
  
  display() {
    for (let i=0; i<this.tArray.length; i++) {
      this.wave[i].move();
      this.wave[i].display();
    }
  }
}