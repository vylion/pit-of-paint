
//var Player = require('./Player')
//var Tile = require('./Tile')

function gridmap (gridwidth) {
  var pos = {}
  tiles = []
  for(var i=0; i<gridwidth; i++) {
    tiles[i] = [];
    for(var j=0; j<gridwidth; j++) {
	pos.x = i
	pos.y = j
        tiles[i][j] = new Tile(0, 0)
    }
  }
  
  return tiles
}

function directionPick () {
  var dirs = ['up','down','left','right'];
  return dirs[Math.floor(Math.random()*4)];
}

function PlayerMng (playerNum, gridwidth) {
  console.log(playerNum + ' players')
  this.playerNum = playerNum
  this.tiles = gridmap(gridwidth)
  this.player = new Array(playerNum)
  console.log('gridmap created of width ' + gridwidth)
  this.gridwidth = gridwidth
  
  var i
  var posPool = Array.apply(null, {length: gridwidth*gridwidth}).map(Number.call, Number);
  for(i = 0; i < playerNum; ++i) {
    
    var pos = {}
    var drawn = Math.floor(Math.random()*posPool.length)
    pos.x = Math.floor(posPool[drawn]/gridwidth)
    pos.y = (posPool.splice(drawn, 1) - pos.x*gridwidth)
    
    this.player[i] = new Player(i+1,Math.floor(Math.random()*16777215).toString(16),directionPick(),pos);
    console.log('player ' + i + ' created of color ' + this.player[i].color + ' in position (' + pos.x + ', ' + pos.y + ').')
    
    this.tiles[pos.x][pos.y].player_id = this.tiles[pos.x][pos.y].paint_id = i+1
  }
}

PlayerMng.prototype.collision = function (p_id) {
  
  if((this.player[p_id].pos.x === 0 && this.player[p_id].dir === 'left') ||
     (this.player[p_id].pos.x === this.gridwidth-1 && this.player[p_id].dir === 'right') ||
     (this.player[p_id].pos.y === 0 && this.player[p_id].dir === 'up') ||
     (this.player[p_id].pos.y === this.gridwidth-1 && this.player[p_id].dir === 'down')) {
        console.log('fucking wall')
				this.player[p_id].dir = 'stun'
				return true
     }
  else {
    var pos_it = new Array(8);
    pos_it[0] = {x: -1, y: -1};
    pos_it[1] = {x:  0, y: -1};
    pos_it[2] = {x: +1, y: -1};
    pos_it[3] = {x: -1, y:  0};
    pos_it[4] = {x: +1, y:  0};
    pos_it[5] = {x: -1, y: +1};
    pos_it[6] = {x:  0, y: +1};
    pos_it[7] = {x: -1, y: +1};
    
    var i = 0;
    var found = false;
    var x;
    var y;
    var p;
    while(i < 8 && !found) {
	x = this.player[p_id].pos.x + pos_it[i].x;
	y = this.player[p_id].pos.y + pos_it[i].y;
	if(x>=0 && y>=0 && x<this.gridwidth && y<this.gridwidth)p = this.tiles[x][y].player_id - 1;
	else p = 0;
	if (p > 0) {
	  found = (i == 0 && (this.player[p_id].dir == 'up' && this.player[p].dir == 'right') ||
											 (this.player[p_id].dir == 'left' && this.player[p].dir == 'down')) ||
		  (i == 2 && (this.player[p_id].dir == 'up' && this.player[p].dir == 'left') ||
								 (this.player[p_id].dir == 'right' && this.player[p].dir == 'down')) ||
		  (i == 5 && (this.player[p_id].dir == 'down' && this.player[p].dir == 'right') ||
								 (this.player[p_id].dir == 'left' && this.player[p].dir == 'up')) ||
			(i == 7 && (this.player[p_id].dir == 'down' && this.player[p].dir == 'left') ||
								 (this.player[p_id].dir == 'right' && this.player[p].dir == 'up')) ||
			(i == 1 && (this.player[p_id].dir == 'up' && this.player[p].dir == 'stun')) ||
			(i == 3 && (this.player[p_id].dir == 'left' && this.player[p].dir == 'stun')) ||
			(i == 4 && (this.player[p_id].dir == 'right' && this.player[p].dir == 'stun')) ||
			(i == 6 && (this.player[p_id].dir == 'down' && this.player[p].dir == 'stun'));
			
	}
	++i;
    }
    if(found) console.log('someone\'s blocking the way')
    else console.log('free path ahead')
    return found
  }
}

PlayerMng.prototype.turn = function () {
  var plPool = Array.apply(null, {length: this.player.length}).map(Number.call, Number);
  var i = 0;
  var info;
  
  for(i = 0; i < plPool.length; ++i) {
    if (this.collision(plPool[i])) {
      plPool.splice(i, 1);
      --i;
    }
  }
  
  for(i = 0; i < plPool.length; ++i) {
		this.tiles[this.player[plPool[i]].pos.x][this.player[plPool[i]].pos.y].player_id = 0
		this.player[plPool[i]].move()
	}
	return plPool;
}

//module.exports = PlayerMng
