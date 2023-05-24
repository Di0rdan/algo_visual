class HTMLVariable {
  static storage = new Map();
  constructor(event, id) {
    // console.log(id);
    this.codeframe_id = id.split(".")[0];
    this.path = id.split(".").slice(1);
    // console.log(this.path);

    const objectCopy = python_variable_template.cloneNode(true);
    objectCopy.style.transform = `scale(${scaling})`;
    objectCopy.addEventListener("mousedown", mousedown_moving_callback);
    objectCopy.id = id;
    // console.log("set position:", animX(event) + "px", animY(event) + "px");
    objectCopy.style.left = animX(event) + "px";
    objectCopy.style.top = animY(event) + "px";

    this.html_obj = objectCopy;
    this.html_point = objectCopy.children[0];
    this.list_vars = new Map();
    this.input_lines = new Set();
    this.show();

    animation_area.appendChild(objectCopy);
  }

  hide() {
    this.html_obj.style.display = "none";
  }

  show() {
    this.html_obj.style.display = "flex";
  }

  update(codeframe_map, pyobj_map) {
    let codeframe = codeframe_map.get(Number(this.codeframe_id));
    if (!codeframe) {
      this.hide();
      return -1;
    }
    let vars = codeframe.get("vars");
    let pyid = -1;
    for (let var_name of this.path) {
      pyid = vars.get(var_name);
      if (!pyid) {
        this.hide();
        return -1;
      }
      vars = pyobj_map.get(pyid).vars;
    }

    let html_list = list_by_htmlobj(this.html_obj);
    for (let [name, list_var] of this.list_vars) {
      list_var.destructor();
    }
    this.list_vars = new Map();
    for (let [name, pyid] of vars) {
      let path = this.path.concat([name]);
      let list_var = new ListVariable(this.codeframe_id, path, html_list);
      list_var.show();
      this.list_vars.set(name, list_var);
    }
    // textdiv_by_htmlobj(this.html_obj).textContent = pyobj_map.get(pyid).repr;
    let text_obj = textdiv_by_htmlobj(this.html_obj);
    let path = this.path[0];
    for (let var_name of this.path.slice(1)) {
      if (var_name.charAt(0) != '[') {
        path = path + '.';
      }
      path = path + var_name;
    }
    
    text_obj.children[0].textContent = path;
    text_obj.children[1].textContent = pyobj_map.get(pyid).repr;
    
    


    this.show();
    return pyid;
  }

  destructor() {
    this.html_obj.remove();
    this.clear_lines();

    // clearing inputs:
    for (let list_var of this.input_lines) {
      list_var.remove_line(this);
    }

    this.input_lines = new Set();
  }

  add_line(to_htmlvar, var_name) {
    // console.log("to_htmlvar:", to_htmlvar);
    // console.log("var_name:", var_name);
    this.list_vars.get(var_name).connect(to_htmlvar);
  }

  clear_lines() {
    for (let [name, list_var] of this.list_vars) {
      list_var.clear_lines();
    }
  }

  update_lines() {
    for (let [name, list_var] of this.list_vars) {
      list_var.update_lines();
    }
    for (let list_var of this.input_lines) {
      list_var.update_line(this);
    }
  }

  highlight(outline) {
    this.html_obj.style.outline = outline;
  }
}

function textdiv_by_htmlobj(htmlobj) {
  return htmlobj.children[1].children[0];
}

function htmlid_by_button(button) {
  return button.parentElement.parentElement.parentElement.id;
}

function htmlobj_by_button(button) {
  return document.getElementById(htmlid_by_button(button));
}

function list_by_htmlobj(htmlobj) {
  return htmlobj.children[2];
}

function remove_variable(button) {
  animation.remove_htmlvar(htmlid_by_button(button));
}

function show_list(button) {
  let var_list = list_by_htmlobj(htmlobj_by_button(button));
  if (var_list.style.display) {
    var_list.style.display =
      var_list.style.display === "none" ? "block" : "none";
  } else {
    var_list.style.display = "block";
  }
  animation.update_htmlvar_lines(htmlid_by_button(button));
}

function highlight(html_obj) {
  //   console.log("global.highlight", html_obj.id);
  
  animation.highlight_htmlvar(html_obj, "2px solid #0097d2");
}

function remove_highlight(html_obj) {
  //   console.log("global.remove_highlight", html_obj.id);
  animation.highlight_htmlvar(html_obj, "none");
}
