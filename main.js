/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const {Path, Color} = require("scenegraph");
 const commands = require("commands");
 let panel;

 function create() {
   console.log("create");
   const html = `
<style>
  .actionButton {
    width: 100%;
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    display: block;
    border: 1px solid #fff;
    margin-bottom: 4px;
  }
  .actionButton:hover{
    border: 1px solid #999;
  }
  .actionButton span{
    font-size: 108%;
    line-height: 24px;
    display: inline-block;
    color: #333;
    text-decoration: none;
  }
  .actionButton img{
    width: 24px; height: 24px;
    margin-right: 16px;
  }
</style>
<a href="#" data-action="straight" class="actionButton">
  <img src="assets/icon_straight.png" />
  <span>直線の矢印</span>
</a>
<a href="#" data-action="curve" class="actionButton">
  <img src="assets/icon_curve.png" />
  <span>折れ線の矢印</span>
</a>
<a href="#" data-action="snake" class="actionButton">
  <img src="assets/icon_snake.png" />
  <span>鍵型の矢印</span>
</a>
  `;
  function onActionButton(e){
    let actionName = e.currentTarget.getAttribute('data-action');
    const { editDocument } = require("application");
    editDocument({ editLabel: "Increase rectangle size" }, function(selection) {
      draw(actionName, selection);
    });

  }

  panel = document.createElement("div");
  panel.innerHTML = html;
  let buttons = panel.querySelectorAll(".actionButton");
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", onActionButton);
  }
  return panel;
 }

 function show(event) {
   if (!panel) event.node.appendChild(create());
 }

 function update(selection) {
   console.log("update",selection);
 }

 function draw(actionName, selection){
   console.log("draw", actionName);
   let color = "#333333";
   let x = 10;
   let y = 10;
   switch (actionName) {
    case "straight":
       drawStraightArrow(x, y, color, selection);
       break;
    case "curve":
      drawCurveArrow(x, y, color, selection);
      break;
    case "snake":
     drawSnakeArrow(x, y, color, selection);
     default:

   }
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
     panels: {
       flowkit: {
         show,
         update
       }
     }
 };
