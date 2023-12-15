import { XhrFactory } from '@angular/common';
import { sanitizeIdentifier } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs';
import { Coordinate } from '../coordinate';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  fx = [+1, -1, +0, +0];
  fy = [+0, +0, +1, -1];

  board: any;
  decision: any;
  isGoldFound: number = 0;
  gameStatus: number = 0;

  risk: number = 0;
  score: number = 0;

  agentX: number = 2;
  agentY: number = 3;

  traverse_board: any;
  copy_traverse_board: any;
  wumpusPrediction: any;
  breezePrediction: any;
  nextPath: string = '';
  nextArrowMove: string = '';

  iskilled: number = 0;

  isShow: number = 0;
  status: string = "Show";
  totalScore: number = 0;
  file: any;
  filecontent: any;

  numOfGolds: number = 0;
  numOfWumpus: number = 0;
  numOfArrows: number = 0;
  arrow = new Audio('../../assets/arrow.mp3');
  wumpus = new Audio('../../assets/wumpus.mp3');
  no_arrow = new Audio('../../assets/no_arrow.mp3');

  visitedGrid: Coordinate[] = [];
  safestNode: Coordinate[] = [];


  constructor() { }

  ngOnInit(): void {

    this.board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

    //this.getTraverseBoard();

    this.traverse_board = [['S', 'W', 'S', 'S', 'S', 'S', 'S', 'S', 'P', 'S'],
    ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['P', 'S', 'S', 'P', 'S', 'S', 'P', 'S', 'W', 'G'],
    ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'P'],
    ['S', 'S', 'G', 'S', 'S', 'W', 'S', 'S', 'P', 'S'],
    ['W', 'P', 'P', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['S', 'W', 'G', 'S', 'S', 'S', 'W', 'S', 'S', 'S'],
    ['S', 'S', 'P', 'S', 'G', 'P', 'S', 'S', 'G', 'S'],
    ['S', 'S', 'S', 'S', 'P', 'S', 'S', 'S', 'S', 'S'],
    ['A', 'S', 'S', 'P', 'S', 'W', 'S', 'S', 'S', 'S']];



    this.findBoardValues();
    this.init();
    //this.AImove(new Coordinate(this.agentX, this.agentY));
    //console.log(this.agentX + " " + this.agentY);


  }

  init() {
    this.wumpusPrediction = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    this.breezePrediction = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  }

  findBoardValues() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.traverse_board[i][j] == 'A') {
          this.visitedGrid.push(new Coordinate(i, j));
          this.board[i][j] = 2;
          this.agentX = i;
          this.agentY = j;
          this.traverse_board[i][j] = 'S';
        }
        else if (this.traverse_board[i][j] == 'S') {
          this.checkPit(i, j);
          this.checkWumpus(i, j);
          this.checkPit_Wumpus(i, j);
          //console.log('i: '+ i + ' j: ' + j + ' ' +this.traverse_board[i][j] + this.copy_traverse_board[i][j]);
        }
        else if (this.traverse_board[i][j] == 'G') {
          this.numOfGolds = this.numOfGolds + 1;
        }
        else if (this.traverse_board[i][j] == 'W') {
          this.numOfWumpus++;
          this.numOfArrows++;
        }
      }
    }
  }

  checkPit_Wumpus(i: number, j: number) {

    if ((i + 1 <= 9 && j + 1 <= 9) && ((this.traverse_board[i + 1][j] == 'W' && this.traverse_board[i][j + 1] == 'P') || (this.traverse_board[i + 1][j] == 'P' && this.traverse_board[i][j + 1] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }
    if (i + 1 <= 9 && j - 1 >= 0 && ((this.traverse_board[i + 1][j] == 'W' && this.traverse_board[i][j - 1] == 'P') || (this.traverse_board[i + 1][j] == 'P' && this.traverse_board[i][j - 1] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }
    if (i - 1 >= 0 && j - 1 >= 0 && ((this.traverse_board[i - 1][j] == 'W' && this.traverse_board[i][j - 1] == 'P') || (this.traverse_board[i - 1][j] == 'P' && this.traverse_board[i][j - 1] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }
    if (i - 1 >= 0 && j + 1 <= 9 && ((this.traverse_board[i - 1][j] == 'W' && this.traverse_board[i][j + 1] == 'P') || (this.traverse_board[i - 1][j] == 'P' && this.traverse_board[i][j + 1] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }
    if (j - 1 >= 0 && j + 1 <= 9 && ((this.traverse_board[i][j - 1] == 'W' && this.traverse_board[i][j + 1] == 'P') || (this.traverse_board[i][j - 1] == 'P' && this.traverse_board[i][j + 1] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }
    if (i + 1 <= 9 && i - 1 <= 0 && ((this.traverse_board[i + 1][j] == 'W' && this.traverse_board[i - 1][j] == 'P') || (this.traverse_board[i + 1][j] == 'P' && this.traverse_board[i - 1][j] == 'W'))) {
      this.traverse_board[i][j] = 'SB';
    }

  }

  isVisited(i: number, j: number) {
    return this.board[i][j] == 1;
  }

  outOfBound(X: number, Y: number): Boolean {
    return (Math.min(X, Y) < 0 || Math.max(X, Y) > 9);
  }

  checkGridStatus(x: number, y: number): any {
    if ((this.traverse_board[x][y] == 'W' || this.traverse_board[x][y] == 'P')) return 'D';
    let mask = 0;
    for (let i = 0; i < 4; ++i) {
      let X = x + this.fx[i];
      let Y = y + this.fy[i];

      if ((Math.min(X, Y) < 0 || Math.max(X, Y) > 9)) continue;
      if (this.traverse_board[X][Y] == 'W') mask |= 1;
      if (this.traverse_board[X][Y] == 'P') mask |= 2;
    }

    if (mask == 1) return "St";
    else if (mask == 2) return "Br";
    else if (mask == 3) return "SB";
    else return "S";
  }

  checkWumpus(i: number, j: number) {
    if (i + 1 <= 9 && this.traverse_board[i + 1][j] == 'W') {
      this.traverse_board[i][j] = 'St';
    }
    if (i - 1 >= 0 && this.traverse_board[i - 1][j] == 'W') {
      this.traverse_board[i][j] = 'St';
    }
    if (j - 1 >= 0 && this.traverse_board[i][j - 1] == 'W') {
      this.traverse_board[i][j] = 'St';
    }
    if (j + 1 <= 9 && this.traverse_board[i][j + 1] == 'W') {
      this.traverse_board[i][j] = 'St';
    }
  }

  checkPit(i: number, j: number) {
    if (i + 1 <= 9 && this.traverse_board[i + 1][j] == 'P') {
      this.traverse_board[i][j] = 'Br';
    }
    if (i - 1 >= 0 && this.traverse_board[i - 1][j] == 'P') {
      this.traverse_board[i][j] = 'Br';
    }
    if (j - 1 >= 0 && this.traverse_board[i][j - 1] == 'P') {
      this.traverse_board[i][j] = 'Br';
    }
    if (j + 1 <= 9 && this.traverse_board[i][j + 1] == 'P') {
      this.traverse_board[i][j] = 'Br';
    }
  }


  moveLeft() {
    this.score -= 10;
    this.board[this.agentX][this.agentY] = 1;

    this.agentY = Math.max(0, this.agentY - 1);
    this.board[this.agentX][this.agentY] = 2;
    if (this.traverse_board[this.agentX][this.agentY] == 'G') {
      this.score += 2000;
      this.isGoldFound = 1;
      this.numOfGolds--;
      if (this.numOfGolds == 0) this.gameStatus = 1;
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if (this.traverse_board[this.agentX][this.agentY] == 'W' || this.traverse_board[this.agentX][this.agentY] == 'P') {
      this.gameStatus = -1;
      console.log("GAME OVER");
    }
    console.log(this.agentX + " left " + this.agentY);

  }

  moveRight() {
    this.score -= 10;
    this.board[this.agentX][this.agentY] = 1;
    this.agentY = Math.min(9, this.agentY + 1);
    this.board[this.agentX][this.agentY] = 2;
    if (this.traverse_board[this.agentX][this.agentY] == 'G') {
      this.score += 2000;
      this.isGoldFound = 1;
      this.numOfGolds--;
      if (this.numOfGolds == 0) this.gameStatus = 1;
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if (this.traverse_board[this.agentX][this.agentY] == 'W' || this.traverse_board[this.agentX][this.agentY] == 'P') {
      this.gameStatus = -1;
      console.log("GAME OVER");
    }
    console.log(this.agentX + " right " + this.agentY);

  }

  moveDown() {
    this.score -= 10;
    this.board[this.agentX][this.agentY] = 1;
    this.agentX = Math.min(this.agentX + 1, 9);
    this.board[this.agentX][this.agentY] = 2;
    if (this.traverse_board[this.agentX][this.agentY] == 'G') {
      this.score += 2000;
      this.isGoldFound = 1;
      this.numOfGolds--;
      if (this.numOfGolds == 0) this.gameStatus = 1;
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if (this.traverse_board[this.agentX][this.agentY] == 'W' || this.traverse_board[this.agentX][this.agentY] == 'P') {
      this.gameStatus = -1;
      console.log("GAME OVER");
    }
    console.log(this.agentX + " down " + this.agentY);
  }

  moveUp() {
    this.score -= 10;
    this.board[this.agentX][this.agentY] = 1;
    this.agentX = Math.max(0, this.agentX - 1);
    this.board[this.agentX][this.agentY] = 2;
    if (this.traverse_board[this.agentX][this.agentY] == 'G') {
      this.score += 2000;
      this.isGoldFound = 1;
      this.numOfGolds--;
      if (this.numOfGolds == 0) this.gameStatus = 1;
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if (this.traverse_board[this.agentX][this.agentY] == 'W' || this.traverse_board[this.agentX][this.agentY] == 'P') {
      this.gameStatus = -1;
      console.log("GAME OVER");
    }
    console.log(this.agentX + " up " + this.agentY);
  }

  killStatus(): number {
    console.log(this.iskilled);
    return this.iskilled;
  }

  arrowUp() {
    if (this.numOfArrows > 0) {
      this.score -= 100;

      if (this.traverse_board[Math.max(this.agentX - 1, 0)][this.agentY] == 'W') {
        this.wumpus.play();
        this.score += 1000;
        this.iskilled = 1;
        this.traverse_board[this.agentX - 1][this.agentY] = 'S';
        this.copy_traverse_board[this.agentX - 1][this.agentY] = 'S';

        //setTimeout(this.killDone, 5000);
        //this.board[this.agentX-1][this.agentY] = 1;
      }
      else {
        this.iskilled = 2;
        this.arrow.play();
      }
      this.numOfArrows = Math.max(0, this.numOfArrows - 1);
    }
    else {
      this.no_arrow.play();
    }


  }

  arrowDown() {
    if (this.numOfArrows > 0) {
      this.score -= 100;

      if (this.traverse_board[Math.min(this.agentX + 1, 9)][this.agentY] == 'W') {
        this.wumpus.play();
        this.score += 1000;
        this.iskilled = 1;
        this.traverse_board[this.agentX + 1][this.agentY] = 'S';
        this.copy_traverse_board[this.agentX + 1][this.agentY] = 'S';

        //this.board[this.agentX+1][this.agentY] = 1;
      }
      else {
        this.arrow.play();
        this.iskilled = 2;
      }
      this.numOfArrows = Math.max(0, this.numOfArrows - 1);
    }
    else {
      this.no_arrow.play();
    }
  }

  arrowLeft() {
    if (this.numOfArrows > 0) {
      this.score -= 100;

      if (this.traverse_board[this.agentX][Math.max(this.agentY - 1, 0)] == 'W') {
        this.wumpus.play();
        this.score += 1000;
        this.iskilled = 1;
        this.traverse_board[this.agentX][this.agentY - 1] = 'S';
        this.copy_traverse_board[this.agentX][this.agentY - 1] = 'S';


        //this.board[this.agentX][this.agentY-1] = 1;
      }
      else {
        this.arrow.play();
        this.iskilled = 2;
      }
      this.numOfArrows = Math.max(0, this.numOfArrows - 1);
    }
    else {
      this.no_arrow.play();
    }
  }

  arrowRight() {
    if (this.numOfArrows > 0) {
      this.score -= 100;

      if (this.traverse_board[this.agentX][Math.min(this.agentY + 1, 9)] == 'W') {
        this.wumpus.play();
        this.score += 1000;
        this.iskilled = 1;
        this.traverse_board[this.agentX][this.agentY + 1] = 'S';
        this.copy_traverse_board[this.agentX][this.agentY + 1] = 'S';

        //this.board[this.agentX][this.agentY+1] = 1;
      }
      else {
        this.arrow.play();
        this.iskilled = 2;
        console.log("R");
      }
      this.numOfArrows = Math.max(0, this.numOfArrows - 1);
    }
    else {
      this.no_arrow.play();
    }

  }

  makeZero() {
    this.isGoldFound = 0;
  }

  killSoundOff() {
    console.log("OFF");
    this.iskilled = 0;
  }

  moveType(A: Coordinate, B: Coordinate): string {
    if (A.x + 1 == B.x && A.y == B.y) return 'U';
    else if (A.x == B.x + 1 && A.y == B.y) return 'D';
    else if (A.x == B.x && A.y + 1 == B.y) return 'L';
    else return 'R';
  }


  reverseString(str: string): string {
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
      result += str[i];
    }
    return result;
  }

  findIntoArray(A: Coordinate, ary: Coordinate[]): number {
    //console.log("grid ", A , ary);
    for (let i = 0; i < ary.length; ++i) {
      if (ary[i].x == A.x && ary[i].y == A.y)
        return i;
      //if (ary[i] === A)
    }
    return -1;
  }

  takeAMove(A: Coordinate, safe: Coordinate[]) {
    //this.visitedGrid.push(B);
    //let copy : Coordinate[] = this.visitedGrid;
    //console.log("vis Take", A, "Agg");
    console.log("safe node to visit : ", safe);
    let depth: number[] = [];
    let parentKey: Coordinate[] = [];
    let parentValue: Coordinate[] = [];
    let queue: Coordinate[] = [];

    depth.push(0);
    parentKey.push(A);
    parentValue.push(A);
    console.log("A", queue);
    queue.push(A);
    console.log("B", queue);


    let now = 0, len = 1;
    while (now < len) {
      let U: Coordinate = queue[now];
      now++;
      console.log(U, 'u');

      for (let i = 0; i < 4; ++i) {
        let X = U.x + this.fx[i];
        let Y = U.y + this.fy[i];

        let V = new Coordinate(X, Y);
        //console.log(new Coordinate(X, Y), 'v');
        //console.log(this.visitedGrid);
        //console.log(this.outOfBound(X, Y), this.findIntoArray(V, this.visitedGrid), this.findIntoArray(V, queue));

        if (this.outOfBound(X, Y)) continue;
        //console.log("*");
        if ((this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safe) == -1)) continue;
        //console.log("*");
        if (this.findIntoArray(V, queue) != -1) continue;
        //console.log("*");

        //if (this.outOfBound(X, Y) || (this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safe) == -1) || this.findIntoArray(V, queue) != -1)  continue;

        depth.push(1 + depth[this.findIntoArray(U, parentKey)]);
        parentKey.push(V);
        parentValue.push(U);
        queue.push(V);
        len++;
        //console.log(len, now);
      }
    }

    var path: string = "";

    //console.log(parentValue[this.findIntoArray(B, parantKey)]);
    var T: Coordinate = A;
    var d: number = 1000;
    for (let i = 0; i < safe.length; ++i) {
      let ii: number = this.findIntoArray(safe[i], parentKey);
      console.log(safe[i], depth[ii]);
      if (ii != -1 && d > depth[ii]) {
        T = safe[i];
        d = depth[ii];
      }
    }
    console.log(T);
    if (T == undefined) {
      console.log("SAD");
      console.log(parentKey);
      console.log(parentValue);
      console.log(queue);
    }
    else {//this.visitedGrid.push(T);
      //console.log(d);
      //console.log(T, 'ss');
      while (parentValue[this.findIntoArray(T, parentKey)] != T) {
        let t: Coordinate = parentValue[this.findIntoArray(T, parentKey)];
        //console.log(T, t);
        path += this.moveType(T, t);
        T = t;
      }

      path = this.reverseString(path);
      console.log(path);
      console.log(depth);
      console.log(parentKey);

      return path;
    }
    return "L";
  }



  AImove(A: Coordinate) {
    let pitGrid: Coordinate[] = [];
    let safeGrid: Coordinate[] = [];
    let wumpusGrid: Coordinate[] = [];


    if (safeGrid.length) {
      console.log(safeGrid, A, "Agent");
      var path = this.takeAMove(A, safeGrid);
      console.log("path ", path)
      for (var i = 0; i < path.length; ++i) {
        if (path[i] == 'L') {
          this.moveLeft();
        }
        if (path[i] == 'D') {
          this.moveDown();
        }
        if (path[i] == 'R') {
          this.moveRight();
        }
        if (path[i] == 'U') {
          this.moveUp();
        }
      }
      ;
    }

  }

  nextAImove() {
    let copy: Coordinate[] = this.visitedGrid;
    console.log(copy, "AI move", this.agentX, this.agentY);
    this.AImove(new Coordinate(this.agentX, this.agentY));
  }

  moveForwardAI() {
    //this.init();
    let safestNode: Coordinate[] = [];
    let warningNode: Coordinate[] = [];
    let riskCountW: number[] = [];
    let riskCountB: number[] = [];

    if (this.findIntoArray(new Coordinate(this.agentX, this.agentY), this.visitedGrid) == -1) {
      this.visitedGrid.push(new Coordinate(this.agentX, this.agentY));
      this.wumpusPrediction[this.agentX][this.agentY] = 1;
      this.breezePrediction[this.agentX][this.agentY] = 1;
    }

    // safe node khuje ber kore
    for (let visit of this.visitedGrid) {

      if (this.checkGridStatus(visit.x, visit.y) == 'S') {
        for (let i = 0; i < 4; ++i) {
          let X = visit.x + this.fx[i];
          let Y = visit.y + this.fy[i];

          let V = new Coordinate(X, Y);

          if (this.outOfBound(X, Y)) continue;

          if ((this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safestNode) == -1)) {
            safestNode.push(V);
          }
        }
      }
    }

    //console.log("VOS", this.visitedGrid);

    // warning owala node khuje ber kore
    for (let visit of this.visitedGrid) {
      //console.log("+", visit);
      for (let i = 0; i < 4; ++i) {
        let X = visit.x + this.fx[i];
        let Y = visit.y + this.fy[i];

        let V = new Coordinate(X, Y);
        //console.log("_", V);

        if (this.outOfBound(X, Y)) continue;

        if (this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safestNode) == -1 && this.findIntoArray(V, warningNode) == -1) {
          warningNode.push(V);
          riskCountW.push(0);
          riskCountB.push(0);
        }

        let ii = this.findIntoArray(V, warningNode);
        if (ii == -1) continue;
        //console.log("*");
        //console.log(visit.x, visit.y, V);

        if (this.checkGridStatus(visit.x, visit.y) == 'St') {
          //this.wumpusPrediction[X][Y]++;
          riskCountW[ii]++;
        }
        if (this.checkGridStatus(visit.x, visit.y) == 'Br') {
          console.log(".", ii, V, visit);
          // this.breezePrediction[X][Y]++;
          riskCountB[ii]++;
        }
        if (this.checkGridStatus(visit.x, visit.y) == 'SB') {
          console.log(".", ii, V, visit);
          //this.wumpusPrediction[X][Y]++;
          //this.breezePrediction[X][Y]++;
          riskCountW[ii]++;
          riskCountB[ii]++;
        }
      }
      //console.log("#");
    }

    //console.log("warn", warningNode);

    if (safestNode.length) {
      var path = this.takeAMove(new Coordinate(this.agentX, this.agentY), safestNode);
      this.nextPath = path;
      //this.takeMoveForAPath(path);
      this.risk = 0;

      // TODO: visited korbo?????
      //this.visitedGrid.push(new Coordinate(this.agentX,this.agentY));
    }
    else {
      let wumpusRisk = 0, ii = -1;
      for (let i = 0; i < riskCountW.length; ++i) {
        if (this.wumpusPrediction[warningNode[i].x][warningNode[i].y]) continue;
        if (riskCountW[i] > wumpusRisk) {
          wumpusRisk = riskCountW[i];
          ii = i;
        }
      }
      if (ii != -1) {
        let wumpusNode: Coordinate[] = [];
        //wumpusNode.push(warningNode[ii]);
        for (let i = 0; i < 4; ++i) {
          let x = warningNode[ii].x + this.fx[i];
          let y = warningNode[ii].y + this.fy[i];

          if (this.findIntoArray(new Coordinate(x, y), this.visitedGrid) != -1) {
            wumpusNode.push(new Coordinate(x, y));
          }
        }
        var path = this.takeAMove(new Coordinate(this.agentX, this.agentY), wumpusNode);
        this.nextPath = path;
        //this.takeMoveForAPath(path);
        this.risk = 25;
        //console.log(, this.agentX, this.agentY);
        let tx = this.agentX;
        let ty = this.agentY;

        console.log("TTT", tx, ty);

        for (let i = 0; i < path.length; ++i) {
          if (path[i] == 'L') ty--;
          if (path[i] == 'R') ty++;
          if (path[i] == 'D') tx++;
          if (path[i] == 'U') tx--;
        }

        console.log("TTT", tx, ty);

        var move = this.moveType(warningNode[ii], new Coordinate(tx, ty));
        this.nextArrowMove = move;
        console.log("arr move", move);
      }
      else {
        for (let visit of this.visitedGrid) {
          if (this.checkGridStatus(visit.x, visit.y) == 'Br') {
            let cc = 0, id = 0;
            for (let i = 0; i < 4; ++i) {
              let x = visit.x + this.fx[i];
              let y = visit.y + this.fy[i];

              if (this.outOfBound(x, y)) continue;

              if (this.findIntoArray(new Coordinate(x, y), warningNode) != -1) {
                cc++;
                id = i;
              }
            }
            if (cc == 1) {
              let x = visit.x + this.fx[id];
              let y = visit.y + this.fy[id];
              console.log('HHH', id, x, y);
              this.breezePrediction[x][y] = 1;
            }
          }
        }
        let breezeNode: Coordinate[] = [];
        let id = 0;
        for (let i = 0; i < riskCountB.length; ++i) {
          if (this.breezePrediction[warningNode[i].x][warningNode[i].y] == 0) {
            id = i;
            break;
          }
        }
        for (let i = 0; i < riskCountB.length; ++i) {
          if (this.breezePrediction[warningNode[i].x][warningNode[i].y]) continue;
          if (riskCountB[i] < riskCountB[id]) {
            id = i;
          }
        }
        breezeNode.push(warningNode[id]);
        var path = this.takeAMove(new Coordinate(this.agentX, this.agentY), breezeNode);
        this.nextPath = path;
        //this.takeMoveForAPath(path);
        this.risk = riskCountB[id] * 25;

        console.log("TODO");
        console.log(warningNode);
        console.log(riskCountB);
        console.log(riskCountW);
        console.log(this.wumpusPrediction);
        console.log(this.breezePrediction);
        console.log(id);
      }
    }
  }

  takeMoveForAPath(path: string) {
    console.log("path ", path)
    for (var i = 0; i < path.length; ++i) {
      if (path[i] == 'L') {
        this.moveLeft();
      }
      if (path[i] == 'D') {
        this.moveDown();
      }
      if (path[i] == 'R') {
        this.moveRight();
      }
      if (path[i] == 'U') {
        this.moveUp();
      }
    }
  }

  nextDicMove() {
    if (this.nextPath.length) {
      if (this.nextPath[0] == 'L') {
        this.moveLeft();
      }
      if (this.nextPath[0] == 'D') {
        this.moveDown();
      }
      if (this.nextPath[0] == 'R') {
        this.moveRight();
      }
      if (this.nextPath[0] == 'U') {
        this.moveUp();
      }
      var tem = '';
      for (let i = 1; i < this.nextPath.length; ++i) {
        tem += this.nextPath[i];
      }
      this.nextPath = tem;
    }
    else if (this.nextArrowMove.length) {
      let x = this.agentX;
      let y = this.agentY;
      if (this.nextArrowMove == 'L') {
        this.arrowLeft();
        y--;
      }
      else if (this.nextArrowMove == 'D') {
        this.arrowDown();
        x++;
      }
      else if (this.nextArrowMove == 'U') {
        this.arrowUp();
        x--;
      }
      else if (this.nextArrowMove == 'R') {
        this.arrowRight();
        y++;
      }
      else {
        console.log("Error!");
      }
      this.wumpusPrediction[x][y] = 1;
      console.log(x, y);
      this.nextArrowMove = '';
    }
  }
}


