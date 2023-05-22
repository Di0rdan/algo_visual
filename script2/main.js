// frames loaded from pyodide
var python_anim_frames = null;

// template for variable-objects placed in variable-list
const list_python_variable_template = document.getElementById(
  "list_python_variable_template"
);

// template for variable-objects placed in animation area
const python_variable_template = document.getElementById(
  "python_variable_template"
);

// animation area object
const animation_area = document.getElementById("animation_area");
var anim_area_orig_content;

document.addEventListener("DOMContentLoaded", function () {
  const sizeSlider = document.getElementById("sizeSlider");

  sizeSlider.addEventListener("input", (e) => {
    scaling = e.target.value;
    if (animation)
      for (let [htmlobj_id, htmlvar] of animation.htmlvars) {
        htmlvar.html_obj.style.transform = `scale(${scaling})`;
      }
  });
  anim_area_orig_content = animation_area.innerHTML;
  variables_list_orig_content = variables_list.innerHTML;

  editor = CodeMirror.fromTextArea(textArea, {
    mode: "python", // Язык программирования (Python)
    // theme: "monokai", // Тема оформления (Monokai)
    lineNumbers: true, // Отображение нумерации строк
    indentUnit: 4, // Размер отступа (в количестве пробелов)
  });
  editor.setOption("readOnly", false);
  set_code(python_example_code);
});

var tmp;
