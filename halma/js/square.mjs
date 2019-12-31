export class Square {
    constructor(board, [x, y], onSquareClick) {
        this.board = board;
        this.position = [x, y];
        this.goalZone = undefined;
        this.td = document.createElement('td');
        this.td.addEventListener('click', this.onTDClick.bind(this));
        this.onSquareClick = onSquareClick;
    }

    getElement() {
        return this.td;
    }

    containsPiece() {
        if (this.td.firstChild)
            return true;
        return false;
    }

    getPosition() {
        return this.position;
    }

    setGoalZone(color) {
        this.goalZone = color;
        this.td.setAttribute('class', 'camp');
    }

    getGoalZone() {
        return this.goalZone;
    }

    isGoalZone(piece) {
        return this.goalZone === piece.color;
    }

    onTDClick(e) {
        e.stopPropagation();
        this.onSquareClick(this);
    }

    resize(size) {
        this.td.style.width = size;
        this.td.style.height = size;
    }

    * getNeighbours([x, y]) {
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0)
                    continue;
                yield this.board.getSquare()[y + i][x + j];
            }
        }
    }
}