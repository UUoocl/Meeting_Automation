class Text {
  constructor(t, x, y, distance, amt, c) {
    this.t = t;
    this.x = x;
    this.y = y;
    
    this.amt = amt;
    this.dir = 1;
    this.y0 = 0;
    this.distance = distance;
    this.c = c;
  }
  
  display() {
    noStroke();
    fill(this.c, 100, 100);
    textSize(size);
    textAlign(CENTER, CENTER);
    text(this.t, this.x, this.y);
  }
  
  move() {
    this.y = this.y0 + this.dir * easeInOutQuad(this.amt) * this.distance;
    
    if (this.amt >= 1) {
      this.amt = 0;
      this.y0 += this.dir * this.distance;
      this.dir *= -1;
    }
    this.amt += 0.01;
  }
}