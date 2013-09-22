"use strict";function Tile(a,b,c){this.number=a,this.coordinate=[],this.coordinate.row=b,this.coordinate.col=c,this.picked=!1,this.solved=!1}function Game(){var a=this;this.width=20,this.widths=[10,15,20,25,30],this.resetGame=function(){a.started=!1,a.win=!1,a.grid=[]},this.resetGame(),this.newGame=function(){this.resetGame(),this.started=!0,a.grid[0]=[];for(var b=-1,c=0;c<this.width;c++){do var d=Math.floor(10*Math.random());while(b==d||10==b+d);this.grid[0][c]=new Tile(d,0,c),b=d}this.grid[1]=[];for(var c=0;c<this.width;c++)this.grid[1][c]=new Tile(c%10,1,c);this.lastCoordinate=[],this.lastCoordinate.row=1,this.lastCoordinate.col=19},this.pickTile=function(c){function d(c,d){function e(c,d){var f=b(c,!0);return f.row==d.row&&f.col==d.col?!0:0==a.grid[f.row][f.col].solved?!1:e(f,d)}function f(b,c){if(b.col!=c.col)return!1;for(var d=Math.min(b.row,c.row)+1;d<Math.max(b.row,c.row);d++)if(!a.grid[d][b.col].solved)return!1;return!0}function g(b,c){if(Math.abs(b.row-c.row)!=Math.abs(b.col-c.col)||b.row==c.row)return!1;var d={row:b.row>c.row?b.row-1:b.row+1,col:b.col>c.col?b.col-1:b.col+1};return d.row==c.row&&d.col==c.col?!0:a.grid[d.row][d.col].solved?g(d,c):!1}return e(c.coordinate,d.coordinate)||e(d.coordinate,c.coordinate)||f(c.coordinate,d.coordinate)||g(c.coordinate,d.coordinate)}function e(){for(var b=0;b<=a.lastCoordinate.row;b++)for(var c=0;c<=(b==a.lastCoordinate.row?a.lastCoordinate.col:19);c++)if(!a.grid[b][c].solved)return!1;return!0}return c.solved?(this.firstPick&&(this.firstPick.picked=!1,this.firstPick=void 0),void 0):(this.firstPick?this.firstPick===c?(c.picked=!1,this.firstPick=void 0):this.firstPick.number!=c.number&&10!=this.firstPick.number+c.number||!d(this.firstPick,c)?(this.firstPick.picked=!1,c.picked=!0,this.firstPick=c):(this.firstPick.picked=!1,this.firstPick.solved=!0,c.picked=!1,c.solved=!0,this.firstPick=void 0,e()&&(this.win=!0)):(c.picked=!0,this.firstPick=c),void 0)};var b=function(b,c){var d={row:b.row,col:b.col};return d.col+=1,d.col==a.width&&(d.col=0,d.row+=1),c&&(d.row>a.lastCoordinate.row||d.row==a.lastCoordinate.row&&d.col>a.lastCoordinate.col)&&(d.row=0),d};this.deal=function(){for(var c={row:this.lastCoordinate.row,col:this.lastCoordinate.col},d=0;d<=c.row;d++)for(var e=0;e<=(d==c.row?c.col:a.width-1);e++)this.grid[d][e].solved||(this.lastCoordinate=b(this.lastCoordinate,!1),0==this.lastCoordinate.col&&(this.grid[this.lastCoordinate.row]=[]),this.grid[this.lastCoordinate.row][this.lastCoordinate.col]=new Tile(this.grid[d][e].number,this.lastCoordinate.row,this.lastCoordinate.col))},this.setWidth=function(b){a.width=b}}angular.module("NumidiApp",["ui","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]).factory("game",function(){return new Game}),angular.module("NumidiApp").controller("MainCtrl",["$scope","game",function(a,b){a.game=b}]);