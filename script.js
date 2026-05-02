// 1. Initialize the game logic and board variable
var game = new Chess();
var board = null;

// 2. Define exactly where the pieces are hosted online
function getPieceUrl(piece) {
    return 'https://chessboardjs.com/img/chesspieces/wikipedia/' + piece + '.png';
}

// 3. Status update function (Only keep THIS one)
function updateStatus() {
    var status = '';
    var moveColor = (game.turn() === 'w') ? 'White' : 'Black';

    // Check game state
    if (game.game_over()) {
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        } else if (game.in_draw()) {
            status = 'Game over, Draw';
        } else {
            status = 'Game over';
        }
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) status += ', ' + moveColor + ' is in check';
    }

    // Update status text
    document.getElementById('status').innerHTML = status;

    // Update Move History
    var history = game.history();
    var historyElement = document.getElementById('moveHistory');
    
    // Only update history if the element exists
    if (historyElement) {
        historyElement.innerHTML = ''; 
        for (var i = 0; i < history.length; i += 2) {
            var moveNum = Math.floor(i / 2) + 1;
            var whiteMove = history[i];
            var blackMove = history[i + 1] ? history[i + 1] : '';
            
            var row = document.createElement('div');
            row.className = 'move-row';
            row.innerHTML = '<span>' + moveNum + '.</span> ' + whiteMove + ' ' + blackMove;
            historyElement.appendChild(row);
        }
        historyElement.scrollTop = historyElement.scrollHeight;
    }
}

// 4. Setup the board configuration
var config = {
    draggable: true,
    position: 'start',
    pieceTheme: getPieceUrl,
    onDragStart: function(source, piece, position, orientation) {
        if (game.game_over()) return false;
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    },
    onDrop: function(source, target) {
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' 
        });

        if (move === null) return 'snapback';
        updateStatus();
    },
    onSnapEnd: function() {
        board.position(game.fen());
    }
};

// 5. Create the board
board = Chessboard('myBoard', config);

// 6. Initial status call
updateStatus();
    }
    document.getElementById('status').innerHTML = status;
}
