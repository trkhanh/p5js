const ctx = canvas.getContext("2d");
const colours = ["red","green","yellow","orange","blue","cyan","magenta"]
const origin = {x : canvas.width / 2, y : canvas.height / 2};
var size = Math.min(canvas.width * 0.2, canvas.height * 0.2);
function drawPattern(size,origin,ang){
    const xAx = Math.cos(ang);  // define the direction of xAxis
    const xAy = Math.sin(ang);   

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(xAx,xAy,-xAy,xAx,origin.x,origin.y);
    function getExtent(xAx,xAy,origin){
        const im = [1,0,0,1]; // inverse matrix
        const dot = xAx *  xAx + xAy * xAy;
        im[0] =  xAx / dot;
        im[1] = -xAy / dot;
        im[2] = xAy / dot;
        im[3] = xAx / dot;
        const toWorld = (x,y) => {
            var point = {};
            var xx = x - origin.x;     
            var yy = y - origin.y;     
            point.x = xx * im[0] + yy * im[2]; 
            point.y = xx * im[1] + yy * im[3];
            return point;
        }
        return [
            toWorld(0,0),
            toWorld(canvas.width,0),
            toWorld(canvas.width,canvas.height),
            toWorld(0,canvas.height),
        ]
    }
    const corners = getExtent(xAx,xAy,origin);
    var startX = Math.min(corners[0].x,corners[1].x,corners[2].x,corners[3].x);
    var endX = Math.max(corners[0].x,corners[1].x,corners[2].x,corners[3].x);
    var startY = Math.min(corners[0].y,corners[1].y,corners[2].y,corners[3].y);
    var endY = Math.max(corners[0].y,corners[1].y,corners[2].y,corners[3].y);
    
    startX = Math.floor(startX / size) - 4;
    endX = Math.floor(endX / size) + 4;
    startY = Math.floor(startY / size) - 4;
    endY = Math.floor(endY / size) + 4;
                
    // draw the pattern        
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
    for(var y = startY; y <endY; y+=1){
        for(var x = startX; x <endX; x+=1){
            ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];
            if((x + y) % 4 === 0){
                ctx.fillRect(x * size,y * size,size * 2,size);
                ctx.strokeRect(x * size,y * size,size * 2,size);
                x += 2;
                ctx.fillStyle = colours[Math.floor(Math.random() * colours.length)];        
                ctx.fillRect(x * size,y * size, size, size * 2);
                ctx.strokeRect(x * size,y * size, size, size * 2);
                x += 1;
            }
    
        }
    }
}



canvas.width = innerWidth;
canvas.height = innerHeight    
origin.x = canvas.width / 2;
origin.y = canvas.height / 2;
size = Math.min(canvas.width * 0.2, canvas.height * 0.2);
drawPattern(size,origin,Math.PI / 3);