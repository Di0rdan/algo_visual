animation_area.addEventListener("dragover", (event) => {
  // Разрешаем помещать элемент в зону перетаскивания
  event.preventDefault();
});

animation_area.addEventListener("drop", (event) => {
  event.preventDefault();
  // Получение объекта по ID
  const objectId = event.dataTransfer.getData("objectId");
  const draggedObject = document.getElementById(objectId);
  let id = draggedObject.id.slice(5);
  if (!document.getElementById(id)) {
    make_pyvar_from_list(event, id);
  }
});

function mousedown_moving_callback(e) {
  //   console.log("start dragging" + e.target.id);
  var elem = e.target;
  if (!(elem instanceof HTMLLIElement)) {
    isDragging = true;
    currentDraggable = this;
    mouseX = e.clientX - currentDraggable.offsetLeft;
    mouseY = e.clientY - currentDraggable.offsetTop;
  }
}

function animX(e) {
  const containerRect = animation_area.getBoundingClientRect();
  let newX = e.clientX - mouseX - containerRect.left;
  let maxX = animation_area.clientWidth - currentDraggable.clientWidth;
  if (newX < 0) newX = 0;
  if (newX > maxX) newX = maxX;
  return newX + containerRect.left;
}

function animY(e) {
  const containerRect = animation_area.getBoundingClientRect();
  let newY = e.clientY - mouseY - containerRect.top;
  let maxY = animation_area.clientWidth - currentDraggable.clientWidth;
  if (newY < 0) newY = 0;
  if (newY > maxY) newY = maxY;
  return newY + containerRect.top;
}

document.addEventListener("mousemove", (e) => {
  if (isDragging && currentDraggable) {
    currentDraggable.style.left = animX(e) + "px";
    currentDraggable.style.top = animY(e) + "px";
    update_lines(currentDraggable);
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  currentDraggable = null;
});

function pyvar_list_dragstart_callback(event) {
  // console.log("pyvar_list_dragstart_callback called!");
  currentDraggable = event.target;
  // console.log(currentDraggable.id);
  mouseX = event.clientX - currentDraggable.offsetLeft;
  mouseY = event.clientY - currentDraggable.offsetTop;
  event.dataTransfer.setData("objectId", currentDraggable.id);
}
