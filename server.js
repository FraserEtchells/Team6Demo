//Quiz Server Lobby
//Ross Mitchell and Melvin Abraham

// const { Console } = require('console');
// const path = require('path');
// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const port = process.env.PORT || 4000;



const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.set('origins', '*:*');

// Set static folder
app.use(express.static(path.join(__dirname, '/build')));





var Lobbies = {};



//Function to create random id of N length (makeid) was not created by the team
//was created by user csharptest.net on stackoverflow
// https://stackoverflow.com/a/1349426
function makeid(length = 6) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



function CreateLobby(name, id) {
    let user = {
        id,
        PlayerName: name,
        score: 0
    }

    let LobbyCode = makeid();
    while (Lobbies.hasOwnProperty(LobbyCode)) {
        LobbyCode = makeid();
    }

    user.lobby = LobbyCode;

    Lobbies[LobbyCode] = {
        lobbycode: LobbyCode,
        players: [user]
    }

    return LobbyCode
}


function JoinLobby(name, code, id) {
    let user = {
        id,
        PlayerName: name,
        score: 0
    }

    if (!(Lobbies.hasOwnProperty(code))) {
        return false
    }

    user.lobby = code;
    Lobbies[code].players.push(user);

    return true

}

function removeUser(id) {
    //find user in lobbies
    for (key in Lobbies) {
        for (let index = 0; index < Lobbies[key].players.length; index++) {
            if (Lobbies[key].players[index].id == id) {
                Lobbies[key].players.splice(index, 1);
            }
        }
    }
}


function updateScore(id, code, scoreToAdd) {
    const index = Lobbies[code].players.findIndex(user => user.id === id)

    if (index !== -1) {
        Lobbies[code].players[index].score += scoreToAdd;
        console.log(`Score: ${Lobbies[code].players[index].score}`)
    }
}

function getQuestion(value) {
    if (value == 1) {
        return {
            'answer_a': 'Melvin Abraham',
            'answer_b': 'Melvin Abraham',
            'answer_c': 'Melvin Abraham',
            'answer_d': 'Melvin Abraham',
            'category': 'General',
            'correct_ans': 'Melvin Abraham',
            'id': 101,
            'question': 'Who is the best member of Team 6?'
        }

    } else {
        return {
            'answer_a': 'Jason varitek',
            'answer_b': 'Pokey reese',
            'answer_c': 'Johnny damon',
            'answer_d': 'Mark bellhorn',
            'category': 'sports',
            'correct_ans': 'Johnny damon',
            'id': 107,
            'question': 'Who led the 2004 Red Sox regular season in number of stolen bases?'
        }
    }
}




function getLeaderboard(code) {

    Lobbies[code].players = Lobbies[code].players.sort(function (a, b) { return a.score - b.score });
    var leaderboard = {}

    //Get the scores
    for (let index = 0; index < Lobbies[code].players.length; index++) {
        leaderboard[index] = {
            name: Lobbies[code].players[index].PlayerName,
            score: Lobbies[code].players[index].score
        }
    }






    return leaderboard;

}



io.on('connection', (socket) => {
    console.log('a user connected');
    //CreateLobby();

    socket.on('new_visitor', user => {
        console.log("new visitor", user);
        socket.user = user;
    })

    //NAME:name:HOST
    //HOST- name
    socket.on("HOST", (name) => {
        console.log("Create Lobby");
        var lobbyCode = CreateLobby(name, socket.id);
        socket.join(lobbyCode);

        //Emit the code back
        io.emit("CODE", lobbyCode);
    })


    //NAME:name:JOIN:code
    //JOIN:name,code
    socket.on("JOIN", ({ name, code }) => {
        console.log(`Joining Lobby ${code}`);
        //Join the lobby
        var worked = JoinLobby(name, code, socket.id);

        if (worked) {
            //JoinRoom
            socket.join(code);
        } else {
            //Emit error
            io.emit("FAIL", "Incorrect Lobby Code")
        }
    });

    //NAME:name:CODE:code:SCORE:score
    //SCORE- score,code
    socket.on("SCORE", ({ score, code }) => {
        console.log("Updating score");
        updateScore(socket.id, code, score);
    });

    //NAME:name:CODE:code:QUESTION
    //QUESTION- code
    socket.on("QUESTION", ({ code, number }) => {
        //Get the question
        console.log("get question");
        var question = getQuestion(number);

        //Emit back question
        io.emit("QUESTION", question);
    });

    socket.on("LEADERBOARD", ({ code }) => {
        console.log("Get leaderboard");
        console.log(`code: ${code}`)
        var leaderboard = getLeaderboard(code);

        //Emit the leaderboard
        io.emit("LEADERBOARD", leaderboard);

    })


    //User has closed the website
    socket.on('disconnect', function () {
        console.log('a user has disconnected')
        //Remove user from rooms
        removeUser(socket.id);
    })
});



// http.listen(port, () => {
//   console.log(`listening on *:${port}`);
// });


server.listen(port, () => console.log(`Server running on port ${port}`));