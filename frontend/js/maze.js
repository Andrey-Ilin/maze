/**
 * Created by andrej on 3/23/16.
 */

'use strict';

class Maze {
    constructor(options) {
        this._el = options.element;
        this._width = options.width;
        this._height = options.height;
        this._createMaze();
        this._el.addEventListener('click', this._onClick.bind(this));
        this._countEnters = 0;

    }

    _createMaze() {
        for (let i = 0; i < this._width; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this._height; j++) {
                let td = document.createElement('td');
                td.className = 'wall';
                tr.appendChild(td);
            }
            this._el.appendChild(tr);
        }

        let numberOfSquores = this._width * this._height;
        for (let k = 0; k < numberOfSquores; k++) {
            let i = Math.floor(Math.random() * this._width);
            let j = Math.floor(Math.random() * this._height);

            if (this._el.rows[i].cells[j].className == 'way'
               || (i == 0 || i == this._width - 1)
               || (j == 0 || j == (this._height - 1))) {
                continue;
            } else {
                this._el.rows[i].cells[j].className = 'way';
            }
        }
    }


    _onClick(event) {
        let target = event.target;

        if (target.tagName != 'TD'
           || this._countEnters > 1
           || target.className == 'wall'
           || target.className == 'enter') {
            return;
        } else {
            if (this._countEnters == 0) {
                this._enter = target;
            } else {
                this._exit = target;
            }
            this._highlight(target);
            this._countEnters++;
        }
    //
    }

    _highlight(node) {
        if (this._countEnters == 0) {
            node.className = 'enter';
            node.textContent = 0;
        } else {
            node.className = 'exit';
            this._searchWayFromEnterToExit(this._enter, this._exit);
            this._toColorWayFromExitToEnter(this._exit);
            this._numberDelete(this._el);
        }
    }


    _searchWayFromEnterToExit(enter, exit) {
        let enterY = enter.parentNode.sectionRowIndex;
        let enterX = enter.cellIndex;
        let enterNeighbours = [];

        if (this._el.rows[enterY].cells[enterX + 1].className != 'wall' &&  !this._el.rows[enterY].cells[enterX + 1].textContent) {
            this._el.rows[enterY].cells[enterX + 1].textContent = 1 + +this._el.rows[enterY].cells[enterX].textContent;

            if (this._el.rows[enterY].cells[enterX + 1].className == 'exit') {
                return;
            }

            enterNeighbours.push(this._el.rows[enterY].cells[enterX + 1]);
        }

        if (this._el.rows[enterY].cells[enterX - 1].className != 'wall' &&  !this._el.rows[enterY].cells[enterX - 1].textContent) {
            this._el.rows[enterY].cells[enterX - 1].textContent = 1 + +this._el.rows[enterY].cells[enterX].textContent;

            if (this._el.rows[enterY].cells[enterX - 1].className == 'exit') {
                return;
            }

            enterNeighbours.push(this._el.rows[enterY].cells[enterX - 1]);
        }

        if (this._el.rows[enterY - 1].cells[enterX].className != 'wall' &&  !this._el.rows[enterY - 1].cells[enterX].textContent) {
            this._el.rows[enterY - 1].cells[enterX].textContent = 1 + +this._el.rows[enterY].cells[enterX].textContent;

            if (this._el.rows[enterY - 1].cells[enterX].className == 'exit') {
                return;
            }

            enterNeighbours.push(this._el.rows[enterY - 1].cells[enterX]);
        }

        if (this._el.rows[enterY + 1].cells[enterX].className != 'wall' &&  !this._el.rows[enterY + 1].cells[enterX].textContent) {
            this._el.rows[enterY + 1].cells[enterX].textContent = 1 + +this._el.rows[enterY].cells[enterX].textContent;

            if (this._el.rows[enterY + 1].cells[enterX].className == 'exit') {
                return;
            }

            enterNeighbours.push(this._el.rows[enterY + 1].cells[enterX]);
        }

        for (let i = 0; i < enterNeighbours.length; i++) {
            this._searchWayFromEnterToExit(enterNeighbours[i], this._exit);
        }

    }

    _toColorWayFromExitToEnter(exit) {
        if (!this._exit.textContent) {
            this._numberDelete(this._el);
            this._showNotification();
        }

        let stepToEnter;
        let exitNeighbours = [];
        let exitY = exit.parentNode.sectionRowIndex;
        let exitX = exit.cellIndex;

        if (this._el.rows[exitY].cells[exitX].className == 'enter') {
            return;
        }

        if (this._el.rows[exitY].cells[exitX + 1].textContent) {
            exitNeighbours.push(this._el.rows[exitY].cells[exitX + 1]);
        }

        if (this._el.rows[exitY].cells[exitX - 1].textContent) {
            exitNeighbours.push(this._el.rows[exitY].cells[exitX - 1]);

        }

        if (this._el.rows[exitY - 1].cells[exitX].textContent) {
            exitNeighbours.push(this._el.rows[exitY - 1].cells[exitX]);
        }

        if (this._el.rows[exitY + 1].cells[exitX].textContent) {
            exitNeighbours.push(this._el.rows[exitY + 1].cells[exitX]);
        }

        stepToEnter = +exitNeighbours[0].textContent;

        for (let i = 0; i < exitNeighbours.length; i++) {
            if (+exitNeighbours[i].textContent < stepToEnter) {
                stepToEnter = +exitNeighbours[i].textContent;
            }
        }


        for (let i = 0; i < exitNeighbours.length; i++) {
            if (stepToEnter !== 0 && +exitNeighbours[i].textContent == stepToEnter) {
                exitNeighbours[i].style.background = 'yellow';
                this._toColorWayFromExitToEnter(exitNeighbours[i]);
            }
        }

    }

    _showNotification() {
        alert ("Way wasn't found!!!!")
    }

    _numberDelete(table) {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                table.rows[i].cells[j].textContent = '';
            }
        }
    }
}

module.exports = Maze;
