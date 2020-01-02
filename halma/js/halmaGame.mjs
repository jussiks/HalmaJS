import {Piece} from "./piece.mjs";
import {Player} from './player.mjs';
import {Board} from './board.mjs';
import {Move} from './move.mjs';
import {HalmaSettings} from './halmaSettings.mjs';

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
        this.playerInTurn = Math.floor(Math.random() * this.players.length);
        this.turnContinues = false;

        this.msgCallback(
            `${this.getPlayerInTurn().color} player turn`, 
            this.getPlayerInTurn().color
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
            'chosenPiece': this.chosenPiece ? this.chosenPiece.toJSON() : undefined,
            'turnContinues': this.turnContinues
        };
    }

    static fromJSON(json, msgCallback, saveGameCallback) {
        let halma = new HalmaGame(msgCallback, saveGameCallback);
        halma.settings = HalmaSettings.fromJSON(json['settings']);
        halma.board = new Board(halma.settings, halma.onTdClick.bind(halma));
        halma.players = json['players'].map(j => Player.fromJSON(j, halma.setChosenPiece.bind(halma), halma.board));
        halma.playerInTurn = json['playerInTurn'];
        //TODO
        halma.chosenPiece = halma.getPlayerInTurn().pieces.find(
            p => p.toJSON() === json['chosenPiece']
        );
        halma.turnContinues = json['turnContinues'];

        if (halma.chosenPiece)
            halma.setChosenPiece(halma.chosenPiece);
        //TODO
        msgCallback(
            `${halma.getPlayerInTurn().color} player turn`, 
            halma.getPlayerInTurn().color
        );

        return halma;
    }

    getPlayerInTurn() {
        return this.players[this.playerInTurn];
    }

    onTdClick(square) {
        if (this.chosenPiece)
            this.movePiece(this.chosenPiece, square);
    }

    movePiece(piece, square) {
        let move = new Move(piece, square);
        if (move.isValid()) {
            if (!this.turnContinues || move.isJump()) {
                move.execute();
                // bug: [5,6] -> [7,6] could continue? 
                if (piece.isInGoalZone() && this.getPlayerInTurn().hasWon()) {
                    this.msgCallback(
                        `${this.getPlayerInTurn().color} player won!`,
                        this.getPlayerInTurn().color);
                    this.chosenPiece.highlight(false);
                    this.chosenPiece = undefined;
                    this.turnContinues = true;
                }
                else {
                    this.turnContinues = move.canJumpAgain;
                    if (!this.turnContinues)
                        this.changeTurn();
                }
                this.saveGameCallback();
            }
        }
    }

    setChosenPiece(piece) {
        if (piece.color === this.getPlayerInTurn().color && !this.turnContinues) {
            if (this.chosenPiece)
            this.chosenPiece.highlight(false);

            piece.highlight(true);
            this.chosenPiece = piece;
        }
    }

    changeTurn() {
        this.playerInTurn += 1;
        this.playerInTurn = this.playerInTurn % this.players.length;
        this.turnContinues = false;
        if (this.chosenPiece)
            this.chosenPiece.highlight(false);
        this.chosenPiece = undefined;
        this.msgCallback(
            `${this.getPlayerInTurn().color} player turn`, 
            this.getPlayerInTurn().color
        );
    }

    resizeSquares(squareSize) {
        this.board.resizeSquares(squareSize);
    }
}