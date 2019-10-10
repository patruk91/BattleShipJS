# BattleShipJS
## Online multiplayer game
### [Play in browser or on mobile](http://well-to-do-crush.surge.sh/)

Project was written in pure JavaScript, with use of NO-SQL database: Firebase.
Project is inspired by the paper version of the game, where two players deploys
five ships on board 10x10. Ships cannont contact each other, and can be placed
on edge of map. Ships are placed automaticlly by application. Each player have
two maps. One is used to shoot in enemy board, and second for ships. Players
shoots in turns and the goal of the game is to sink opponent ships.

## Implemented functionalities
* boards are render with use of VanillaJS,
* shooting board is interactive,
* automatic ship placement,
* game progress is tracked in Firebase,
* game count hits and shows it on shooting board,
* matchmaking is realized by documents in Firebase,
* win condition is tracked

## Missing functionalities
* manually ship placement,
* mark destroyed ships for player owned the ship,
* it is not possible to start a new game without reloading the page,
* no information about opponent, when he left game or lost connection,
* no protection against connecting to own game,
* no information where opponent shoot

Game sometimes is not loaded correctly, so you need to reload the page.
Project is part of learning path to became a software developer.
