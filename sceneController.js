
 const {Path, Color, Ellipse, Rectangle} = require("scenegraph");


  /*
   drowParms = {
     x:Number,
     y:Number,
     width:Number,
     height:Number,
     leftEdgeType:"none" or "arrow1" or "arrow2" or "arrow3" or "circle1" or "circle2" or "square1" or "square2" or "bar",
     rightEdgeType:
     lineType:"straight" or "curve" or "snake",
     lineWidth:Number,
     color:String
   }
  */


function drawConnector(parms, selection){
 const x = parms.x;
 const y = parms.y;
 const width = parms.width;
 const height = parms.height;
 const leftEdgeType = parms.leftEdgeType;
 const rightEdgeType = parms.rightEdgeType;
 const lineType = parms.lineType;
 const lineWidth = parms.lineWidth;
 const color = parms.color;

 const line = createLine({
   sx: x,
   sy: y,
   ex: x + width,
   ey: y + height,
   type: lineType,
   lineWidth: lineWidth,
   color: color
 });

 // create leftEdge
 let edgeX = x;
 let edgeY = y;
 const leftEdge = createEdge({
   x: edgeX,
   y: edgeY,
   type: leftEdgeType,
   lineWidth: lineWidth,
   color: color
 }, false);
 if(lineType == "curve"){
   leftEdge.rotateAround(90, {x:0, y:0})
 }

 // create RightEdge
 edgeX = x + width;
 edgeY = y;
 if(lineType == "curve" || lineType == "snake"){
   edgeY = y + height;
 }
 const rightEdge = createEdge({
   x: edgeX,
   y: edgeY,
   type: rightEdgeType,
   lineWidth: lineWidth,
   color: color
 }, true);

 return [line, leftEdge, rightEdge];

}


function createLine(parms){
 //console.log("createLine", parms);
 const sx = parms.sx;
 const sy = parms.sy;
 const ex = parms.ex;
 const ey = parms.ey;
 const type = parms.type;
 const lineWidth = parms.lineWidth;
 const color = parms.color;

 let p0, p1, p2, p3;
 let pathData = "";
 switch(type){

   case "straight":
    p0 = sx + "," + sy;
    p1 = ex + "," + sy;
    pathData = `M ${p0} L ${p0} ${p1}`;
   break;

   case "curve":
    p0 = sx + "," + sy;
    p1 = sx + "," + ey;
    p2 = ex + "," + ey;
    pathData = `M ${p0} L ${p0} ${p1} ${p2}`;
   break;

   case "snake":
    const mx = (ex - sx)/2 + sx;
    p0 = sx + "," + sy;
    p1 = mx + "," + sy;
    p2 = mx + "," + ey;
    p3 = ex + "," + ey;
    pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p3}`;
   break;

 }

 const path = new Path();
 path.stroke = new Color(color);
 path.strokeWidth = lineWidth;
 path.pathData = pathData;
 path.name = "line";
 return path;
}


function createEdge(parms, isRight){

 //console.log("createEdge", parms);
 const x = parms.x;
 const y = parms.y;
 const type = parms.type;
 const lineWidth = parms.lineWidth;
 const color = parms.color;

 let p0,p1,p2,p3;
 let pathData = "";
 let stroke;
 let fill;
 let path;

 switch(type){

   case "arrow1":
    if(isRight){
      p0 = (-15) + "," + (-10);
      p1 = "0,0";
      p2 = (-15) + "," + (10);
    }else{
      p0 = (15) + "," + (-10);
      p1 = "0,0";
      p2 = (15) + "," + (10);
    }
    pathData = `M ${p0} L ${p0} ${p1} ${p2}`;
    stroke = new Color(color);
    path = new Path();
    path.pathData = pathData;
    path.moveInParentCoordinates(x,y);
   break;

   case "arrow2":
     if(isRight){
       p0 = (-15) + "," + (-8);
       p1 = "0,0";
       p2 = (-15) + "," + 8;
     }else{
       p0 = 15 + "," + (-8);
       p1 = "0,0";
       p2 = 15 + "," + 8;
     }
     pathData = `M ${p0} L ${p0} ${p1} ${p2} Z`;
     stroke = new Color(color);
     fill = new Color(color);
     path = new Path();
     path.pathData = pathData;
     path.moveInParentCoordinates(x,y);
   break;

   case "arrow3":
     if(isRight){
       p0 = (-15) + "," + (-8);
       p1 = "0,0";
       p2 = (-15) + "," + (8);
       p3 = (-12) + "," + (0);
     }else{
       p0 = (15) + "," + (-8);
       p1 = "0,0";
       p2 = (15) + "," + (8);
       p3 = (12) + "," + (0);
     }
     pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p3} Z`;
     stroke = new Color(color);
     fill = new Color(color);
     path = new Path();
     path.pathData = pathData;
     path.moveInParentCoordinates(x,y);
   break;

   case "circle1":
    stroke = new Color(color);
    path = new Ellipse();
    path.radiusX = 8;
    path.radiusY = 8;
    if(isRight){
      path.moveInParentCoordinates(x,y-8);
    }else{
      path.moveInParentCoordinates(x-16,y-8);
    }
   break;

   case "circle2":
    stroke = new Color(color);
    fill = new Color(color);
    path = new Ellipse();
    path.radiusX = 8;
    path.radiusY = 8;
    if(isRight){
      path.moveInParentCoordinates(x,y-8);
    }else{
      path.moveInParentCoordinates(x-16,y-8);
    }
   break;

   case "square1":
    stroke = new Color(color);
    path = new Rectangle();
    path.width = 16;
    path.height = 16;
    if(isRight){
      path.moveInParentCoordinates(x,y-8);
    }else{
      path.moveInParentCoordinates(x-16,y-8);
    }
   break;

   case "square2":
    stroke = new Color(color);
    fill = new Color(color);
    path = new Rectangle();
    path.width = 16;
    path.height = 16;
    if(isRight){
      path.moveInParentCoordinates(x,y-8);
    }else{
      path.moveInParentCoordinates(x-16,y-8);
    }
   break;

   case "bar":
   break;

   case "none":

    path = new Path();
   break;
 }
 console.log(stroke,fill,lineWidth);
 path.stroke = stroke;
 path.fill = fill;
 path.strokeWidth = lineWidth;
 if(isRight){
   path.name = "rightEdge";
 }else{
   path.name = "leftEdge";
 }

 return path;
}

module.exports.drawConnector = drawConnector;
