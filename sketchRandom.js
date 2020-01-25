
var width = 500;
var height = 500;
var gridSize = 10;
var gridLength = width/gridSize;
var buffer = 0.15*gridLength;
var rectSize = gridLength-2*buffer;
var playerX = 0;
var playerY = 0;

var mazeArray = [
    ["nw", "n", "ns", "ne", "wn", "ns", "ne", "nw", "ns", "ne"],
    ["sew", "sw", "ne", "sew", "sew", "new", "ew", "ew", "nw", "se"],
    ["nw", "ne", "sw", "n", "ns", "se", "ws", "se", "ew", "new"],
    ["ew", "ws", "n", "s", "ne", "new", "nw", "ns", "se", "ew"],
    ["sw", "ne", "sw", "ne", "ew", "ew", "ew", "nws", "ne", "ew"],
    ["new", "ws", "ne", "swe", "ew", "w", "s", "ns", "se", "ew"],
    ["w", "ns", "se", "nw", "se", "ew", "nw", "ns", "n", "es"],
    ["ew", "new", "nw", "se", "nw", "se", "ew", "new", "w", "nes"],
    ["ws", "e", "ws", "ns", "s", "ns", "se", "ew", "ws", "ne"],
    ["nws", "s", "ns", "ns", "ns", "ns", "ns", "sw", "ns", "es"]
];

function setup(){
    

    createCanvas(500, 500);
    frameRate(10);
    drawMaze();
    fill(0);
    rect(gridToPos(playerX)+buffer, gridToPos(playerY)+buffer, rectSize, rectSize);
}

function draw(){
    move(Math.floor((Math.random()*4)+1));
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

function drawMaze(){
    
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