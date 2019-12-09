/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const {Path, Color} = require("scenegraph");
 const commands = require("commands");

 function rectangleHandlerFunction(selection) {
   //drawStraightArrow(10,10,"#333333", selection);
   //drawCurveArrow(10,10,"#333333", selection);
   drawSnakeArrow(10,10,"#333333", selection);


 }

 function drawStraightArrow(sx, sy, color, selection){
   const width = 100;
   const line = createStraightLine(sx, sy, sx + width, sy, color);
   selection.insertionParent.addChild(line);

   const edge = createArrowEdge(sx + width, sy, true, color);
   selection.insertionParent.addChild(edge);

   selection.items = [line, edge];
   commands.group();
   let group = selection.items[0];
   group.name = "StraightArrow";
 }

 function drawCurveArrow(sx, sy, color, selection){
   const width = 100;
   const height = 100;
   const line = createCurveLine(sx, sy, sx + width, sy + height, color);
   selection.insertionParent.addChild(line);

   const edge = createArrowEdge(sx + width, sy + height, true, color);
   selection.insertionParent.addChild(edge);

   selection.items = [line, edge];
   commands.group();
   let group = selection.items[0];
   group.name = "CurveArrow";
 }

 function drawSnakeArrow(sx, sy, color, selection){
   const width = 100;
   const height = 100;
   const line = createSnakeLine(sx, sy, sx + width, sy + height, color);
   selection.insertionParent.addChild(line);

   const edge = createArrowEdge(sx + width, sy + height, true, color);
   selection.insertionParent.addChild(edge);

   selection.items = [line, edge];
   commands.group();
   let group = selection.items[0];
   group.name = "CurveArrow";
 }



 function createStraightLine(sx, sy, ex, ey, color){

   const startPoint = sx + "," + sy;
   const endPoint = ex + "," + ey;
   const pathData = `M ${startPoint} L ${startPoint} ${endPoint}`;
   const path = new Path();
   path.stroke = new Color(color);
   path.pathData = pathData;
   return path;
 }

 function createCurveLine(sx, sy, ex, ey, color){

   const startPoint = sx + "," + sy;
   const curvePoint = sx + "," + ey;
   const endPoint = ex + "," + ey;
   const pathData = `M ${startPoint} L ${startPoint} ${curvePoint} ${endPoint}`;
   const path = new Path();
   path.stroke = new Color(color);
   path.pathData = pathData;
   return path;
 }

 function createSnakeLine(sx, sy, ex, ey, color){
   const mx = (ex - sx)/2 + sx;
   const startPoint = sx + "," + sy;
   const curvePoint1 = mx + "," + sy;
   const curvePoint2 = mx + "," + ey;
   const endPoint = ex + "," + ey;
   const pathData = `M ${startPoint} L ${startPoint} ${curvePoint1} ${curvePoint2} ${endPoint}`;
   const path = new Path();
   path.stroke = new Color(color);
   path.pathData = pathData;
   return path;
 }

 function createArrowEdge(x, y, toRight, color){
   let p1, p2, p3;

   if(toRight){
     p1 = (x-10) + "," + (y-10);
     p2 = x + "," + y;
     p3 = (x-10) + "," + (y+10);
   }else{
     p1 = (x+10) + "," + (y-10);
     p2 = x + "," + y;
     p3 = (x+10) + "," + (y+10);
   }

   const pathData = `M ${p1} L ${p1} ${p2} ${p3}`;
   const path = new Path();
   path.stroke = new Color(color);
   path.pathData = pathData;
   return path;

 }

 module.exports = {
     commands: {
         createRectangle: rectangleHandlerFunction
     }
 };
