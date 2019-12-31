export class Player {
    constructor(color) {
        this.color = color;
        this.pieces = [];
    }

    toJSON() {
        let json = {};
        json[this.color] = this.pieces.map(p => p.toJSON());
        return json;
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