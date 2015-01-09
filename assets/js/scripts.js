
	function loading()
	{
		return $('.loading:visible').length > 0;
	}

	function showLoading()
	{
		$('.loading').stop(true, true).fadeIn('fast');
	}

	function hideLoading()
	{
		$('.loading').stop(true, true).fadeOut('fast', function()
		{
			$(this).text('Loading..');

		});
	}

	function menu()
	{
		return $('.game').hasClass('play') && $('.menu:visible').length > 0;
	}

	function showMenu()
	{
		$('.menu').stop(true, true).fadeIn('fast');
	}

	function hideMenu()
	{
		$('.menu').stop(true, true).fadeOut('fast');
	}

	function status()
	{
		return $('.status:visible').length > 0;
	}

	function showStatus()
	{
		$('.about').stop(true, true).animate(
		{
			left: -250

		}, 'fast', function()
		{
			$('.status').stop(true, true).fadeIn('fast');

		});
	}

	function hideStatus()
	{
		$('.status').stop(true, true).fadeOut('fast', function()
		{
			$('.about').stop(true, true).animate(
			{
				left: 0

			}, 'fast');

		});
	}

	function log(message, showGrowl, isGrowlSad)
	{
		var p = $('<p>').text(message).attr('title', Date());

		$('.log').prepend(p);

		if (showGrowl) growl(message, isGrowlSad);
	}

	function clearLog()
	{
		$('.log').html('');
	}

	function addPlayer(player_)
	{
		var div = $('<div>').attr('id', player_.id).addClass(player_.avatar.alt.toLowerCase()).addClass(player_.ready && 'ready').text(player_.name).hide();

		$('.players').append(div);

		div.fadeIn('fast');

		div.on('click', function(e)
		{
			if (div.attr('id') !== player.id || gameOn) return;

			var isReady = div.hasClass('ready');

			div.toggleClass('ready');

			socket.emit('ready', gameId, !isReady);

		});

		players.push(player_);

		if (!player || player_.id !== player.id) log(player_.name + ' has joined the game', true);
	}

	function removePlayer(id)
	{
		$('#' + id).fadeOut('fast', function()
		{
			$(this).remove();

			players.forEach(function(player, index)
			{
				if (player.id == id)
				{
					player.remove();

					log(player.name + ' has left the game', true, true);

					this.splice(index, 1);
				}

			}, players);

		});
	}

	function readyPlayer(id, isReady)
	{
		players.forEach(function(player)
		{
			if (player.id == id)
			{
				player.ready = isReady;

				if (isReady === true)
				{
					$('#' + player.id).addClass('ready');
				}
				else
				{
					$('#' + player.id).removeClass('ready');
				}
			}

		});
	}

	function clearPlayers()
	{
		players = [];

		$('.players').html('');

		contextPlayerOne.clearRect(0, 0, matrixSize * brickSize, matrixSize * brickSize);
		contextPlayerTwo.clearRect(0, 0, matrixSize * brickSize, matrixSize * brickSize);
		contextPlayerThree.clearRect(0, 0, matrixSize * brickSize, matrixSize * brickSize);
		contextPlayerFour.clearRect(0, 0, matrixSize * brickSize, matrixSize * brickSize);
	}

	function createGameId()
	{
		var hash = new Hashids(Date());

		return hash.encode(Date.now());
	}

	function startCountdown(time)
	{
		var loading = $('.loading');

		if (time === 0) return hideLoading();

		showLoading();

		if (time !== startTimer)
		{
			time = time || startTimer;

			loading.text(time / 1000);
		}

		time -= 1000;

		if (time >= 0)
		{
			setTimeout(function()
			{
				startCountdown(time);

			}, 1000);
		}
	}

	function randomBit()
	{
		return Math.round(Math.random());
	}

	function growl(message, isSad)
	{
		var growl = $('<p>').text(message).hide();

		isSad && growl.addClass('sad');

		$('.growl').prepend(growl);

		growl.stop(true, true).fadeIn('fast');

		growl.on('click', function()
		{
			clearGrowl(growl);

		});

		setTimeout(function()
		{
			clearGrowl(growl);

		}, 5000);
	}

	function clearGrowl(growl)
	{
		growl.stop(true, true).fadeOut('fast', function()
		{
			growl.remove();

		});
	}
