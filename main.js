/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const { editDocument } = require("application");
 const commands = require("commands");
 const {Artboard, SceneNode} = require("scenegraph");
 const sceneController = require("./sceneController.js");
 const panelController = require("./panelController.js");
 const viewport = require("viewport");


 function show(event) {
   function onActionButton(actionName){
     editDocument({ editLabel: "draw" }, function(selection) {
       draw(actionName, selection);
     });
   }
   function onChangeProperty(prms){
     editDocument({ editLabel: "redraw" }, function(selection) {
       redraw(prms, selection);
     });
   }
   panelController.show(event,onActionButton,onChangeProperty);
 }

 function update(selection) {
   //console.log("update",selection.items[0]);
   if(selection.items[0] && selection.items[0].pluginData && selection.items[0].pluginData.name == "flowKitConnector"){
     panelController.showPropertyPanel(selection.items[0].pluginData);
   }else{
     panelController.hidePropertyPanel();
   }
 }

 function redraw(parms,selection){

   console.log("redraw",parms);
   const group = selection.items[0];
   const line = group.children.at(0);
   const leftEdge = group.children.at(1);
   const rightEdge = group.children.at(2);

   const items = sceneController.drawConnector({
     x: line.localBounds.x,
     y: line.localBounds.y,
     width: line.localBounds.width,
     height: line.localBounds.height,
     leftEdgeType: parms.leftEdgeType,
     rightEdgeType: parms.rightEdgeType,
     edgeScale: parms.edgeScale,
     lineType: parms.lineType,
     lineWidth: parms.lineWidth,
     color: parms.color
   },selection);

   line.removeFromParent();
   leftEdge.removeFromParent();
   rightEdge.removeFromParent();

   for(let i = 0; i < items.length; i++){
     group.addChild(items[i]);
   }
   group.pluginData = {
     name: "flowKitConnector",
     leftEdgeType: parms.leftEdgeType,
     rightEdgeType: parms.rightEdgeType,
     edgeScale: parms.edgeScale,
     lineType: parms.lineType,
     lineWidth: parms.lineWidth,
     color: parms.color
   }
 }

 function draw(actionName, selection){
   console.log("draw",actionName);

   let x = 10;
   let y = 10;
   let width = 100;
   let height = 100;

   if(selection.items[0]){
     if(selection.items[0] instanceof Artboard){
       x = 10;
       y = 10;
     }else{
      if(selection.items.length == 2){
        // ２つ選択したオブジェクトの間を繋ぐ線を引く
        let x0 = selection.items[0].translation.x;
        let y0 = selection.items[0].translation.y;
        let x1 = selection.items[1].translation.x;
        let y1 = selection.items[1].translation.y;

        if(actionName == "curve"){
          if(x0 < x1){
            x = x0 + selection.items[0].localBounds.width/2;
            y = y0 + selection.items[0].localBounds.height;
            width = x1 - x;
            height = (y1 + selection.items[1].localBounds.height/2) - y;
          }else{
            x = x1 + selection.items[1].localBounds.width/2;
            y = y1 + selection.items[1].localBounds.height;
            width = x0 - x;
            height = (y0 + selection.items[0].localBounds.height/2) - y;
          }

        }else{
          if(x0 < x1){
            x = x0 + selection.items[0].localBounds.width;
            y = y0 + selection.items[0].localBounds.height/2;
            width = x1 - x;
            height = (y1 + selection.items[1].localBounds.height/2) - y;
          }else{
            x = x1 + selection.items[1].localBounds.width;
            y = y1 + selection.items[1].localBounds.height/2;
            width = x0 - x;
            height = (y0 + selection.items[0].localBounds.height/2) - y;
          }
        }

      }else{
        if(actionName == "curve"){
          x = selection.items[0].translation.x + selection.items[0].localBounds.width/2;
          y = selection.items[0].translation.y + selection.items[0].localBounds.height;
        }else{
          x = selection.items[0].translation.x + selection.items[0].localBounds.width;
          y = selection.items[0].translation.y + selection.items[0].localBounds.height / 2;
        }
      }
     }
   } else {

     // viewportの真ん中より左上に配置
     x = viewport.bounds.x + viewport.bounds.width / 3;
     y = viewport.bounds.y + viewport.bounds.height / 3;



   }


   const parms = panelController.getParms();

   const items = sceneController.drawConnector({
     x: x,
     y: y,
     width: width,
     height: height,
     leftEdgeType: parms.leftEdgeType,
     rightEdgeType: parms.rightEdgeType,
     edgeScale: parms.edgeScale,
     lineType: actionName,
     lineWidth: parms.lineWidth,
     color: parms.color
   },selection);

   for(let i = 0; i < items.length; i++){
     selection.insertionParent.addChild(items[i]);
   }
   selection.items = items;
   commands.group();

   const group = selection.items[0];
   group.name = "flowKitConnector";
   group.pluginData = {
     name: "flowKitConnector",
     leftEdgeType: parms.leftEdgeType,
     rightEdgeType: parms.rightEdgeType,
     edgeScale: parms.edgeScale,
     lineType: actionName,
     lineWidth: parms.lineWidth,
     color: parms.color
   }

   return group;

 }

 module.exports = {
     panels: {
       flowkit: {
         show,
         update
       }
     }
 };
