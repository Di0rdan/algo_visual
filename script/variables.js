function remove_variable(button) {
  let pyvar = button.parentElement.parentElement.parentElement;

  for (id of line_inputs[pyvar.id]) {
    document.getElementById(id + "->" + pyvar.id).remove();
    line_outputs[id].delete(pyvar.id);
  }
  for (id of line_outputs[pyvar.id]) {
    document.getElementById(pyvar.id + "->" + id).remove();
    line_inputs[id].delete(pyvar.id);
  }
  line_inputs[pyvar.id] = new Set();
  line_outputs[pyvar.id] = new Set();
  pyvar.remove();
}

function show_list(button) {
  var_list = button.parentElement.parentElement.parentElement.children[1];
  if (var_list.style.display) {
    var_list.style.display =
      var_list.style.display === "none" ? "block" : "none";
  } else {
    var_list.style.display = "block";
  }
}

function make_linked_vars(obj) {
  let id = obj.id;
  let path = id.split(".");
  let anim_frame = python_anim_frames[anim_frame_num];
  let code_frames = anim_frame.get("code_frames");
  for (code_frame of code_frames) {
    if (code_frame.get("id") == path[0]) {
      let py_id = code_frame.get("vars").get(path[1]);
      if (!py_id) {
        return;
      }
      for (var_name of path.slice(2)) {
        py_id = anim_frame.get("vars").get(py_id).get("vars").get(var_name);
      }
      obj.children[1].innerHTML = "";
      for (var_name of anim_frame.get("vars").get(py_id).get("vars").keys()) {
        var newItem = document.createElement("li");
        newItem.id = "list_" + id + "." + var_name;
        // console.log(newItem.id);
        newItem.textContent = newItem.id.split(".").slice(-1)[0];
        newItem.draggable = true;
        newItem.addEventListener("dragstart", pyvar_list_dragstart_callback);
        obj.children[1].appendChild(newItem);
      }
    }
  }
}

function make_pyvar_from_list(event, id) {
  // Создание копии объекта и добавление его в целевой контейнер
  const objectCopy = python_variable_template.cloneNode(true);
  objectCopy.style.transform = `scale(${scaling})`;
  objectCopy.addEventListener("mousedown", mousedown_moving_callback);
  objectCopy.children[0].children[0].textContent = id.split(".").slice(-1)[0];
  objectCopy.id = id;
  objectCopy.style.display = "flex";
  objectCopy.style.left = animX(event) + "px";
  objectCopy.style.top = animY(event) + "px";

  let parent_id = id.substring(0, id.lastIndexOf("."));

  line_inputs[objectCopy.id] = new Set();
  line_outputs[objectCopy.id] = new Set();
  animation_area.appendChild(objectCopy);
  // connect_vars(parent_id, id);
  make_linked_vars(objectCopy);
  // console.log(objectCopy);
}

function connect_vars(id1, id2) {
  const div1 = document.getElementById(id1);
  const div2 = document.getElementById(id2);

  if (!div1) {
    return;
  }
  if (!div2) {
    return;
  }
  line_outputs[div1.id].add(div2.id);
  line_inputs[div2.id].add(div1.id);

  var line = document.getElementById("line_template").cloneNode(true);
  const line_storage = document.getElementById("line_storage");
  line.style.display = "block";

  line.id = id1 + "->" + id2;
  line.setAttribute("stroke", "black");

  update_line(div1, div2, line);
  line_storage.appendChild(line);
}

function update_line(div1, div2, line) {
  const rect1 = div1.children[0].getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();
  let anim_area_left = animation_area.getBoundingClientRect().left;
  let anim_area_top = animation_area.getBoundingClientRect().top;

  const x1 = rect1.left + rect1.width / 2 - anim_area_left;
  const y1 = rect1.top + rect1.height / 2 - anim_area_top;
  const x2 = rect2.left + rect2.width / 2 - anim_area_left;
  const y2 = rect2.top + rect2.height / 2 - anim_area_top;

  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
}

function update_lines(obj) {
  for (input_id of line_inputs[obj.id]) {
    update_line(
      document.getElementById(input_id),
      document.getElementById(obj.id),
      document.getElementById(input_id + "->" + obj.id)
    );
  }
  for (output_id of line_outputs[obj.id]) {
    update_line(
      document.getElementById(obj.id),
      document.getElementById(output_id),
      document.getElementById(obj.id + "->" + output_id)
    );
  }
}

function get_pyid(pyvar) {
  let anim_frame = python_anim_frames[anim_frame_num];
  let code_frames = anim_frame.get("code_frames");
  let vars = anim_frame.get("vars");

  let path = pyvar.id.split(".").slice(1);
  let code_frame_id = pyvar.id.split(".")[0];

  for (let code_frame of code_frames) {
    if (code_frame.get("id") == code_frame_id) {
      let cur_dct = code_frame;
      let id;
      for (var_name of path.slice(1)) {
        id = cur_dct.get("vars").get(var_name);
        if (!id) {
          break;
        }
        cur_dct = vars.get(id);
      }
      return id;
    }
  }
}
