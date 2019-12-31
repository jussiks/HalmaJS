import {Square} from './square.mjs';

export class Board {
    constructor(settings, onSquareSelected) {
        this.onSquareClick = onSquareSelected;
        this.table = document.createElement('table');
        this.squares = [];
        let boardSize = settings.boardSize;
        let gzones = settings.getGoalZones();

        for (var i = 0; i < boardSize; i++) {
            var tr = document.createElement('tr');
            this.table.appendChild(tr);
            this.squares.push([]);
    
            for (var j = 0; j < boardSize; j++) {
                let square = new Square(this, [j, i], onSquareSelected);
                tr.appendChild(square.getElement());
                this.squares[i].push(square);

                if (gzones[i][j])
                    square.setGoalZone(gzones[i][j]);
            }
        }
    }

    asArray() {
        return this.squares.map(row => row.map(
            square => square.firstChild ? square.firstChild.getAttribute('class') : ''));
    }

    isFree(square) {
        return square.firstChild ? true : false;
    }

    getElement() {
        return this.table;
    }

    getSquare([x, y]) {
        return this.squares[y][x];
    }

    onTdClick(e) {
        e.stopPropagation();
        let td = e.target;
        this.onSquareClick(td);
    }

    resizeSquares(squareSize) {
        this.squares.forEach(row => row.forEach(
            square => square.resize(squareSize)));
    }
}