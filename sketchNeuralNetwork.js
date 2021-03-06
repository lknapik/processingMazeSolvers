
var width = 500;
var height = 500;
var gridSize = 10;
var gridLength = width/gridSize;
var buffer = 0.15*gridLength;
var rectSize = gridLength-2*buffer;
var playerX = 0;
var playerY = 0;

function setup(){

    createCanvas(500, 500);
    frameRate(10);

    const options = {
        inputs: 2,
        outputs: 1,
        task: 'regression',
        debug: true
    };


    const nn = ml5.neuralNetwork(options);

    mazeArray = genMaze();
    drawMaze(mazeArray);
    fill(0);
    rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
}

function draw(){
    
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

function move(dir){
    moveList = ["n", "e", "s", "w"];
    direction = moveList[dir-1]
    fill(255);
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