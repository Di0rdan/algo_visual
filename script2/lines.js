function make_line() {
  var line = document.getElementById("line_template").cloneNode(true);
  const line_storage = document.getElementById("line_storage");
  line.style.display = "block";

  line.setAttribute("stroke", "black");

  line_storage.appendChild(line);
  return line;
}

function update_line(div1, div2, line) {
  if (div1.id == div2.id) {
    line.style.display = 'none';
    return;
  }
  line.style.display = 'block';
  const rect1 = div1.getBoundingClientRect();
  const rect2 = div2.getBoundingClientRect();
  let anim_area_left = animation_area.getBoundingClientRect().left;
  let anim_area_top = animation_area.getBoundingClientRect().top;
  // console.log(rect1.left, rect1.top);
  const x1 = rect1.left + rect1.width / 2 - anim_area_left;
  const y1 = rect1.top + rect1.height / 2 - anim_area_top;
  const x2 = rect2.left + rect2.width / 2 - anim_area_left;
  const y2 = rect2.top + rect2.height / 2 - anim_area_top;

  const xMid = (x1 + x2) / 2;
  const yMid = (y1 + y2) / 2;

  // console.log(x1, y1, xMid, yMid, x2, y2);

  // throw new Error('update_line');
  // Обновляем атрибут d у элемента path с новыми координатами
  line.setAttribute("d", `M${x1} ${y1} L${xMid} ${yMid} L${x2} ${y2}`);

  //   line.setAttribute("x1", x1);
  //   line.setAttribute("y1", y1);
  //   line.setAttribute("x2", x2);
  //   line.setAttribute("y2", y2);
}
