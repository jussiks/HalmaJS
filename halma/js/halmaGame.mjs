import {Piece} from "./piece.mjs";
import {Player} from './player.mjs';
import {Board} from './board.mjs';
import {Move} from './move.mjs';

export class HalmaGame {
    constructor(msgCallback, saveGameCallback) {
        this.msgCallback = msgCallback;
        this.saveGameCallback = saveGameCallback;
    }

    startGame(settings) {
        this.settings = settings;
        this.board = new Board(this.settings, this.onTdClick.bind(this));
        this.chosenPiece = undefined;
        this.players = [];
        let colors = settings.getPlayerColors();

        for (let k in colors) {
            this.players.push(new Player(colors[k]));
        }
        this.playerInTurn = 0; //TODO randomize this

        this.msgCallback(
            `${this.players[this.playerInTurn].color} player turn`, 
            this.players[this.playerInTurn].color
        );

        let szones = this.settings.getStartZones();

        for (let i = 0; i < szones.length; i++) {
            for (let j = 0; j < szones[i].length; j++) {
                if (szones[i][j]) {
                    let player = this.players.find(plr => plr.color === szones[i][j]);
                    let piece = new Piece(player.color, this.setChosenPiece.bind(this));
                    player.addPiece(piece);
                    piece.place(this.board.getSquare([j, i]))
                }
            }
        }

        this.saveGameCallback();
    }

    getElement() {
        return this.board.getElement();
    }

    toJSON() {
        return {
            'settings': this.settings.toJSON(),
            'players': this.players.map(p => p.toJSON()),
            'playerInTurn': this.playerInTurn,
            'chosenPiece': this.chosenPiece ? this.chosenPiece.toJSON() : undefined
        };
    }

    static fromJSON(json, msgCallback, saveGameCallback) {
        let halma = new HalmaGame(msgCallback, saveGameCallback);
        //TODO
        return halma;
    }

    onTdClick(square) {
        if (this.chosenPiece)
            this.movePiece(this.chosenPiece, square);
    }

    movePiece(piece, square) {
        let move = new Move(piece, square);
        move.execute();

        //TODO turn continues check
    }

    setChosenPiece(piece) {
        if (piece.color === this.players[this.playerInTurn].color) {
            if (this.chosenPiece)
            this.chosenPiece.highlight(false);

            piece.highlight(true);
            this.chosenPiece = piece;
        }
    }

    changeTurn() {
        console.log('not yet implemented');
        //TODO
        this.saveGameCallback();
    }

    resizeSquares(squareSize) {
        this.board.resizeSquares(squareSize);
    }
}