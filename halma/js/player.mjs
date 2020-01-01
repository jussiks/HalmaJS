import {Piece} from './piece.mjs';

export class Player {
    constructor(color) {
        this.color = color;
        this.pieces = [];
    }

    toJSON() {
        let json = {};
        json['color'] = this.color;
        json['pieces'] = this.pieces.map(p => p.toJSON());
        return json;
    }

    static fromJSON(json, onPieceSelected, board) {
        let plr = new Player(json['color']);
        json['pieces'].forEach(p => {
            let piece = new Piece(plr.color, onPieceSelected);
            piece.place(board.getSquare(p));
            plr.addPiece(piece);
        });
        return plr;
    }

    fromJSON(json) {
        console.log(json);
    }

    addPiece(piece) {
        this.pieces.push(piece);
    }

    hasWon() {
        return this.pieces.every(p => p.isInCamp());
    }
}