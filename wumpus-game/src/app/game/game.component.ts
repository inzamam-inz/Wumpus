import { XhrFactory } from '@angular/common';
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

  board : any;
  decision:any;

  agentX : number = 2;
  agentY : number = 3;

  traverse_board : any;
  copy_traverse_board : any;

  iskilled : number = 0;

  numOfGolds : number = 0;
  numOfWumpus : number = 0;
  numOfArrows : number = 0;

  visitedGrid : Coordinate[] = [];


  constructor() { }

  ngOnInit(): void {

    this.board = [[0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0,0]];


    this.traverse_board = [['S','W','S','S','S','S','S','S','P','S'],
                          ['S','S','S','S','S','S','S','S','S','S'],
                          ['P','S','S','P','S','S','P','S','W','G'],
                          ['S','S','S','S','S','S','S','S','S','P'],
                          ['S','S','G','S','S','W','S','S','P','S'],
                          ['W','P','P','S','S','S','S','S','S','S'],
                          ['S','W','G','S','S','S','W','S','S','S'],
                          ['S','S','P','S','G','P','S','S','G','S'],
                          ['S','S','S','S','P','S','S','S','S','S'],
                          ['A','S','S','P','S','W','S','S','S','S']];


    this.copy_traverse_board = [['S','W','S','S','S','S','S','S','P','S'],
                                ['S','S','S','S','S','S','S','S','S','S'],
                                ['P','S','S','P','S','S','P','S','W','G'],
                                ['S','S','S','S','S','S','S','S','S','P'],
                                ['S','S','G','S','S','W','S','S','P','S'],
                                ['W','P','P','S','S','S','S','S','S','S'],
                                ['S','W','G','S','S','S','W','S','S','S'],
                                ['S','S','P','S','G','P','S','S','G','S'],
                                ['S','S','S','S','P','S','S','S','S','S'],
                                ['S','S','S','P','S','W','S','S','S','S']];

    this.findBoardValues();
    this.AImove();
    //console.log(this.agentX + " " + this.agentY);


  }

  findBoardValues()
  {
    for(let i=0;i<10;i++)
    {
      for(let j=0;j<10;j++)
      {
        if(this.traverse_board[i][j]=='A')
        {
          this.visitedGrid.push(new Coordinate(i, j));
          this.board[i][j]=2;
          this.agentX = i;
          this.agentY = j;
          this.traverse_board[i][j] ='S';
        }
        else if(this.traverse_board[i][j]=='S')
        {
          this.checkPit(i,j);
          this.checkWumpus(i,j);
          this.checkPit_Wumpus(i,j);
          //console.log('i: '+ i + ' j: ' + j + ' ' +this.traverse_board[i][j] + this.copy_traverse_board[i][j]);
        }
        else if(this.traverse_board[i][j]=='G')
        {
          this.numOfGolds = this.numOfGolds + 1;
        }
        else if(this.traverse_board[i][j]=='W'){
          this.numOfWumpus++;
          this.numOfArrows++;
        }

      }

    }
  }

  checkPit_Wumpus(i:number,j:number)
  {

    if((i+1<=9 && j+1<=9) && ((this.traverse_board[i+1][j]=='W' && this.traverse_board[i][j+1]=='P')||(this.traverse_board[i+1][j]=='P' && this.traverse_board[i][j+1]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }
    if(i+1<=9 && j-1>=0 && ((this.traverse_board[i+1][j]=='W' && this.traverse_board[i][j-1]=='P')||(this.traverse_board[i+1][j]=='P' && this.traverse_board[i][j-1]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }
    if(i-1>=0 && j-1>=0 && ((this.traverse_board[i-1][j]=='W' && this.traverse_board[i][j-1]=='P')||(this.traverse_board[i-1][j]=='P' && this.traverse_board[i][j-1]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }
    if(i-1>=0 && j+1<=9 && ((this.traverse_board[i-1][j]=='W' && this.traverse_board[i][j+1]=='P')||(this.traverse_board[i-1][j]=='P' && this.traverse_board[i][j+1]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }
    if(j-1>=0 && j+1<=9 && ((this.traverse_board[i][j-1]=='W' && this.traverse_board[i][j+1]=='P')||(this.traverse_board[i][j-1]=='P' && this.traverse_board[i][j+1]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }
    if(i+1<=9 && i-1<=0 &&  ((this.traverse_board[i+1][j]=='W' && this.traverse_board[i-1][j]=='P')||(this.traverse_board[i+1][j]=='P' && this.traverse_board[i-1][j]=='W')))
    {
      this.traverse_board[i][j] = 'SB';
    }

  }

  isVisited(i:number, j:number) {
    return this.board[i][j] == 1;
  }

  outOfBound(X : number, Y : number) : Boolean {
    return (Math.min(X, Y) < 0 || Math.max(X, Y) > 9);
  }

  checkGridStatus(x:number, y:number) : any {
    let mask = 0;
    for (let i = 0; i < 4; ++i) {
      let X = x + this.fx[i];
      let Y = y + this.fy[i];

      if (Math.min(X, Y) < 0 || Math.max(X, Y) > 9) continue;
      if (this.traverse_board[X][Y] == 'W') mask |= 1;
      if (this.traverse_board[X][Y] == 'P') mask |= 2;
    }

    if (mask == 1)       return "St";
    else if (mask == 2)  return "Br";
    else if (mask == 3)  return "SB";
    else                 return "S";
  }

  checkWumpus(i:number,j:number)
  {

    if(i+1<=9 && this.traverse_board[i+1][j]=='W')
    {
      this.traverse_board[i][j] = 'St';
    }
    if(i-1>=0 && this.traverse_board[i-1][j]=='W')
    {
      this.traverse_board[i][j] = 'St';
    }
    if(j-1>=0 && this.traverse_board[i][j-1]=='W')
    {
      this.traverse_board[i][j] = 'St';
    }
    if(j+1<=9 && this.traverse_board[i][j+1]=='W')
    {
      this.traverse_board[i][j] = 'St';
    }

  }

  checkPit(i:number,j:number)
  {

    if(i+1<=9 && this.traverse_board[i+1][j]=='P')
    {
      this.traverse_board[i][j] = 'Br';
    }
    if(i-1>=0 && this.traverse_board[i-1][j]=='P')
    {
      this.traverse_board[i][j] = 'Br';
    }
    if(j-1>=0 && this.traverse_board[i][j-1]=='P')
    {
      this.traverse_board[i][j] = 'Br';
    }
    if(j+1<=9 && this.traverse_board[i][j+1]=='P')
    {
      this.traverse_board[i][j] = 'Br';
    }

  }

  // decisionMaking(i:number,j:number)
  // {

  //   if(this.board[i][j]==1 && this.traverse_board[i][j]=='S')
  //   {
  //     if(i+1<=9 && i-1>=0)
  //     {
  //       if((this.traverse_board[i+1][j]=='P' && this.traverse_board[i-1][j]=='W') )
  //       {
  //           this.traverse_board[i][j] = 'SB';
  //           this.decision = 'WP';
  //       }
  //       else if((this.traverse_board[i+1][j]=='W' && this.traverse_board[i-1][j]=='P') )
  //       {
  //         this.traverse_board[i][j] = 'SB';
  //         this.decision = 'WP';
  //       }
  //     }

  //     if((i+1<=9 &&this.traverse_board[i+1][j]=='P') || ( i-1>=0 && this.traverse_board[i-1][j]=='P' ))
  //     {
  //       this.traverse_board[i][j] = 'Br';
  //       this.decision = 'P';
  //     }
  //     else if((i+1<=9 &&this.traverse_board[i+1][j]=='W') || ( i-1>=0 && this.traverse_board[i-1][j]=='W' ))
  //     {
  //       this.traverse_board[i][j] = 'St';
  //       this.decision = 'W';
  //     }


  //     if(j+1<=9 && j-1>=0)
  //     {
  //       if((this.traverse_board[i][j+1]=='P' && this.traverse_board[i][j-1]=='W'))
  //       {
  //         this.traverse_board[i][j] = 'SB';
  //           this.decision = 'WP';
  //       }
  //       else if( (this.traverse_board[i][j+1]=='W' && this.traverse_board[i][j-1]=='P'))
  //       {
  //         this.traverse_board[i][j] = 'SB';
  //         this.decision = 'WP';
  //       }
  //     }
  //     if((j+1<=9 && this.traverse_board[i][j+1]=='P') ||  (j-1>=0 && this.traverse_board[i][j-1]=='P'))
  //     {
  //       this.traverse_board[i][j] = 'Br';
  //       this.decision = 'P';
  //     }
  //     else if((j+1<=9 && this.traverse_board[i][j+1]=='W') || (j-1>=0 && this.traverse_board[i][j-1]=='W'))
  //     {
  //       this.traverse_board[i][j] = 'St';
  //       this.decision = 'W';
  //     }

  //   }
  //   else this.decision='s';
  //   console.log(this.decision);
  // }

  moveLeft()
  {
    this.board[this.agentX][this.agentY]=1;

    this.agentY = Math.max(0, this.agentY-1);
    this.board[this.agentX][this.agentY]=2;
    if(this.traverse_board[this.agentX][this.agentY]=='G') {
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if(this.traverse_board[this.agentX][this.agentY]=='W' || this.traverse_board[this.agentX][this.agentY]=='P') {
      console.log("GAME OVER");
    }
    console.log(this.agentX + " left " + this.agentY);

  }

  moveRight()
  {
    this.board[this.agentX][this.agentY]=1;


    this.agentY = Math.min(9, this.agentY+1);
    this.board[this.agentX][this.agentY]=2;
    if(this.traverse_board[this.agentX][this.agentY]=='G') {
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if(this.traverse_board[this.agentX][this.agentY]=='W' || this.traverse_board[this.agentX][this.agentY]=='P') {
      console.log("GAME OVER");
    }
    console.log(this.agentX + " right " + this.agentY);

  }

  moveDown()
  {
    this.board[this.agentX][this.agentY]=1;


    this.agentX = Math.min(this.agentX+1,9);
    this.board[this.agentX][this.agentY]=2;
    if(this.traverse_board[this.agentX][this.agentY]=='G') {
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if(this.traverse_board[this.agentX][this.agentY]=='W' || this.traverse_board[this.agentX][this.agentY]=='P') {
      console.log("GAME OVER");
    }
    console.log(this.agentX + " down " + this.agentY);

  }

  moveUp()
  {
    this.board[this.agentX][this.agentY]=1;

    this.agentX = Math.max(0,this.agentX-1);
    this.board[this.agentX][this.agentY]=2;
    if(this.traverse_board[this.agentX][this.agentY]=='G') {
      this.traverse_board[this.agentX][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY] = 'S';
    }
    if(this.traverse_board[this.agentX][this.agentY]=='W' || this.traverse_board[this.agentX][this.agentY]=='P') {

      console.log("GAME OVER");
    }
    console.log(this.agentX + " up " + this.agentY);
  }

  killStatus() : number {
    console.log(this.iskilled);
    return this.iskilled;
  }

  arrowUp(){
    if(this.traverse_board[this.agentX-1][this.agentY]=='W')
    {
      this.iskilled = 1;
      this.traverse_board[this.agentX-1][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX-1][this.agentY] = 'S';
      //setTimeout(this.killDone, 5000);
      //this.board[this.agentX-1][this.agentY] = 1;
    }
    else {
      this.iskilled = 2;
    }

  }

  arrowDown(){
    if(this.traverse_board[this.agentX+1][this.agentY]=='W')
    {
      this.iskilled = 1;
      this.traverse_board[this.agentX+1][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX+1][this.agentY] = 'S';

      //this.board[this.agentX+1][this.agentY] = 1;
    }
    else {
      this.iskilled = 2;
    }
  }

  arrowLeft(){
    if(this.traverse_board[this.agentX][this.agentY-1]=='W')
    {
      this.iskilled = 1;
      this.traverse_board[this.agentX][this.agentY-1] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY-1] = 'S';

      //this.board[this.agentX][this.agentY-1] = 1;
    }
    else {
      this.iskilled = 2;
    }
  }

  arrowRight(){
    if(this.traverse_board[this.agentX][this.agentY+1]=='W')
    {
      this.iskilled = 1;
      this.traverse_board[this.agentX][this.agentY+1] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY+1] = 'S';

      //this.board[this.agentX][this.agentY+1] = 1;
    }
    else {
      this.iskilled = 2;
      console.log("R");
    }
  }

  killSoundOff() {
    console.log("OFF");
    this.iskilled = 0;
    return true;
  }

  moveType(A : Coordinate, B : Coordinate) : string { // A to B
    if (A.x + 1 == B.x && A.y == B.y)       return 'U';
    else if (A.x == B.x + 1 && A.y == B.y)  return 'D';
    else  if (A.x == B.x && A.y + 1 == B.y) return 'L';
    else                                    return 'R';
  }


  reverseString(str: string) : string{
    let result = "";
    for (let i = str.length - 1; i >= 0; i--) {
      result += str[i];
    }
    return result;
  }

  findIntoArray(A : Coordinate, ary : Coordinate[]) : number {
    //console.log(ary);
    for (let i = 0; i < ary.length; ++i) {
      if (ary[i].x == A.x && ary[i].y == A.y)
        return i;
      //if (ary[i] === A)
    }
    return -1;
  }

  takeAMove(A : Coordinate, B : Coordinate, safe : Coordinate[]) {
    //this.visitedGrid.push(B);
    console.log(this.visitedGrid);
    let depth : number[] = [];
    let parentKey : Coordinate[] = [];
    let parentValue : Coordinate[] = [];
    let queue : Coordinate[] = [];

    depth.push(0);
    parentKey.push(A);
    parentValue.push(A);
    queue.push(A);

    let now = 0, len = 1;
    while (now < len) {
      let U : Coordinate = queue[now++];
      console.log(U, 'u');

      for (let i = 0; i < 4; ++i) {
        let X = U.x + this.fx[i];
        let Y = U.y + this.fy[i];

        let V = new Coordinate(X, Y);
        //console.log(new Coordinate(X, Y), 'v');
        //console.log(this.visitedGrid);
        //console.log(this.outOfBound(X, Y), this.findIntoArray(V, this.visitedGrid), this.findIntoArray(V, queue));

        if (this.outOfBound(X, Y))  continue;
        //console.log("*");
        if ((this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safe) == -1))  continue;
        //console.log("*");
        if (this.findIntoArray(V, queue) != -1)  continue;
        //console.log("*");

        //if (this.outOfBound(X, Y) || (this.findIntoArray(V, this.visitedGrid) == -1 && this.findIntoArray(V, safe) == -1) || this.findIntoArray(V, queue) != -1)  continue;

        depth.push(1 + depth[this.findIntoArray(U, parentKey)]);
        parentKey.push(V);
        parentValue.push(U);
        queue.push(V);
        len++;
        console.log(len, now);
      }
    }

    var path : string = "";

    //console.log(parentValue[this.findIntoArray(B, parantKey)]);
    let T : Coordinate = B;
    while (parentValue[this.findIntoArray(T, parentKey)] != T) {
      let t : Coordinate = parentValue[this.findIntoArray(T, parentKey)];
      console.log(T, t);
      path += this.moveType(T, t);
      T = t;
    }

    path = this.reverseString(path);
    console.log(path);
    console.log(depth);
    console.log(parentKey);
  }

  AImove() {
    let pitGrid : Coordinate[] = [];
    let safeGrid : Coordinate[] = [];
    let wumpusGrid : Coordinate[] = [];

    for (let i = 0; i < this.visitedGrid.length; ++i) {
      console.log("AAA");
      for (let j = 0; j < 4; ++j) {
        let X = this.fx[j] + this.visitedGrid[i].x;
        let Y = this.fy[j] + this.visitedGrid[i].y;

        if (this.outOfBound(X, Y)) continue;

        if (this.checkGridStatus(X, Y) == 'S' && this.visitedGrid.indexOf(new Coordinate(X, Y)) == -1) {
          safeGrid.push(new Coordinate(X, Y));
          console.log(X, Y);
        }

      }
    }
    this.takeAMove(this.visitedGrid[0], safeGrid[0], safeGrid);

  }


}
