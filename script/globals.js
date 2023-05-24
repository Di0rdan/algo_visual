// code-editor
const textArea = document.getElementById("code");
var editor = null;

// frames loaded from pyodide
var python_anim_frames;

// template for variable-objects placed in variable-list
const list_python_variable_template = document.getElementById(
  "list_python_variable_template"
);

// template for variable-objects placed in animation area
const python_variable_template = document.getElementById(
  "python_variable_template"
);

// variable-list object
const variables_list = document.getElementById("variables_list");
var variables_list_orig_content;

// ids of variable-objects in variable-list
var list_python_variables = [];

//ids of variable-objects in animation-area
// var python_variables = [];

// number of current animation frame
var anim_frame_num = 0;

// object of current highlighted line
var highlightedLine;

// animation area object
const animation_area = document.getElementById("animation_area");
var anim_area_orig_content;

// shifts relative to the mouse of the currently captured object
let mouseX = 0;
let mouseY = 0;

// is any object dragging now?
let isDragging = false;

// current dragging object
let currentDraggable = null;

let scaling = 1.0;

var line_inputs = {};
var line_outputs = {};

function get_all_pyvars() {
  let res = [];
  for (elem of animation_area.children) {
    if (elem.classList.contains("python_variable")) {
      res.push(elem);
    }
  }
  return res;
}

document.addEventListener("DOMContentLoaded", function () {
  const sizeSlider = document.getElementById("sizeSlider");

  sizeSlider.addEventListener("input", (e) => {
    scaling = e.target.value;
    for (pyvar of get_all_pyvars()) {
      pyvar.style.transform = `scale(${scaling})`;
    }
  });
  anim_area_orig_content = animation_area.innerHTML;
  variables_list_orig_content = variables_list.innerHTML;
});

var tmp;
