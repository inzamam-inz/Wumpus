import { Component, OnInit } from '@angular/core';
import { min } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  board : any;
  decision:any;

  agentX : number = 2;
  agentY : number = 3;

  traverse_board : any;
  copy_traverse_board : any;

  iskilled : any;

  numOfGolds : number = 0;
  numOfWumpus : number = 0;
  numOfArrows : number = 0;

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
                          ['A','S','S','S','S','W','S','S','S','S']];


    this.copy_traverse_board = [['S','W','S','S','S','S','S','S','P','S'],
                                ['S','S','S','S','S','S','S','S','S','S'],
                                ['P','S','S','P','S','S','P','S','W','G'],
                                ['S','S','S','S','S','S','S','S','S','P'],
                                ['S','S','G','S','S','W','S','S','P','S'],
                                ['W','P','P','S','S','S','S','S','S','S'],
                                ['S','W','G','S','S','S','W','S','S','S'],
                                ['S','S','P','S','G','P','S','S','G','S'],
                                ['S','S','S','S','P','S','S','S','S','S'],
                                ['S','S','S','S','S','W','S','S','S','S']];

    this.findBoardValues();
    console.log(this.agentX + " " + this.agentY);


  }

  findBoardValues()
  {
    for(let i=0;i<10;i++)
    {
      for(let j=0;j<10;j++)
      {
        if(this.traverse_board[i][j]=='A')
        {
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
          console.log('i: '+ i + ' j: ' + j + ' ' +this.traverse_board[i][j] + this.copy_traverse_board[i][j]);
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

  checkGridStatus(x:number, y:number) : any {
    let fx = [+1, -1, +0, +0];
    let fy = [+0, +0, +1, -1];

    let mask = 0;
    for (let i = 0; i < 4; ++i) {
      let X = x + fx[i];
      let Y = y + fy[i];

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

    console.log(this.agentX + " left " + this.agentY);

  }

  moveRight()
  {
    this.board[this.agentX][this.agentY]=1;


    this.agentY = Math.min(9, this.agentY+1);
    this.board[this.agentX][this.agentY]=2;
    console.log(this.agentX + " right " + this.agentY);

  }

  moveDown()
  {
    this.board[this.agentX][this.agentY]=1;


    this.agentX = Math.min(this.agentX+1,9);
    this.board[this.agentX][this.agentY]=2;
    console.log(this.agentX + " down " + this.agentY);

  }

  moveUp()
  {
    this.board[this.agentX][this.agentY]=1;

    this.agentX = Math.max(0,this.agentX-1);
    this.board[this.agentX][this.agentY]=2;
    console.log(this.agentX + " up " + this.agentY);


  }

  arrowUp(){
    if(this.traverse_board[this.agentX-1][this.agentY]=='W')
    {
      this.traverse_board[this.agentX-1][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX-1][this.agentY] = 'S';

      //this.board[this.agentX-1][this.agentY] = 1;
    }
  }

  arrowDown(){
    if(this.traverse_board[this.agentX+1][this.agentY]=='W')
    {
      this.traverse_board[this.agentX+1][this.agentY] = 'S';
      this.copy_traverse_board[this.agentX+1][this.agentY] = 'S';

      //this.board[this.agentX+1][this.agentY] = 1;
    }
  }

  arrowLeft(){
    if(this.traverse_board[this.agentX][this.agentY-1]=='W')
    {
      this.traverse_board[this.agentX][this.agentY-1] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY-1] = 'S';

      //this.board[this.agentX][this.agentY-1] = 1;
    }
  }

  arrowRight(){
    if(this.traverse_board[this.agentX][this.agentY+1]=='W')
    {
      this.traverse_board[this.agentX][this.agentY+1] = 'S';
      this.copy_traverse_board[this.agentX][this.agentY+1] = 'S';

      //this.board[this.agentX][this.agentY+1] = 1;
    }
  }



}
