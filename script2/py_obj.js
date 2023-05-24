class PythonObject {
  constructor(id, repr, vars, line_storage) {
    this.id = id;
    this.repr = repr;
    this.vars = vars;
    this.inputs = new Map();
    this.outputs = new Map();
    this.htmlvars = new Map();
  }

  add_htmlvar(htmlvar) {
    this.htmlvars.set(htmlvar.html_obj.id, htmlvar);
  }
  remove_htmlvar(htmlvar) {
    this.htmlvars.delete(htmlvar.html_obj.id);
  }

  start_update() {
    let visited = new Set([this]);
    this.dfs_for_dfs(this, visited);
  }

  connect(to, start_name) {
    // console.log("connect:", to, var_name);
    // console.log("from:");
    // for (let [id, htmlvar] of this.htmlvars) {
    //   console.log("     ", id);
    // }
    // console.log("to:");
    // for (let [id, htmlvar] of to.htmlvars) {
    //   console.log("     ", id);
    // }

    for (let [id, from_htmlvar] of this.htmlvars) {
      for (let [id, to_htmlvar] of to.htmlvars) {
        from_htmlvar.add_line(to_htmlvar, start_name);
      }
    }
  }

  dfs(pyobj, visited, start_name_) {
    let start_name = start_name_;
    for (let [name, next] of pyobj.outputs) {
      if (visited.has(next.id)) {
        continue;
      }
      if (!start_name_) {
        start_name = name;
      }
      if (next.htmlvars.size != 0) {
        this.connect(next, start_name);
        continue;
      }
      visited.add(next.id);
      this.dfs(next, visited, start_name);
    }
  }

  dfs_for_dfs(pyobj, visited) {
    pyobj.make_connections();
    for (let [name, next] of pyobj.outputs) {
      if (visited.has(next.id)) {
        continue;
      }
      visited.add(next.id);
      this.dfs_for_dfs(next, visited);
    }
  }

  make_connections() {
    if (this.htmlvars.size == 0) {
      return;
    }
    for (let [htmlobj_id, htmlvar] of this.htmlvars) {
      htmlvar.clear_lines();
    }
    let visited = new Set([this]);
    this.dfs(this, visited, undefined);
  }

  clear() {
    this.htmlvars = new Map();
  }

  highlight_htmlvar(blink_htmlvar, border) {
    let need_highlight = false;
    for (let [htmlobj_id, htmlvar] of this.htmlvars) {
      if (htmlobj_id == blink_htmlvar.html_obj.id) {
        need_highlight = true;
        break;
      }
    }
    if (!need_highlight) {
      return;
    }
    // console.log("need highlight", this);
    for (let [htmlobj_id, htmlvar] of this.htmlvars) {
      htmlvar.highlight(border);
    }
  }
}

function make_connections(pyobj_map) {
  for (let [pyid_from, pyobj_from] of pyobj_map) {
    for (let [name, pyid_to] of pyobj_from.vars) {
      let pyobj_to = pyobj_map.get(pyid_to);
      pyobj_from.outputs.set(name, pyobj_to);
      pyobj_to.inputs.set(name, pyobj_from);
    }
  }
}
