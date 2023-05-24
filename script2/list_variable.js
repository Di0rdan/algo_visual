class ListVariable {
  constructor(codeframe_id, path, html_ul) {
    this.codeframe_id = codeframe_id;
    this.path = path;
    this.html_ul = html_ul;
    this.html_obj = document
      .getElementById("list_python_variable_template")
      .cloneNode(true);
    this.lines = new Map();
    this.html_obj.id = ["list", codeframe_id, ...path].join(".");
    this.html_obj.addEventListener("dragstart", pyvar_list_dragstart_callback);
    // let line_handler = document
    //   .getElementById("line_handler_template")
    //   .cloneNode(true);
    // this.html_obj.appendChild(line_handler);

    // Добавляем текст внутрь html_obj после копии line_handler
    this.html_obj.insertAdjacentText("beforeend", path.slice(-1)[0]);

    // this.html_obj.innerHTML = line_handler + path.slice(-1)[0];
    this.html_ul.appendChild(this.html_obj);
  }

  show() {
    this.html_obj.style.display = "block";
  }

  hide() {
    this.html_obj.style.display = "none";
  }

  remove_line(to_htmlvar) {
    this.lines.get(to_htmlvar).remove();
    this.lines.delete(to_htmlvar);
    to_htmlvar.input_lines.delete(this);
  }

  connect(to_htmlvar) {
    // console.log("listvar.connect:", this.html_obj.id, to_htmlvar.html_obj.id);
    this.lines.set(to_htmlvar, make_line());
    to_htmlvar.input_lines.add(this);
    this.update_line(to_htmlvar);
  }

  update_line(to_htmlvar) {
    let line = this.lines.get(to_htmlvar);
    let to = to_htmlvar.html_point;
    let from = this.html_obj;
    if (this.html_ul.style.display == "none") {
      from = this.html_ul.parentElement.children[0];
    }
    update_line(from, to, line);
  }

  update_lines() {
    for (let [to_htmlvar, line] of this.lines) {
      this.update_line(to_htmlvar);
    }
  }

  clear_lines() {
    for (let [to_htmlvar, line] of this.lines) {
      this.remove_line(to_htmlvar);
    }
  }

  destructor() {
    this.html_obj.remove();
    this.clear_lines();
  }
}

function pyvar_list_dragstart_callback(event) {
  // console.log("pyvar_list_dragstart_callback called!");
  currentDraggable = event.target;
  //   console.log(currentDraggable.id);
  let container_rect = currentDraggable.getBoundingClientRect();
  mouseX = event.clientX - container_rect.left;
  mouseY = event.clientY - container_rect.top;
  event.dataTransfer.setData("objectId", currentDraggable.id);
}
