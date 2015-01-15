# Bomberman

This is a port of the [classic game](http://en.wikipedia.org/wiki/Bomberman_%28video_game%29). It started on a slow work day, and is an experiment with HTML5 Canvas and WebSockets. But don't let that stop you from having fun!

This repository has all the client code, including graphics, styles, etc. For the server code, please check [alizahid/bomberman-server](https://github.com/alizahid/bomberman-server).

Some of the code is commented, but most isn't. Maybe I'll do that in the future.

This was a learning exercise that got out of hand, but a really fun one.

Any feedback or improvement is most welcome.

## How to play

- Enter your name and click "New Game"
- Once it's done loading, copy the URL and share with a friend
- It'll show a code on their menu
- They enter their name and click "Join Game"
- Each player has to click their name on the left side to mark themselves "ready"
- Once everyone is ready, a countdown begins, after which the game starts
- Happy bombing!

## TODO

- [ ] Refactoring
- [ ] New, licensed artwork (Anyone want to help here?)

## Ideas

- [ ] More game modes; deathmatch, crazy, fast, etc.
- [ ] Power ups to drop from destroyed bricks to change things like frequency of bombs or speed ups, etc.
- [ ] Sounds and music!

## Changelog

- Movement delay added for a consistent play speed
- Fake bomb plant added until the server sends actual message

### Credits

Thank you, Twitter for their [Twemoji](http://twitter.github.io/twemoji/) project. Double thank you Mojang, for [Minecraft](https://minecraft.net/). Without you, I wouldn't have artwork for the game. Sorry for stealing your textures! :(
