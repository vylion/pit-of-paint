
function Tile (player_id, paint_id) {
  this.player_id = player_id
  this.paint_id = paint_id
}

Tile.prototype.toString = function () {
  return 'p' + this.player_id + ':' + this.paint_id
}

//module.exports = Tile
