/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 const { editDocument } = require("application");
 const commands = require("commands");
 const sceneController = require("./sceneController.js");
 const panelController = require("./panelController.js");

 const settingData = {
   leftEdgeType: "none",
   rightEdgeType: "arrow3",
   lineWidth: 1,
   color: "#333333",
   lineType: "straignt"
 }

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
   panelController.update(selection);
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
     lineType: parms.lineType,
     lineWidth: parms.lineWidth,
     color: parms.color
   }
 }

 function draw(actionName, selection){
   console.log("draw",actionName,settingData);

   const items = sceneController.drawConnector({
     x: 10,
     y: 10,
     width: 100,
     height: 100,
     leftEdgeType: settingData.leftEdgeType,
     rightEdgeType: settingData.rightEdgeType,
     lineType: actionName,
     lineWidth: settingData.lineWidth,
     color: settingData.color
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
     leftEdgeType: settingData.leftEdgeType,
     rightEdgeType: settingData.rightEdgeType,
     lineType: actionName,
     lineWidth: settingData.lineWidth,
     color: settingData.color
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
