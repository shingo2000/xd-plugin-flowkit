
const { editDocument } = require("application");

let panel;

function create(onActionButton, onChangeProperty) {
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
       <span class="lineWidthValue">1</span>
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
       <span class="edgeScaleValue">100%<span>
   </div>
   <input type="range" id="edgeScale" min=0 max=500 value=100 step=25 />
 </label>
 <input type="hidden" id="lineType" value="straight" />
 <input type="hidden" id="color" value="#cc0000" />
</div>
 `;
  panel = document.createElement("div");
  panel.innerHTML = html;
  const buttons = panel.querySelectorAll(".actionButton");
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener("click", _onActionButton);
  }
  const inputs = panel.querySelectorAll("#propertyPanel input, #propertyPanel select");
  for(let i = 0; i < inputs.length; i++){
    inputs[i].addEventListener("change", _onChangeProperty);
  }
  const sliders = panel.querySelectorAll("#edgeScale, #lineWidth");
  for(let i = 0; i < sliders.length; i++){
    sliders[i].addEventListener("input", _onInputSlider);
  }
  function _onChangeProperty(e){
    onChangeProperty({
      lineWidth: document.querySelector("#lineWidth").value,
      leftEdgeType: document.querySelector("#leftEdge").value,
      rightEdgeType: document.querySelector("#rightEdge").value,
      edgeScale: document.querySelector("#edgeScale").value,
      lineType: document.querySelector("#lineType").value,
      color: document.querySelector("#color").value
    });
  }
  function _onActionButton(e){
    const actionName = e.currentTarget.getAttribute('data-action');
    onActionButton(actionName);
  }
  function _onInputSlider(e){
    const input = e.currentTarget;
    let label;
    if(input.id == "lineWidth"){
      label = input.parentNode.querySelector(".lineWidthValue");
      label.innerHTML = input.value + "";
    }else if(input.id == "edgeScale"){
      label = input.parentNode.querySelector(".edgeScaleValue");
      label.innerHTML = input.value + "%";
    }
  }
  return panel;
}

function show(event, onActionButton, onChangeProperty) {
  if (!panel) event.node.appendChild(create(onActionButton, onChangeProperty));
}


function update(selection) {
//console.log("update",panel);
 const toolPanel = panel.querySelector("#toolPanel");
 const propertyPanel = panel.querySelector("#propertyPanel");
 if(selection.items[0] && selection.items[0].pluginData &&selection.items[0].pluginData.name == "flowKitConnector"){
   updateToolPanel(selection.items[0].pluginData);
   toolPanel.className = "hide";
   propertyPanel.className = "show";
 }else{
   toolPanel.className = "show";
   propertyPanel.className = "hide";
 }
}


function updateToolPanel(parms){
  //console.log("updateToolPanel",parms)
  panel.querySelector("#propertyPanel #lineWidth").value = parms.lineWidth;
  panel.querySelector("#propertyPanel #leftEdge").value = parms.leftEdgeType;
  panel.querySelector("#propertyPanel #rightEdge").value = parms.rightEdgeType;
  panel.querySelector("#propertyPanel #lineType").value = parms.lineType;
  panel.querySelector("#propertyPanel #color").value = parms.color;
  panel.querySelector("#propertyPanel #edgeScale").value = parms.edgeScale;
  panel.querySelector("#propertyPanel .lineWidthValue").innerHTML = parms.lineWidth + "";
  panel.querySelector("#propertyPanel .edgeScaleValue").innerHTML = parms.lineWidth + "%";

}


module.exports.show = show;
module.exports.update = update;
