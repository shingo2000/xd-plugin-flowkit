/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const { editDocument } = require("application");
 const commands = require("commands");
 const sceneController = require("./sceneController.js");
 const panelController = require("./panelController.js");


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
   console.log("update",selection.items[0]);
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

   const parms = panelController.getParms();

   const items = sceneController.drawConnector({
     x: 10,
     y: 10,
     width: 100,
     height: 100,
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
