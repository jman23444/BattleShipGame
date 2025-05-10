export default class Ship {
    constructor(type, length) {
      this.type = type;
      this.length = length;
      this.hits = 0;
      this.sunk = false;
    }
  
    hit() {
      this.hits += 1;
      this.sunk = this.hits === this.length;
    }
  
    isSunk() {
      return this.sunk;
    }
  }