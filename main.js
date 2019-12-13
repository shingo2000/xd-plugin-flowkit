/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const {Path, Color, Ellipse, Rectangle} = require("scenegraph");
 const { editDocument } = require("application");
 const commands = require("commands");
 let panel;

 let rightEdgeType = "none";
 let leftEdgeType = "arrow3";
 let lineWidth = "2";
 let color = "#707070";

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
  .hide {
    display: none;
  }
  .show{
    display: block;
  }
  .row { align-items: center; }
  div{
    width: 100%;
  }
  .spread {
        justify-content: space-between;
        width: 100%;
  }
  input[type="range"]{
    width: 100%;
  }
  .inlineBlock{
    display: inlineBlock;
  }

</style>
<div id="toolPanel" class="show">
  <a href="#" data-action="straight" class="actionButton">
    <img src="assets/icon_straight.png" />
    <span>直線</span>
  </a>
  <a href="#" data-action="curve" class="actionButton">
    <img src="assets/icon_curve.png" />
    <span>折れ線</span>
  </a>
  <a href="#" data-action="snake" class="actionButton">
    <img src="assets/icon_snake.png" />
    <span>カギ線</span>
  </a>
</div>
<div id="propertyPanel" class="hide">
  <label>
    <div class="row spread">
        <span>線の太さ</span>
        <span>1</span>
    </div>
    <input type="range" id="lineWidth" min=0.5 max=5 value=1 step=0.5 />
  </label>
  <div>
    <label class="inlineBlock">
      <span>左端</span>
      <select id="leftEdge">
           <option value="none">なし</option>
           <option value="arrow1">矢印１</option>
           <option value="arrow2">矢印２</option>
           <option value="arrow3">矢印３</option>
           <option value="circle1">円形１</option>
           <option value="circle2">円形２</option>
           <option value="square1">四角１</option>
           <option value="square2">四角２</option>
      </select>
    </label>
    <label class="inlineBlock">
      <span>右端</span>
      <select id="rightEdge">
           <option value="none">なし</option>
           <option value="arrow1">矢印１</option>
           <option value="arrow2">矢印２</option>
           <option value="arrow3">矢印３</option>
           <option value="circle1">円形１</option>
           <option value="circle2">円形２</option>
           <option value="square1">四角１</option>
           <option value="square2">四角２</option>
      </select>
    </label>
  </div>
  <label>
    <div class="row spread">
        <span>ポイントの大きさ</span>
        <span>100%</span>
    </div>
    <input type="range" id="edgeScale" min=10 max=500 value=100 step=20 />
  </label>
  <input type="hidden" id="lineType" value="straight" />
</div>
  `;
  function onActionButton(e){
    let actionName = e.currentTarget.getAttribute('data-action');
    editDocument({ editLabel: "draw" }, function(selection) {
      draw(actionName, selection);
    });
  }

  function onChangeProperty(e){
    console.log("onChangeProperty");
    const lineWidth = document.querySelector("#lineWidth").value;
    const leftEdgeType = document.querySelector("#leftEdge").value;
    const rightEdgeType = document.querySelector("#rightEdge").value;
    const edgeScale = document.querySelector("#edgeScale").value;
    const lineType = document.querySelector("#lineType").value;
    console.log(lineWidth, leftEdgeType, rightEdgeType, edgeScale);

    editDocument({ editLabel: "redraw" }, function(selection) {
      redraw(null, selection);
    });
  }

  panel = document.createElement("div");
  panel.innerHTML = html;

  let buttons = panel.querySelectorAll(".actionButton");
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", onActionButton);
  }

  let inputs = panel.querySelectorAll("#propertyPanel input, #propertyPanel select");
  for(let i = 0; i < inputs.length; i++){
    inputs[i].addEventListener("change", onChangeProperty);
  }

  return panel;
 }

 function show(event) {
   if (!panel) event.node.appendChild(create());
 }

 function update(selection) {
   const toolPanel = document.querySelector("#toolPanel");
   const propertyPanel = document.querySelector("#propertyPanel");
   if(selection.items[0] && selection.items[0].pluginData == "flowKitConnector"){
     updateToolPanel(selection.items[0]);
     toolPanel.className = "hide";
     propertyPanel.className = "show";
   }else{
     toolPanel.className = "show";
     propertyPanel.className = "hide";
   }
 }
 function updateToolPanel(group){

 }

 function redraw(property,selection){

   console.log("redraw",selection);
   const line = selection.items[0].children.at(0);
   const leftEdge = selection.items[0].children.at(1);
   const rightEdge = selection.items[0].children.at(2);

   const items = drawLineAndEdge({
     x: line.localBounds.x,
     y: line.localBounds.y,
     width: line.localBounds.width,
     height: line.localBounds.height,
     leftEdgeType: "arrow1",
     rightEdgeType: "circle1",
     lineType: line.pluginData,
     lineWidth: 1,
     color: "#ff0000"
   },selection);

   for(let i = 0; i < items.length; i++){
     selection.items[0].addChild(items[i]);
   }
 }

 function draw(actionName, selection){
   console.log("draw",selection);

   const items = drawLineAndEdge({
     x: 10,
     y: 10,
     width: 100,
     height: 100,
     leftEdgeType: "arrow1",
     rightEdgeType: "square1",
     lineType: actionName,
     lineWidth: 1,
     color: "#333333"
   },selection);

   for(let i = 0; i < items.length; i++){
     selection.insertionParent.addChild(items[i]);
   }
   selection.items = items;
   commands.group();

   let group = selection.items[0];
   group.name = "flowKitConnector";
   group.pluginData = "flowKitConnector";
   return group;

 }

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

 function drawLineAndEdge(parms, selection){

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
   path.pluginData = type;
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
        path.moveInParentCoordinates(x-8,y-8);
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
        path.moveInParentCoordinates(x-8,y-8);
      }
     break;

     case "square1":
      stroke = new Color(color);
      path = new Rectangle();
      path.width = 12;
      path.height = 12;
      if(isRight){
        path.moveInParentCoordinates(x,y-6);
      }else{
        path.moveInParentCoordinates(x-6,y-6);
      }
     break;

     case "square2":
      stroke = new Color(color);
      fill = new Color(color);
      path = new Rectangle();
      path.width = 12;
      path.height = 12;
      if(isRight){
        path.moveInParentCoordinates(x,y-6);
      }else{
        path.moveInParentCoordinates(x-6,y-6);
      }
     break;

     case "bar":
     break;

     case "none":
     break;
   }

   path.stroke = stroke;
   path.fill = fill;
   path.strokeWidth = lineWidth;
   if(isRight){
     path.name = "rightEdge";
   }else{
     path.name = "leftEdge";
   }
   path.pluginData = type;

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
