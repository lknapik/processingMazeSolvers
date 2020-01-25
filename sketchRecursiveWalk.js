
var width = 800;
var height = 800;
var gridSize = 20;
var gridLength = width/gridSize;
var buffer = 0.15*gridLength;
var rectSize = gridLength-2*buffer;
var playerX = 0;
var playerY = 0;

var facing = 'n';
var moveList = ["n", "e", "s", "w"];

var startTime;

function setup(){
    createCanvas(800, 800);
    frameRate(90);
    mazeArray = genMaze();
    drawMaze(mazeArray);
    date = new Date();
    startTime = date.getTime()
    fill(0);
    rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
}

//turn left, if not go straight, if not turn right, if not turn around
//relative to movement direction not cardinal direction
function draw(){
    if(playerX == gridSize-1 & playerY == gridSize-1){
        date = new Date();
        endTime = date.getTime()
        console.log((endTime-startTime)/1000);
        fill(255);
        stroke(255);
        rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
        playerX = 0;
        playerY = 0; 
        fill(255);
        rect(0,0,width,height);
        mazeArray = genMaze();
        drawMaze(mazeArray);
        
        startTime = endTime;
    }

    tempFacing = moveList[(moveList.indexOf(facing)+3)%4];
    if(noWalls(playerX, playerY, tempFacing) == true){
        move(tempFacing);
        facing = tempFacing;
    } else {//go straight
        if(noWalls(playerX,playerY,facing) == true){
            move(facing)
        } else {//turn right
            tempFacing = moveList[(moveList.indexOf(facing)+1)%4];
            if(noWalls(playerX, playerY, tempFacing) == true){
                move(tempFacing);
                facing = tempFacing;
        } else{// turn around

            tempFacing = moveList[(moveList.indexOf(facing)+2)%4];
                if(noWalls(playerX, playerY, tempFacing) == true){
                    move(tempFacing);
                    facing = tempFacing;
            }
    }
}
    }
}

function noWalls(X, Y, direction){
    walls = mazeArray[Y][X];
    var result;
    if(walls.indexOf(direction) != -1){
        result = false;
    } else {
        result = true;
    }
    return(result);
}

//can move in 0,1,2,3 refers to n,e,s,w
function move(dir){
    direction = dir
    fill(255);
    stroke(255);
    rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
    if(direction == "n"){
        if(noWalls(playerX, playerY, direction) == true){
            playerY -= 1;
        }
    } else if(direction == 'e'){
        if(noWalls(playerX, playerY, direction) == true){
            playerX += 1;
        }
    } else if(direction == 's'){
        if(noWalls(playerX, playerY, direction) == true){
            playerY += 1;
        }
    } else if(direction == 'w'){
        if(noWalls(playerX, playerY, direction) == true){
            playerX -= 1;
        }
    }
    noStroke();
    fill(0);
    rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
}



function genMaze(){
    //Uses Prim's algorithm

    

    //in grid 0 = unvisited, 1= visited, 2 = frontier
    //Creates full grid
    var mazeArray = [];
    var grid = [];
    for(var i=0; i<gridSize; i++){
        tempArray = [];
        tempGrid = [];
        for(var j=0; j<gridSize; j++){
            tempArray.push('nsew');
            tempGrid.push(0);
        };
        mazeArray.push(tempArray);
        grid.push(tempGrid);
    };

    function add_frontiers(x,y){
        if(x>=0 && y>=0 && y<gridSize && x<gridSize && grid[y][x] != 1){
            grid[y][x] = 2;
        }
    }

    function getNeighbor(x,y){
        if(x>=0 && y>=0 && y<gridSize && x<gridSize && grid[y][x] == 1){
            return([x,y]);
        } else {
            return(null);
        }
    }

    function mark(x,y){
        grid[y][x] = 1;
        add_frontiers(x+1,y);
        add_frontiers(x-1,y);
        add_frontiers(x,y+1);
        add_frontiers(x,y-1);
    }

    mark(Math.floor(Math.random()*9),Math.floor(Math.random()*9))
    frontierList = [];
    for(var y = 0; y <= gridSize-1; y++) {
        (grid[y]).forEach(function getFrontier(item, index){
            if(item == 2){
                frontierList.push([index, y]);
            }
        });
    };

    while(frontierList.length != 1){
        frontierList = [];
        for(var y = 0; y <= gridSize-1; y++){
            grid[y].forEach(function getFrontier(item, index){
                if(item == 2){
                    frontierList.push([index, y]);
                }
            });
        };
        randIndex = Math.floor(Math.random()*frontierList.length);
        var fcoord = frontierList[randIndex];
        fx = fcoord[0];
        fy = fcoord[1];

        neighborList = [];
        neighborList.push(getNeighbor(fx+1, fy));
        neighborList.push(getNeighbor(fx-1, fy));
        neighborList.push(getNeighbor(fx, fy+1));
        neighborList.push(getNeighbor(fx, fy-1));

        neighborList = neighborList.filter(function (el){
            return el != null;
        });

        ncoord = neighborList[Math.floor(Math.random()*neighborList.length)]

        nx = ncoord[0];
        ny = ncoord[1];

        var diffX = nx-fx;
        var diffY = ny-fy;

        if(diffX == 1){
            mazeArray[ny][nx] = mazeArray[ny][nx].replace('w', '');
            mazeArray[fy][fx] = mazeArray[fy][fx].replace('e', '');
        } else if(diffX == -1){
            mazeArray[ny][nx] = mazeArray[ny][nx].replace('e', '');
            mazeArray[fy][fx] = mazeArray[fy][fx].replace('w', '');
        } else if(diffY == 1){
            mazeArray[ny][nx] = mazeArray[ny][nx].replace('n', '');
            mazeArray[fy][fx] = mazeArray[fy][fx].replace('s', '');
        } else if(diffY == -1){
            mazeArray[ny][nx] = mazeArray[ny][nx].replace('s', '');
            mazeArray[fy][fx] = mazeArray[fy][fx].replace('n', '');
        }
        mark(fx, fy);
        
    }
    return(mazeArray);

}

function drawMaze(mazeArray){
    stroke(0);
    for(var y=0; y<=gridSize-1; y++){
        for(var x=0; x<=gridSize-1; x++){
            
            walls = mazeArray[y][x];
            if(walls.indexOf('n') != -1){
                line(gridToPos(x), gridToPos(y), gridToPos(x)+gridLength, gridToPos(y));
            }
            if(walls.indexOf('s') != -1){
                line(gridToPos(x), gridToPos(y)+gridLength, gridToPos(x)+gridLength, gridToPos(y)+gridLength);
            }
            if(walls.indexOf('e') != -1){
                line(gridToPos(x)+gridLength, gridToPos(y), gridToPos(x)+gridLength, gridToPos(y)+gridLength);
            }
            if(walls.indexOf('w') != -1){
                line(gridToPos(x), gridToPos(y), gridToPos(x), gridToPos(y)+gridLength);
            }

        };
    };

}

function gridToPos(gridValue){
    return(gridLength*gridValue);
}