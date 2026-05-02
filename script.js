// 1. Initialize the game logic (referee)
var game = new Chess();

// 2. Define exactly where the pieces are hosted online
function getPieceUrl(piece) {
    // This uses the official chessboardjs.com assets
    return 'https://chessboardjs.com/img/chesspieces/wikipedia/' + piece + '.png';
}

// 3. Setup the board configuration
var config = {
    draggable: true,
    position: 'start',
    pieceTheme: getPieceUrl, // Tell the board to use our URL function
    onDragStart: function(source, piece, position, orientation) {
        // Prevent moving if game is over or wrong turn
        if (game.game_over()) return false;
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    },
    onDrop: function(source, target) {
        // Check if move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' 
        });

        // If illegal, snap piece back
        if (move === null) return 'snapback';
        
        updateStatus();
    },
    onSnapEnd: function() {
        // Update board for castling, en passant, etc.
        board.position(game.fen());
    }
};

// 4. Create the board
var board = Chessboard('myBoard', config);

// 5. Status update function
function updateStatus() {
    var status = '';
    var moveColor = (game.turn() === 'w') ? 'White' : 'Black';

    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    } else if (game.in_draw()) {
        status = 'Game over, Draw';
    } else {
        status = moveColor + ' to move';
        if (game.in_check()) status += ', ' + moveColor + ' is in check';
    }
    document.getElementById('status').innerHTML = status;
}
