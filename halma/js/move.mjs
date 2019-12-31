export class Move {
    constructor(piece, targetSquare) {
        this.piece = piece;
        this.curSquare = piece.getSquare();
        this.targetSquare = targetSquare;
        this.distance = this.getDistance();

        this.jump = false;
        this.valid = 
            this.isTargetEmpty() &&
            !this.isMoveAwayFromGoal() &&
            this.isDistanceValid()
    }

    isTargetEmpty() {
        return !this.targetSquare.containsPiece();
    }

    isMoveAwayFromGoal() {
        return this.curSquare.isGoalZone(this.piece) && !this.targetSquare.isGoalZone(this.piece);
    }

    isDistanceValid() {
        if (Math.max(...this.distance) === 1)
            return true;
        if (Math.max(...this.distance) === 2 && Math.min(...this.distance) !== 1) {
            let gapSquare = this.getGapSquare();
            if (gapSquare.containsPiece()) {
                this.jump = true;
                return true;
            }
        }
        return false;
    }

    getGapSquare() {
        let gapPos = [
            (this.curSquare.getPosition()[0] + this.targetSquare.getPosition()[0]) / 2,
            (this.curSquare.getPosition()[1] + this.targetSquare.getPosition()[1]) / 2
        ];
        return this.targetSquare.board.getSquare(gapPos);
    }

    getDistance() {
        return [
            Math.abs(this.curSquare.getPosition()[0] - this.targetSquare.getPosition()[0]),
            Math.abs(this.curSquare.getPosition()[1] - this.targetSquare.getPosition()[1])
        ]
    }

    isValid() {
        return this.valid;
    }

    isJump() {
        return this.jump
    }

    execute() {
        if (this.valid)
            this.piece.place(this.targetSquare);
    }
}