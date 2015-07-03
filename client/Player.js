
function Player (color, direction, position) {
  this.color = color
  this.dir = direction
  this.pos = position
}

Player.prototype.move = function () {
  if(this.dir == 'left') this.pos.x -= 1;
  else if(this.dir == 'right') this.pos.x += 1;
  else if(this.dir == 'up') this.pos.y -= 1;
  else if(this.dir == 'down') this.pos.y += 1;
}

//module.exports = Player
