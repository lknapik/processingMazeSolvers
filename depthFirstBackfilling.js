
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

    var moveList = ['n', 'e', 's', 'w'];
    //Generate maze with all walls
    //0 = unvisited 
    //1 = visited
    //2 = landlocked
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

    function getUnvisitedCells(){
        //return array of unvisited cells in [x,y] notation
        unvisitedList = [];
        for(var y = 0; y <= gridSize-1; y++) {
            (grid[y]).forEach(function getValue(item, index){
                if(item == 0){
                    unvisitedList.push([index, y]);
                }
            })
        }
        return(unvisitedList)
    }

    function getVisitedCells(){
        //return array of visited cells in [x,y] notation
        visitedList = [];
        for(var y = 0; y <= gridSize-1; y++) {
            (grid[y]).forEach(function getValue(item, index){
                if(item == 1){
                    visitedList.push([index, y]);
                }
            })
        }
        return(visitedList)
    }
    
    function refreshGrid(grid){
        //converts landlocked 1's into 2's
        for(var y = 0; y < gridSize; y++){
            for(var x = 0; x < gridSize; x++){
                surroundingVisited = 0;
                if(x == gridSize-1){
                    surroundingVisited++;
                } else if(grid[y][x+1] == 1 |grid[y][x+1] == 2){
                    surroundingVisited++;
                }
                if(y == gridSize-1){
                    surroundingVisited++;
                } else if(grid[y+1][x] == 1 |grid[y+1][x] == 2){
                    surroundingVisited++;
                }
                if(x == 0){
                    surroundingVisited++;
                } else if(grid[y][x-1] == 1 |grid[y][x-1] == 2){
                    surroundingVisited++;
                }
                if(y == 0){
                    surroundingVisited++;
                } else if(grid[y-1][x] == 1 |grid[y-1][x] == 2){
                    surroundingVisited++;
                }

                if(surroundingVisited == 4){
                    grid[y][x] = 2;
                }
            }
        }
        return(grid);
    }

    function pathing(x,y){
        
        function getSurroundingUnvisited(x,y){
            //return array of surrounding 4 cells only return value if its a 0
            //in form of [direction, x, y]
            surrounding = [];
            if(x != gridSize-1){
                if(grid[y][x+1] == 0){
                    surrounding.push(['e', x+1, y]);
                }
            }
            if(y != gridSize-1){
                if(grid[y+1][x] == 0){
                    surrounding.push(['s', x, y+1]);
                }
            }
            if(x != 0){
                if(grid[y][x-1] == 0){
                    surrounding.push(['w', x-1, y]);
                }
            }
            if(y != 0){
                if(grid[y-1][x] == 0){
                    surrounding.push(['n', x, y-1]);
                }
            }
            return(surrounding);

        }
        possibleMoves = getSurroundingUnvisited(x,y);
        if(possibleMoves.length > 0){
            coord = possibleMoves[Math.floor(Math.random()*possibleMoves.length)];
            var dir = coord[0];
            var x = coord[1];
            var y = coord[2];

            if(dir == 'n'){
                mazeArray[y+1][x] = mazeArray[y+1][x].replace('n','');
                mazeArray[y][x] = mazeArray[y][x].replace('s','');
            }else if(dir == 'e'){
                mazeArray[y][x-1] = mazeArray[y][x-1].replace('e','');
                mazeArray[y][x] = mazeArray[y][x].replace('w','');
            }else if(dir == 's'){
                mazeArray[y-1][x] = mazeArray[y-1][x].replace('s','');
                mazeArray[y][x] = mazeArray[y][x].replace('n','');
            }else if(dir == 'w'){
                mazeArray[y][x+1] = mazeArray[y][x+1].replace('w','');
                mazeArray[y][x] = mazeArray[y][x].replace('e','');
            }

            grid[y][x] = 1;
            pathing(x,y);
        }
    }

    x = Math.floor(Math.random()*gridSize);
    y = Math.floor(Math.random()*gridSize);

    grid[y][x] = 1;

    unvisitedList = getUnvisitedCells();
    while(unvisitedList.length != 0){
        visitedList = getVisitedCells();
        coord = visitedList[Math.floor(Math.random()*visitedList.length)];
        nx = coord[0];
        ny = coord[1];
        pathing(nx,ny)
        grid = refreshGrid(grid);
        unvisitedList = getUnvisitedCells();
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