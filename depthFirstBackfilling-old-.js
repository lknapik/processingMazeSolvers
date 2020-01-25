
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
var mazeCopy;
var prevChangeCount = 1;
var changeCount = 0;

var mazeArray;
var grid;
var unvisitedList;
var validMoves;

var startTime;

function setup(){
    createCanvas(800, 800);
    frameRate(10);
    mazeArray = genMaze();
    drawMaze(mazeArray);
    date = new Date();
    startTime = date.getTime()
    
    mazeArray[0][0] = mazeArray[0][0].replace('n', '');
    mazeArray[gridSize-1][gridSize-1] = mazeArray[gridSize-1][gridSize-1].replace('s', '');

    mazeCopy = mazeArray;
}

//turn left, if not go straight, if not turn right, if not turn around
//relative to movement direction not cardinal direction
function draw(){
    
    if(prevChangeCount !=0){
        for(var y=0; y<mazeCopy.length; y++){
            for(var x=0; x<mazeCopy[y].length; x++){
                if(mazeCopy[y][x].length == 3){
                    corner = mazeCopy[y][x];
                    if(corner.indexOf('n') == -1){
                        mazeCopy[y-1][x] = mazeCopy[y-1][x] + 's';
                        mazeCopy[y][x] = mazeCopy[y][x] + 'n';
                    }else if(corner.indexOf('e') == -1){
                        mazeCopy[y][x+1] = mazeCopy[y][x+1] + 'w';
                        mazeCopy[y][x] = mazeCopy[y][x] + 'e';
                    }else if(corner.indexOf('s') == -1){
                        mazeCopy[y+1][x] = mazeCopy[y+1][x] + 'n';
                        mazeCopy[y][x] = mazeCopy[y][x] + 's';
                    }else if(corner.indexOf('w') == -1){
                        mazeCopy[y][x-1] = mazeCopy[y][x-1] + 'e';
                        mazeCopy[y][x] = mazeCopy[y][x] + 'w';
                    }
                    changeCount++;
                    fill(60,0,0);
                    noStroke();
                    rect(gridToPos(x)+buffer, gridToPos(y)+buffer, rectSize, rectSize);
                }
            }
        }
    }else{
        for(var y=0; y<mazeCopy.length; y++){
            for(var x=0; x<mazeCopy[y].length; x++){
                if(mazeCopy[y][x].length == 4){
                    noStroke();
                    fill(255);
                    rect(gridToPos(x)+buffer, gridToPos(y)+buffer, rectSize, rectSize);
                }else{
                    noStroke();
                    fill(0,255,0);
                    rect(gridToPos(x)+buffer, gridToPos(y)+buffer, rectSize, rectSize);
                }
            }
        }
    }
    prevChangeCount = changeCount;
    changeCount = 0;
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


// start somewhere random
// move until trapped
// start in a new unvisited cell

function genMaze(){
    //Recursive backtracking
    
    var validMoves = true;
    var moveList = ['n', 'e', 's', 'w'];
    //Generate maze with all walls
    //0 = unvisited 
    //1 = visited
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

    function checkNeighbors(x,y,grid){
        if(y != gridSize-1){
            if(grid[y+1][x] == 0){
                return(true);
            }
        }
        if(x != gridSize-1){
            if(grid[y][x+1] == 0){
                return(true);
            }
        }
        if(y != 0){
            if(grid[y-1][x] == 0){
                return(true);
            }
        }
        if(x != 0){
            if(grid[y][x-1] == 0){
                return(true);
            }
        }
        return(false);
    }

    function getAbsolute(dir, facing){
        if(dir == "l"){//left
            tempFacing = moveList[(moveList.indexOf(facing)+3)%4];
        } else if(dir == "s"){//straight
            tempFacing = facing;
        } else if(dir == "r"){//right
            tempFacing = moveList[(moveList.indexOf(facing)+1)%4];
        }
        return(tempFacing);
    }

    function checkMove(x,y, tempFacing){
        var result = true;
        if(tempFacing == 'n'){
            if(y == 0){
                result = false;
            } else if(grid[y-1][x] == 1){
                result = false;
            }
        } else if(tempFacing == 'e'){
            if(x == gridSize-1){
                result = false;
            } else if(grid[y][x+1] == 1){
                result = false;
            }
        } else if(tempFacing == 's'){
            if(y == gridSize-1){
                result = false;
            } else if(grid[y+1][x] == 1){
                result = false;
            }
        } else if(tempFacing == 'w'){
            if(x == 0){
                result = false;
            } else if(grid[y][x-1] == 1){
                result = false;
            }
        }  
        return(result);
    }



    visitedList = [];
    fx = Math.floor(Math.random()*gridSize-1);
    fy = Math.floor(Math.random()*gridSize-1);
    grid[fy][fx] = 1;
    //main generation loop

    while(visitedList.length < gridSize**2){
        
        //Get visited
        visitedList = [];
        for(var y = 0; y <= gridSize-1; y++) {
            (grid[y]).forEach(function getVisited(item, index){
                if(item == 1){
                    visitedList.push([index, y]);
                }
            });
        };
        running = true;
        while(running == true){
            //Pick one at random
            randIndex = Math.floor(Math.random()*visitedList.length);
            var fcoord = visitedList[randIndex];
            fx = fcoord[0];
            fy = fcoord[1];
            if(checkNeighbors(fx,fy,grid)){
                x=fx;
                y=fy;
                surroundingGrid = [];
                if(y != gridSize-1){
                    if(grid[y+1][x] == 0){
                        surroundingGrid.push('s');
                    }
                }
                if(x != gridSize-1){
                    if(grid[y][x+1] == 0){
                        surroundingGrid.push('e');
                    }
                }
                if(y != 0){
                    if(grid[y-1][x] == 0){
                        surroundingGrid.push('n');
                    }
                }
                if(x != 0){
                    if(grid[y][x-1] == 0){
                        surroundingGrid.push('w');
                    }
                }
            facing = surroundingGrid[(Math.floor(Math.random()*surroundingGrid.length))];
            running = false;
            }
        }
        //Move until stuck
        validMoves = checkNeighbors(fx,fy,grid);
        console.log('upper loop')
        var loopCount = 0;
        while(validMoves == true & loopCount < 100){
            
            grid[fy][fx] = 1;
            dir = 'lsr'.charAt(Math.floor(Math.random()*3));
            absMoveDir = getAbsolute(dir,facing);
            
            if(checkMove(fx,fy,absMoveDir) == true){//if a move returns false it is illegal
                
                if(absMoveDir == 'n'){
                    mazeArray[fy][fx] = mazeArray[fy][fx].replace('n','');
                    mazeArray[fy-1][fx] = mazeArray[fy-1][fx].replace('s','');
                    fy = fy - 1;

                } else if(absMoveDir == 'e'){
                    mazeArray[fy][fx] = mazeArray[fy][fx].replace('e','');
                    mazeArray[fy][fx+1] = mazeArray[fy][fx+1].replace('w','');
                    fx = fx+ 1;
                } else if (absMoveDir == 's'){
                    mazeArray[fy][fx] = mazeArray[fy][fx].replace('s','');
                    mazeArray[fy+1][fx] = mazeArray[fy+1][fx].replace('n','');
                    fy = fy + 1;
                } else if(absMoveDir == 'w'){
                    mazeArray[fy][fx] = mazeArray[fy][fx].replace('w','');
                    mazeArray[fy][fx-1] = mazeArray[fy][fx-1].replace('e','');
                    fx = fx - 1;
                }
                facing= absMoveDir;
                
            }
            
            validMoves = checkNeighbors(fx,fy,grid);
            if(validMoves == true){
                console.log(fx,fy, validMoves, grid);
            }
            loopCount++;
            
        }
    }

    return(mazeArray)
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