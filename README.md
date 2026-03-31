user → gameSession (1-to-many)
user → transaction (1-to-many)

gameSession → move (1-to-many)
gameSession → user (many-to-many via players)

gameRoom → user (player1, player2)

transaction → user (many-to-1)

database relationships:

-a user can participate in multiple game sessions (1-to-many)
-a user can have multiple transactions (1-to-many)

-a gameSession contains multiple moves (1-to-many)
-a gameSession involves multiple users (many-to-many via players array)
-a gameRoom contains two users (player1 and player2) for online gameplay

-each transaction belongs to one user (many-to-1)