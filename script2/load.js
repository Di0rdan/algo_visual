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

function get_input() {
  return document.getElementById("input").value;
}

async function load() {
  if (animation) {
    document.getElementById("vis button").value = "visualize";
    editor.setOption("readOnly", false);
    animation.destructor();
    animation = undefined;
    return;
  }
  console.log("initializing...");
  document.getElementById("loader").style.display = "flex";
  document.getElementById("vis button").value = "change code";
  editor.setOption("readOnly", true);

  let pyodide = await loadPyodide();
  await pyodide.runPython(python_load_code);
  python_anim_frames = pyodide.globals
    .get("animation_dict")
    .toJs()
    .get("frames");

  animation = new Animation();
  for (anim_frame of python_anim_frames) {
    animation.add_frame(anim_frame);
  }
  document.getElementById("loader").style.display = "none";
}
