
	//	inits

	var canvasTiles = document.getElementById('tiles'),
		contextTiles = canvasTiles.getContext('2d'),
		canvasBombs = document.getElementById('bombs'),
		contextBombs = canvasBombs.getContext('2d'),
		canvasPlayerOne = document.getElementById('player-one'),
		contextPlayerOne = canvasPlayerOne.getContext('2d'),
		canvasPlayerTwo = document.getElementById('player-two'),
		contextPlayerTwo = canvasPlayerTwo.getContext('2d'),
		canvasPlayerThree = document.getElementById('player-three'),
		contextPlayerThree = canvasPlayerTwo.getContext('2d'),
		canvasPlayerFour = document.getElementById('player-four'),
		contextPlayerFour = canvasPlayerTwo.getContext('2d');

	var matrix = {},
		matrixSize = 9,
		brickSize = 64;

	var upperLimit = matrixSize - 1,
		upperLimitMinusOne = upperLimit - 1,
		empty = ['0 0', upperLimit + ' 0', '0 ' + upperLimit, upperLimit + ' ' + upperLimit, '1 0', upperLimitMinusOne + ' 0', '0 ' + upperLimitMinusOne, upperLimit + ' ' + upperLimitMinusOne, '0 1', upperLimit + ' 1', '1 ' + upperLimit, upperLimitMinusOne + ' ' + upperLimit];

	var iconBomb = new Image(),

		patternBrick = new Image(),
		patternPillar = new Image(),
		patternFloor = new Image(),
		patternFire = new Image(),

		playerBirdie = new Image(),
		playerElephant = new Image(),
		playerFishy = new Image(),
		playerMonkey = new Image(),
		playerRam = new Image(),
		playerOx = new Image(),
		playerPiggle = new Image(),
		playerWhale = new Image();

	var BOMB_TIMER = 2000,
		BOMB_CLEAR_TIMER = 400;

	var gameId,
		gameOn = false,
		frozen = false,
		startTimer = 3000,
		movementDelay = 100,
		movementTimer,
		controlsBound = false,
		player,
		players = [],
		avatars = {
			birdie: playerBirdie,
			elephant: playerElephant,
			fishy: playerFishy,
			monkey: playerMonkey,
			ram: playerRam,
			ox: playerOx,
			piggle: playerPiggle,
			whale: playerWhale,
		},
		playerMap = [
			{
				context: contextPlayerOne,
				x: 0,
				y: 0,
			},
			{
				context: contextPlayerTwo,
				x: upperLimit,
				y: 0,
			},
			{
				context: contextPlayerThree,
				x: 0,
				y: upperLimit,
			},
			{
				context: contextPlayerFour,
				x: upperLimit,
				y: upperLimit,
			}
		];

	$(document).ready(function()
	{
		showLoading();

		iconBomb.src = 'assets/img/bomb.png';

		patternBrick.src = 'assets/img/brick.png';
		patternPillar.src = 'assets/img/pillar.png';
		patternFloor.src = 'assets/img/floor.png';
		patternFire.src = 'assets/img/fire.png';

		playerBirdie.src = 'assets/img/birdie.png';
		playerBirdie.alt = 'birdie';

		playerElephant.src = 'assets/img/elephant.png';
		playerElephant.alt = 'elephant';

		playerFishy.src = 'assets/img/fishy.png';
		playerFishy.alt = 'fishy';

		playerMonkey.src = 'assets/img/monkey.png';
		playerMonkey.alt = 'monkey';

		playerRam.src = 'assets/img/ram.png';
		playerRam.alt = 'ram';

		playerOx.src = 'assets/img/ox.png';
		playerOx.alt = 'ox';

		playerPiggle.src = 'assets/img/piggle.png';
		playerPiggle.alt = 'piggle';

		playerWhale.src = 'assets/img/whale.png';
		playerWhale.alt = 'whale';

		attachEventListeners();

	});

	$(window).load(function()
	{
		hideLoading();

		showMenu();

		if (window.location.hash.length == 10)
		{
			$('input[name=game-id]').val(window.location.hash.substr(1));
		}

	});

	//	functions

	function attachEventListeners()
	{
		$('.menu').on('submit', function(e)
		{
			e.preventDefault();

			var element = $(this);

			var fieldUserName = $('input[name=user-name]'),
				fieldGameId = $('input[name=game-id]');

			var userName = fieldUserName.val(),
				gameId = fieldGameId.val();

			if (userName && gameId)
			{
				if (gameId.length !== 9) return growl('Enter a game ID from your friend', true), fieldGameId.focus();

				joinGame(userName, gameId);
			}
			else if (userName)
			{
				newGame(userName);
			}
			else
			{
				return growl('Enter your name', true), fieldUserName.focus()
			}

		});

		$(document).on('keyup', function(e)
		{
			if (e.which == 27)
			{
				if (menu())
				{
					hideMenu();
				}
				else
				{
					hideLoading();

					showMenu();
				}
			}

		});

		$('.show-about').on('click', function(e)
		{
			e.preventDefault();

			status() ? hideStatus() : showStatus();

		});
	}

	function bindControls()
	{
		if (controlsBound) return;

		$(document).on('keydown', function(e)
		{
			if (!player || frozen) return;

			if (e.which == 13)
			{
				player.plantBomb();
			}
			else if (e.which == 38)
			{
				player.move('up');

				frozen = true;
			}
			else if (e.which == 40)
			{
				player.move('down');

				frozen = true;
			}
			else if (e.which == 37)
			{
				player.move('left');

				frozen = true;
			}
			else if (e.which == 39)
			{
				player.move('right');

				frozen = true;
			}

			movementTimer = setTimeout(function()
			{
				frozen = false;

			}, movementDelay);

		});

		controlsBound = true;
	}

	function init(matrix_, clear)
	{
		if (matrix_)
		{
			for (var x = 0; x < matrixSize; x ++)
			{
				matrix[x] = {};

				for (var y = 0; y < matrixSize; y ++)
				{
					var tile = new Tile(matrix_[x][y].type);

					tile.render(x, y);

					setTile(tile, x, y);
				}
			}
		}
		else
		{
			for (var x = 0; x < matrixSize; x ++)
			{
				matrix[x] = {};

				for (var y = 0; y < matrixSize; y ++)
				{
					matrix[x][y] = drawTile(x, y);
				}
			}
		}

		if (clear === true)
		{
			clearLog();

			clearPlayers();
		}

		$('.game').addClass('play');

		bindControls();
	}

	function drawTile(x, y)
	{
		if (x % 2 == 1 && y % 2 == 1)
		{
			type = 'pillar';
		}
		else
		{
			type = Math.floor(Math.random() * 10) > 1 ? 'normal' : 'empty';
		}

		if (empty.indexOf(x + ' ' + y) > -1)
		{
			type = 'empty';
		}

		var tile = new Tile(type);

		tile.render(x, y);

		return tile;
	}

	function getTile(x, y)
	{
		return matrix[x] && matrix[x][y];
	}

	function setTile(tile, x, y)
	{
		if (matrix[x])
		{
			matrix[x][y] = tile;
		}
	}

	function updateTile(x, y, key, value)
	{
		if (matrix[x] && matrix[x][y])
		{
			matrix[x][y][key] = value;
		}
	}

	//	classes

	function Tile(type)
	{
		this.position = {};

		this.type = type || 'empty';

		//	can show explosions on empty tiles or bricks
		this.canExplode = this.type == 'pillar' ? false : true;

		//	can only move on empty tiles
		this.canMove = this.type == 'empty' ? true : false;

		this.hasBomb = false;

		this.setType = function(type)
		{
			this.type = type || 'empty';

			this.canExplode = this.type == 'pillar' ? false : true;

			this.canMove = this.type == 'empty' ? true : false;
		}

		this.render = function(x, y)
		{
			this.position.x = x;
			this.position.y = y;

			switch (this.type)
			{
				case 'pillar':

					contextTiles.drawImage(patternPillar, x * brickSize, y * brickSize, brickSize, brickSize);

					break;

				case 'normal':

					contextTiles.drawImage(patternBrick, x * brickSize, y * brickSize, brickSize, brickSize);

					break;

				case 'bomb':

					contextTiles.drawImage(iconBomb, x * brickSize, y * brickSize, brickSize, brickSize);

					break;

				case 'empty':
				default:

					contextTiles.drawImage(patternFloor, x * brickSize, y * brickSize, brickSize, brickSize);

					break;
			}

			//	matrix numbers
			// contextTiles.fillStyle = 'rgb(100, 100, 100)';
			// contextTiles.fillText(x + ',' + y, x * brickSize + 27, y * brickSize + 40);
		}
	}

	function Player(context, name, avatar)
	{
		this.context = context;

		this.name = name || 'Whale';
		this.avatar = avatar || playerWhale;

		this.isAlive = true;

		this.position = {};

		this.maxBombs = 1;
		this.bombs = 0;

		this.move = function(direction)
		{
			// can't move if dead, son
			if (!this.isAlive) return;

			//	check if we can move in that direction
			if (!this.canGo(direction, this.position)) return;

			switch (direction)
			{
				case 'up':

					this.render(this.position.x, this.position.y - 1);

					break;

				case 'down':

					this.render(this.position.x, this.position.y + 1);

					break;

				case 'left':

					this.render(this.position.x - 1, this.position.y);

					break;

				case 'right':

					this.render(this.position.x + 1, this.position.y);

					break;
			}
		}

		this.canGo = function(direction, position)
		{
			var x = position.x,
				y = position.y;

			switch (direction)
			{
				case 'up':

					y = position.y - 1;

					break;

				case 'down':

					y = position.y + 1;

					break;

				case 'left':

					x = position.x - 1;

					break;

				case 'right':

					x = position.x + 1;

					break;
			}

			var tile = getTile(x, y);

			return tile && tile.canMove && !tile.hasBomb;
		}

		this.clearBomb = function()
		{
			this.bombs--;
		}

		this.plantBomb = function()
		{
			// dead people don't plant bombs
			if (!this.isAlive) return;

			//	make sure we're not exceeding the max bomb limit
			if (this.bombs >= this.maxBombs) return;

			//	check if bomb is planted on the same spot
			if (getTile(this.position.x, this.position.y).hasBomb) return;

			//	else plant bomb
			var bomb = new Bomb(this.position.x, this.position.y);

			this.bombs++;

			setTimeout(this.clearBomb.bind(this), BOMB_TIMER);

			//	fake bomb planting while the server responds
			Bomb.plant(this.position.x, this.position.y);

			//	notify the server
			if (socket && player)
			{
				socket.emit('bomb', gameId, this.position);
			}
		}

		this.render = function(x, y, dontNotify)
		{
			this.context.clearRect(this.position.x * brickSize, this.position.y * brickSize, brickSize, brickSize);

			//	don't render if player is dead
			if (!this.isAlive) return;

			//	draw player
			this.context.drawImage(this.avatar, x * brickSize, y * brickSize, brickSize, brickSize);

			//	update position
			this.position.x = x;
			this.position.y = y;

			//	let the server know player has moved
			if (socket && player && !dontNotify)
			{
				socket.emit('move', gameId, player.id, this.position);
			}
		}

		this.remove = function()
		{
			this.context.clearRect(0, 0, brickSize * matrixSize, brickSize * matrixSize);
		}
	}

	Player.create = function(context, data)
	{
		var player = new Player(context, data.name, avatars[data.avatar]);

		player.id = data.id;
		player.index = data.index;
		player.ready = data.ready;

		return player;
	}

	function Bomb(x, y, strength)
	{
		this.position = { x: x, y: y };

		this.isAlive = true;
		this.strength = strength || 1;

		this.blown = [];

		this.powerUp = function()
		{
			this.strength++;
		}

		this.cleanUp = function()
		{
			this.blown.forEach(function(spot)
			{
				//	clear up explosion
				contextBombs.clearRect(spot.x * brickSize, spot.y * brickSize, brickSize, brickSize);

				var tile = getTile(spot.x, spot.y);

				//	update the tile
				updateTile(spot.x, spot.y, 'type', 'empty');
				updateTile(spot.x, spot.y, 'canMove', true);

				tile.render(tile.position.x, tile.position.y);

			});
		}

		this.detonate = function()
		{
			clearTimeout(this.explosionTimer);

			//	make it a dud
			this.isAlive = false;

			contextBombs.fillStyle = 'rgb(231, 76, 60)';

			//	clear the bomb flag from the tile
			updateTile(this.position.x, this.position.y, 'hasBomb', false);

			//	detonate the bomb
			//	and blow any adjacent tiles
			var blown = [
				{
					x: this.position.x,
					y: this.position.y
				},
				{
					x: this.position.x,
					y: this.position.y - this.strength
				},
				{
					x: this.position.x,
					y: this.position.y + this.strength
				},
				{
					x: this.position.x - this.strength,
					y: this.position.y
				},
				{
					x: this.position.x + this.strength,
					y: this.position.y
				}
			];

			blown.forEach(function(spot)
			{
				if (this.canExplode(spot.x, spot.y))
				{
					this.blown.push(
					{
						x: spot.x,
						y: spot.y

					});

					updateTile(spot.x, spot.y, 'canMove', false);

					contextBombs.drawImage(patternFire, spot.x * brickSize, spot.y * brickSize, brickSize, brickSize);
				}

			}, this);

			//	clear up the explosion
			setTimeout(this.cleanUp.bind(this), BOMB_CLEAR_TIMER);
		}

		this.canExplode = function(x, y)
		{
			var tile = getTile(x, y);

			//	check if tile can explode
			return tile && tile.canExplode;
		}

		this.render = function()
		{
			if (this.isAlive)
			{
				//	clear the cell before drawing bomb
				contextBombs.clearRect(this.position.x * brickSize, this.position.y * brickSize, brickSize, brickSize);

				//	draw bomb
				contextBombs.drawImage(iconBomb, this.position.x * brickSize, this.position.y * brickSize, brickSize, brickSize);

				//	update the tile with the `hasBomb` flag
				updateTile(this.position.x, this.position.y, 'hasBomb', true);

				if (this.explosionTimer) return;

				//	detonate the bomb
				this.explosionTimer = setTimeout(this.detonate.bind(this), BOMB_TIMER);
			}
		}
	}

	//	fake bomb plant on client-side
	Bomb.plant = function(x, y)
	{
		//	clear the cell before drawing bomb
		contextBombs.clearRect(x * brickSize, y * brickSize, brickSize, brickSize);

		//	draw bomb
		contextBombs.drawImage(iconBomb, x * brickSize, y * brickSize, brickSize, brickSize);
	}
