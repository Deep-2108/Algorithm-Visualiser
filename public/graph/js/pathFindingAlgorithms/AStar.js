// A* Algorithm

// importing functions
import {
    setWallAttribute
} from '../wall.js';
import {
    rowsize,
    colsize
} from '../main.js';


// variables
var container = document.querySelector('.container');
var slider = document.getElementById("speed");
var time = slider.value;
console.log(time);

function calc(node, x2, y2) {
    let row = parseInt(node.getAttribute('row'));
    let col = parseInt(node.getAttribute('col'));
    return parseInt(node.getAttribute('cost')) +
        Math.sqrt(Math.pow((row - x2), 2) + Math.pow(col - y2, 2));
}

// Animate the nodes
function changeColor(node, counter, cost) {
	setTimeout(() => {
		node.setAttribute('class','Path_green');
		if (cost) {
			node.innerHTML = cost;
		}
	}, counter * time);
	setTimeout(() => {
		node.setAttribute('class','Path_red');
	}, counter * time + 100);
} // End changeColor

function checkNode(row, col, curr, checker, seen, counter) {
    if (row >= 0 && col >= 0 && row < rowsize && col < colsize) {
        var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
        let wall = parseInt(node.getAttribute('wall'));
        if (wall == 1) return;
        let prow = parseInt(curr.getAttribute('row'));
        let pcol = parseInt(curr.getAttribute('col'));
        // console.log(wall);
        var cost = Math.min(
            parseInt(curr.getAttribute('cost')) +
            Math.abs(Math.pow(prow - row, 2) + Math.pow(pcol - col, 2)),
            node.getAttribute('cost')
        );
        if (cost < node.getAttribute('cost')) {
            node.setAttribute(
                'parent',
                curr.getAttribute('row') + '|' + curr.getAttribute('col')
            );
            node.setAttribute('cost', cost);
        }

        // changeColor(node, counter, cost);
        changeColor(curr, counter, curr.getAttribute('cost'));
        if (!seen.includes(node)) {
            checker.push(node);
        }
        seen.push(node);
        return node;
    } else {
        return false;
    }
}

export function Astr(x1 = 0, y1 = 0, x2 = rowsize - 1, y2 = colsize - 1) {
    time = slider.value;
   time = 100 + (time - 1) * (-2);
    container.removeEventListener('mousedown', setWallAttribute);
    container.removeEventListener('mouseover', setWallAttribute);
    var startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
    var endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);
    // Hide button
    var btn = document.querySelector('.start');
    var refreshBtn = document.querySelector('.refresh');
    btn.style.visibility = 'hidden';
    // refreshBtn.style.visibility = 'hidden';

    // Algo here
    var seen = [startNode];
    var checker = [startNode];
    var counter = 1;
    while (checker.length != 0) {
        checker.sort(function (a, b) {
            if (calc(a, x2, y2) < calc(b, x2, y2)) return 1;
            if (calc(a, x2, y2) > calc(b, x2, y2)) return -1;
            return 0;
        });

        let curr = checker.pop();
        console.log("Curr", curr);
        // Important to parse string to integer
        let row = parseInt(curr.getAttribute('row'));
        let col = parseInt(curr.getAttribute('col'));
        if (row == x2 && col == y2) break;
        let wall = parseInt(curr.getAttribute('wall'));
        if (wall == 1) continue;

        // Check up down left right
        let nextRow = row + 1;
        let prevRow = row - 1;
        let leftCol = col - 1;
        let rightCol = col + 1;
        let a = checkNode(nextRow, col, curr, checker, seen, counter);
        let b = checkNode(prevRow, col, curr, checker, seen, counter);
        let c = checkNode(row, leftCol, curr, checker, seen, counter);
        let d = checkNode(row, rightCol, curr, checker, seen, counter);
        counter++;
    }

    // Draw out best route
    setTimeout(() => {
        startNode.setAttribute('class', 'ends');
        while (endNode.getAttribute('parent') != 'null') {
            endNode.setAttribute('class', 'Path_green');
            var coor = endNode.getAttribute('parent').split('|');
            var prow = parseInt(coor[0]);
            var pcol = parseInt(coor[1]);
            endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
        }
        endNode = document.querySelector(`div[row="${x2}"][col="${y2}"]`);
        endNode.setAttribute('class','ends');
    }, counter * time + 100);
    // Show refresh button again
    setTimeout(() => {
        refreshBtn.style.visibility = 'visible';
    }, counter * time + 100);
} // End start