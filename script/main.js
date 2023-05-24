function get_tracing_lib() {
  return {
    tracer: tracer_py,
    animation_builder: animation_builder_py,
    script: editor.getValue(),
  };
}

python_load_code = `
from js import get_tracing_lib
lib = get_tracing_lib().to_py()
# print(lib['script'])
for name, text in lib.items():
    with open(f'{name}.py', 'w') as file:
        file.write(text)
import tracer
animation_dict = tracer.animation_dict
# output = tracer.output
# print(type(animation_dict))
`;

// document.getElementById("loader").style.display = "none";

function get_input() {
  return document.getElementById("input").value;
}

async function load() {
  if (python_anim_frames) {
    python_anim_frames = undefined;
    editor.setOption("readOnly", false);
    document.getElementById("vis button").value = "visualize";

    reset_anim_area();
    list_python_variables = [];
    return;
  }
  console.log("initializing...");

  document.getElementById("loader").style.display = "flex";
  let pyodide = await loadPyodide();
  await pyodide.runPython(python_load_code);
  python_anim_frames = pyodide.globals
    .get("animation_dict")
    .toJs()
    .get("frames");
  for (anim_frame of python_anim_frames) {
    for (code_frame of anim_frame.get("code_frames")) {
      // Создание нового элемента <li>
      for (variable of code_frame.get("vars")) {
        let id = "list_" + code_frame.get("id") + "." + variable[0];
        if (document.getElementById(id)) {
          continue;
        }
        list_python_variables.push(id);
        const newListItem = document.createElement("li");

        // Копирование содержимого заданного <div> в элемент <li>
        const divContentCopy = list_python_variable_template.cloneNode(true);
        divContentCopy.textContent = id.split(".").slice(-1)[0];
        divContentCopy.id = id;
        divContentCopy.addEventListener(
          "dragstart",
          pyvar_list_dragstart_callback
        );

        newListItem.appendChild(divContentCopy);

        variables_list.appendChild(newListItem);
      }
    }
  }
  document.getElementById("vis button").value = "change code";
  anim_frame_num = 0;
  draw_frame();
  document.getElementById("loader").style.display = "none";
}

window.onload = function () {
  editor = CodeMirror.fromTextArea(textArea, {
    mode: "python", // Язык программирования (Python)
    // theme: "monokai", // Тема оформления (Monokai)
    lineNumbers: true, // Отображение нумерации строк
    indentUnit: 4, // Размер отступа (в количестве пробелов)
  });
  editor.setOption("readOnly", false);
  set_code(python_example_code);
};

function reset_anim_area() {
  // Получите ссылку на div, если у вас её нет
  // const myDiv = document.getElementById("animation_area");

  // Восстановите изначальное содержимое div
  animation_area.innerHTML = anim_area_orig_content;
  variables_list.innerHTML = variables_list_orig_content;
  line_inputs = {};
  line_outputs = {};
}
