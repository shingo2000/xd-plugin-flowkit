
const { editDocument } = require("application");

let panel;
const defaultParms = {
  leftEdgeType: "none",
  rightEdgeType: "arrow1",
  lineWidth: 1,
  edgeScale: 100,
  color: "#666666"
}

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
 .inlineBlock{
   display: inlineBlock;

 }
 input[type="range"]{
   width: 100%;
 }
 label{
   margin: 0.2em 0;
 }
 .propertyBox{
   background: rgba(0,0,0,0.025);
   padding: 4px;
 }
 h2{
   font-size: 140%;
   margin: 12px 0;
   padding: 0 4px;
 }
 .footer{
   text-align:right;
   margin: 4px 0;
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
 <h2>編集</h2>
 <div class="propertyBox">
   <label>
     <div class="row spread">
         <span>線の太さ</span>
         <span class="lineWidthValue">1</span>
     </div>
     <input type="range" id="lineWidth" min=0.5 max=5 value=1 step=0.5 />
   </label>
   <label>
     <div class="row spread">
         <span>ポイントの大きさ</span>
         <span class="edgeScaleValue">100%<span>
     </div>
     <input type="range" id="edgeScale" min=0 max=500 value=100 step=25 />
   </label>
   <div>
     <label class="inlineBlock">
       <span>左端</span>
       <select id="leftEdge">
            <option value="none" selected>なし</option>
            <option value="arrow1">矢印１</option>
            <option value="arrow2">矢印２</option>
            <option value="arrow3">矢印３</option>
            <option value="circle1">円形１</option>
            <option value="circle2">円形２</option>
            <option value="square1">四角１</option>
            <option value="square2">四角２</option>
            <option value="bar">縦線</option>
       </select>
     </label>
     <label class="inlineBlock">
       <span>右端</span>
       <select id="rightEdge">
            <option value="none">なし</option>
            <option value="arrow1">矢印１</option>
            <option value="arrow2">矢印２</option>
            <option value="arrow3" selected>矢印３</option>
            <option value="circle1">円形１</option>
            <option value="circle2">円形２</option>
            <option value="square1">四角１</option>
            <option value="square2">四角２</option>
            <option value="bar">縦線</option>
       </select>
     </label>
   </div>
   <label>
    <span>着色</span>
    <input type="text" id="color" value="#666666" />
   </label>
   <input type="hidden" id="lineType" value="straight" style="display:none" />
 </div>
 <div class="footer">
  <button id="defaultButton">初期値に戻す</button>
 </div>
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
  const defaultButton = panel.querySelector("#defaultButton");
  defaultButton.addEventListener("click", _onDefaultButton);

  function _onChangeProperty(e=null){
    onChangeProperty(getParms());
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
  function _onDefaultButton(e){
    updateToolPanel(defaultParms);
    _onChangeProperty();
  }
  return panel;
}


function show(event, onActionButton, onChangeProperty) {
  if (!panel) event.node.appendChild(create(onActionButton, onChangeProperty));
}

function showPropertyPanel(parms){
  updateToolPanel(parms);
  panel.querySelector("#toolPanel").className = "hide";
  panel.querySelector("#propertyPanel").className = "show";
}
function hidePropertyPanel(){
  panel.querySelector("#toolPanel").className = "show";
  panel.querySelector("#propertyPanel").className = "hide";
}

function updateToolPanel(parms){
  //console.log("updateToolPanel",parms)
  panel.querySelector("#propertyPanel #lineWidth").value = parms.lineWidth;
  panel.querySelector("#propertyPanel #leftEdge").value = parms.leftEdgeType;
  panel.querySelector("#propertyPanel #rightEdge").value = parms.rightEdgeType;
  if(parms.lineType) panel.querySelector("#propertyPanel #lineType").value = parms.lineType;
  panel.querySelector("#propertyPanel #color").value = parms.color;
  panel.querySelector("#propertyPanel #edgeScale").value = parms.edgeScale;
  panel.querySelector("#propertyPanel .lineWidthValue").innerHTML = parms.lineWidth + "";
  panel.querySelector("#propertyPanel .edgeScaleValue").innerHTML = parms.edgeScale + "%";

}
function getParms(){
  console.log("getParms", document.querySelector("#leftEdge").value, document.querySelector("#rightEdge").value)
  return {
    lineWidth: document.querySelector("#lineWidth").value - 0,
    leftEdgeType: document.querySelector("#leftEdge").value,
    rightEdgeType: document.querySelector("#rightEdge").value,
    edgeScale: document.querySelector("#edgeScale").value - 0,
    lineType: document.querySelector("#lineType").value,
    color: document.querySelector("#color").value
  };
}


module.exports.getParms = getParms;
module.exports.show = show;
module.exports.showPropertyPanel = showPropertyPanel;
module.exports.hidePropertyPanel = hidePropertyPanel;
