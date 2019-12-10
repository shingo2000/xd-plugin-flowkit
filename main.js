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
    .break {
        flex-wrap: wrap;
    }
    label.row > span {
        color: #8E8E8E;
        width: 20px;
        text-align: right;
        font-size: 9px;
    }
    label.row input {
        flex: 1 1 auto;
    }
    form {
        width:90%;
        margin: -20px;
        padding: 0px;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form method="dialog" id="main">
    <div class="row break">
        <label class="row">
            <span>↕︎</span>
            <input type="number" uxp-quiet="true" id="txtV" value="10" placeholder="Height" />
        </label>
        <label class="row">
            <span>↔︎</span>
            <input type="number" uxp-quiet="true" id="txtH" value="10" placeholder="Width" />
        </label>
    </div>
    <footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
</form>

<p id="warning">This plugin requires you to select a rectangle in the document. Please select a rectangle.</p>
`;

  function increaseRectangleSize() { // [2]
    const { editDocument } = require("application"); // [3]
    const height = Number(document.querySelector("#txtV").value); // [4]
    const width = Number(document.querySelector("#txtH").value); // [5]

    // [6]
    editDocument({ editLabel: "Increase rectangle size" }, function(selection) {
      const selectedRectangle = selection.items[0]; // [7]
      selectedRectangle.width += width; // [8]
      selectedRectangle.height += height;
    });
  }

  panel = document.createElement("div"); // [9]
  panel.innerHTML = html; // [10]
  panel.querySelector("form").addEventListener("submit", increaseRectangleSize); // [11]

  return panel; // [12]
 }

 function show(event) {
   console.log("show",event);
   if (!panel) event.node.appendChild(create()); // [2]
 }

 function update(selection) {
   console.log("update",selection);
  const { Rectangle } = require("scenegraph"); // [2]

  const form = document.querySelector("form"); // [3]
  const warning = document.querySelector("#warning"); // [4]

  if (!selection || !(selection.items[0] instanceof Rectangle)) { // [5]
    form.className = "hide";
    warning.className = "show";
  } else {
    form.className = "show";
    warning.className = "hide";
  }
 }

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
     /*commands: {
         createRectangle: rectangleHandlerFunction
     },*/
     panels: {
       enlargeRectangle: {
         show,
         update
       }
     }
 };
