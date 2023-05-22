class AnimFrame {
  constructor(code_frames, vars, output) {
    this.pyobj_map = new Map(); // pyid -> PythonObject
    this.code_frames_map = new Map(); // id -> Map
    this.list_variables = [];
    this.output = output;
    this.line_num = code_frames[code_frames.length - 1].get("line_num");
    for (let [id, data] of vars) {
      this.pyobj_map.set(
        id,
        new PythonObject(id, data.get("repr"), data.get("vars"))
      );
    }
    make_connections(this.pyobj_map);

    for (let code_frame of code_frames) {
      this.code_frames_map.set(code_frame.get("id"), code_frame);
      for (let [name, pyid] of code_frame.get("vars")) {
        // console.log(name, pyid);
        this.list_variables.push(
          new ListVariable(
            code_frame.get("id"),
            [name],
            document.getElementById("variables_list")
          )
        );
      }
    }
  }

  show(htmlvars) {
    for (let list_variable of this.list_variables) {
      list_variable.show();
    }

    document.getElementById("output").value = this.output;

    this.highlighted_line = highlight_code_line(this.line_num);

    for (let [id, pyobj] of this.pyobj_map) {
      pyobj.clear();
    }
    for (let [id, htmlvar] of htmlvars) {
      let pyid = htmlvar.update(this.code_frames_map, this.pyobj_map);
      if (pyid != -1) {
        let pyobj = this.pyobj_map.get(Number(pyid));
        pyobj.add_htmlvar(htmlvar);
      }
    }
    for (let [id, pyobj] of this.pyobj_map) {
      pyobj.make_connections();
    }
  }

  hide(htmlvars) {
    for (let list_variable of this.list_variables) {
      list_variable.hide();
    }
    this.highlighted_line.clear();
  }

  highlight_htmlvar(htmlvar, border) {
    // console.log("AnimFrame.highlight_htmlvar", htmlvar.html_obj.id);
    for (let [pyid, pyobj] of this.pyobj_map) {
      pyobj.highlight_htmlvar(htmlvar, border);
    }
  }

  destructor() {
    for (let list_var of this.list_variables) {
      list_var.destructor();
    }
  }
}

class Animation {
  constructor() {
    this.frames = [];
    this.frame_num = -1;
    this.htmlvars = new Map();
  }
  add_frame(anim_frame_dict) {
    this.frames.push(
      new AnimFrame(
        anim_frame_dict.get("code_frames"),
        anim_frame_dict.get("vars"),
        anim_frame_dict.get("output")
      )
    );
  }

  get_frame() {
    return this.frames[this.frame_num];
  }

  next() {
    if (this.frame_num == this.frames.length) {
      console.log("no next frame");
      return;
    }
    this.set_frame(this.frame_num + 1);
  }

  prev() {
    if (this.frame_num == -1) {
      console.log("no previous frame");
      return;
    }
    this.set_frame(this.frame_num - 1);
  }

  set_frame(new_frame_num) {
    let from_frame = this.frames[this.frame_num];
    this.frame_num = new_frame_num;
    let to_frame = this.frames[this.frame_num];
    if (from_frame) {
      from_frame.hide(this.htmlvars);
    }
    if (to_frame) {
      to_frame.show(this.htmlvars);
    }
  }

  create_htmlvar(event, id) {
    let htmlvar = new HTMLVariable(event, id);
    this.htmlvars.set(id, htmlvar);
    this.set_frame(this.frame_num);
  }

  remove_htmlvar(htmlobj_id) {
    this.htmlvars.get(htmlobj_id).destructor();
    this.htmlvars.delete(htmlobj_id);
    this.set_frame(this.frame_num);
  }

  update_htmlvar_lines(htmlobj_id) {
    this.htmlvars.get(htmlobj_id).update_lines();
  }

  highlight_htmlvar(html_obj, border) {
    let htmlvar = this.htmlvars.get(html_obj.id);
    let anim_frame = this.get_frame();
    if (anim_frame) {
      anim_frame.highlight_htmlvar(htmlvar, border);
    }
  }

  destructor() {
    for (let [id, htmlvar] of this.htmlvars) {
      htmlvar.destructor();
      this.htmlvars.delete(id);
    }
    for (let frame of this.frames) {
      frame.destructor();
    }
    let cur_frame = this.get_frame();
    if (cur_frame) {
      cur_frame.hide();
    }
    this.frames = [];
  }
}

var animation;
