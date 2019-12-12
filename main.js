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

   drawLineAndEdge({
     x: 10,
     y: 10,
     width: 100,
     height: 100,
     edgeType: "arrow1",
     lineType: actionName,
     lineWidth: 1,
     color: "#333333"
   },selection);
 }

 /*
  drowParms = {
    x:Number,
    y:Number,
    width:Number,
    height:Number,
    edgeType:"none" or "arrow1" or "arrow2" or "arrow3" or "circle1" or "circle2" or "square1" or "square2",
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
   const edgeType = parms.edgeType;
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
   selection.insertionParent.addChild(line);

   let edgeX = x + width;
   let edgeY = y;
   if(lineType == "curve" || lineType == "snake"){
     edgeY = y + height;
   }


   const edge = createEdge({
     x: edgeX,
     y: edgeY,
     type: edgeType,
     lineWidth: lineWidth,
     color: color
   }, true);
   selection.insertionParent.addChild(edge);

   selection.items = [line, edge];
   commands.group();
   let group = selection.items[0];
   group.name = "StraightArrow";
 }


 function createLine(parms){
   console.log("createLine", parms);
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




 function createEdge(parms, toRight){

   console.log("createEdge", parms);
   const x = parms.x;
   const y = parms.y;
   const type = parms.type;
   const lineWidth = parms.lineWidth;
   const color = parms.color;

   let p0,p1,p2,p3;
   let pathData = "";
   let stroke;
   let fill;

   switch(type){
     case "arrow1":

      if(toRight){
        p0 = (x-15) + "," + (y-10);
        p1 = x + "," + y;
        p2 = (x-15) + "," + (y+10);
      }else{
        p0 = (x+15) + "," + (y-10);
        p1 = x + "," + y;
        p2 = (x+15) + "," + (y+10);
      }
      pathData = `M ${p0} L ${p0} ${p1} ${p2}`;
      stroke = new Color(color);

     break;
     case "arrow2":

       if(toRight){
         p0 = (x-15) + "," + (y-8);
         p1 = x + "," + y;
         p2 = (x-15) + "," + (y+8);
       }else{
         p0 = (x+15) + "," + (y-8);
         p1 = x + "," + y;
         p2 = (x+15) + "," + (y+8);
       }
       pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p0}`;
       stroke = new Color(color);
       fill = new Color(color);

     break;
     case "arrow3":

       if(toRight){
         p0 = (x-15) + "," + (y-8);
         p1 = x + "," + y;
         p2 = (x-15) + "," + (y+8);
         p3 = (x-12) + "," + y;
       }else{
         p0 = (x+15) + "," + (y-8);
         p1 = x + "," + y;
         p2 = (x+15) + "," + (y+8);
         p3 = (x+12) + "," + y;
       }
       pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p3} ${p0}`;
       stroke = new Color(color);
       fill = new Color(color);

     break;
   }

   const path = new Path();
   path.stroke = stroke;
   path.fill = fill;
   path.strokeWidth = lineWidth;
   path.pathData = pathData;
   if(toRight){
     path.name = "rightEdge";
   }else{
     path.name = "leftEdge";
   }
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
