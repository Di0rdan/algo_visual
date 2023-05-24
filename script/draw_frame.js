function make_variables_list(code_frames) {
  let code_line = undefined;
  let line_num = undefined;
  for (id of list_python_variables) {
    document.getElementById(id).style.display = "none";
  }
  for (code_frame of code_frames) {
    code_line = code_frame.get("code_line");
    line_num = code_frame.get("line_num");
    for (variable of code_frame.get("vars")) {
      let id = "list_" + code_frame.get("id") + "." + variable[0];
      document.getElementById(id).style.display = "block";
    }
  }
  console.log(code_line);

  return line_num;
}

function highlight_code_line(line_num) {
  if (highlightedLine) {
    highlightedLine.clear();
  }
  if (code_frames.length > 0) {
    const from = { line: line_num - 1, ch: 0 };
    const to = { line: line_num - 1 };
    highlightedLine = editor.markText(from, to, { className: "highlighted" });
  } else {
    code_line = undefined;
    line_num = undefined;
    highlightedLine = undefined;
  }
}

function is_animframe_contain_pyvar(pyvar, code_frames, vars) {
  let path = pyvar.id.split(".");
  for (code_frame of code_frames) {
    if (code_frame.get("id") == path[0]) {
      let cur_dct = code_frame;
      let hide = false;
      for (var_name of path.slice(1)) {
        tmp = cur_dct;
        let id = cur_dct.get("vars").get(var_name);
        if (!id) {
          hide = true;
          break;
        }
        cur_dct = vars.get(id);
      }
      return !hide;
    }
  }
}

function make_connections_call(id, vars, pyids, used, res) {}

function make_connections(pyvar, pyids) {
  let used = new Set();
  let res = [];
  let id = get_pyid(pyvar);
  make_connections_call(id, vars, pyids, used, res);
}

function show_pyvars(code_frames, vars) {
  let pyids = new Set();
  for (pyvar of get_all_pyvars()) {
    make_linked_vars(pyvar);
    pyids.add(get_pyid(pyvar));
    if (is_animframe_contain_pyvar(pyvar, code_frames, vars)) {
      show_variable(pyvar);
    } else {
      hide_variable(pyvar);
    }
  }
  make_connection(pyvar, vars, pyids);
}

function hide_variable(pyvar) {
  pyvar.style.display = "none";
  for (id of line_inputs[pyvar.id]) {
    document.getElementById(id + "->" + pyvar.id).style.display = "none";
  }
  for (id of line_outputs[pyvar.id]) {
    document.getElementById(pyvar.id + "->" + id).style.display = "none";
  }
}

function show_variable(pyvar) {
  pyvar.style.display = "flex";
  for (id of line_inputs[pyvar.id]) {
    if (document.getElementById(id).style.display != "none") {
      document.getElementById(id + "->" + pyvar.id).style.display = "flex";
    }
  }
  for (id of line_outputs[pyvar.id]) {
    if (document.getElementById(id).style.display != "none") {
      document.getElementById(pyvar.id + "->" + id).style.display = "flex";
    }
  }
}

function draw_frame() {
  let anim_frame = python_anim_frames[anim_frame_num];
  let code_frames = anim_frame.get("code_frames");
  let vars = anim_frame.get("vars");

  line_num = make_variables_list(code_frames);
  highlight_code_line(line_num);

  show_pyvars(code_frames, vars);
  document.getElementById("output").value = anim_frame.get("output");
}
