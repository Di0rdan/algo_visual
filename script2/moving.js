// shifts relative to the mouse of the currently captured object
let mouseX = 0;
let mouseY = 0;

// is any object dragging now?
let isDragging = false;

// current dragging object
let currentDraggable = null;

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
    // console.log("drop", event.clientX, event.clientY);
    animation.create_htmlvar(event, id);
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
  //   console.log(newX, mouseX);
  if (newX < 0) newX = 0;
  if (newX > maxX) newX = maxX;
  return newX + containerRect.left;
}

function animY(e) {
  const containerRect = animation_area.getBoundingClientRect();
  let newY = e.clientY - mouseY - containerRect.top;
  let maxY = animation_area.clientWidth - currentDraggable.clientWidth;
  //   console.log(newY, mouseY);
  if (newY < 0) newY = 0;
  if (newY > maxY) newY = maxY;
  return newY + containerRect.top;
}

document.addEventListener("mousemove", (e) => {
  if (isDragging && currentDraggable) {
    currentDraggable.style.left = animX(e) + "px";
    currentDraggable.style.top = animY(e) + "px";

    let htmlvar = animation.htmlvars.get(currentDraggable.id);
    if (htmlvar) {
      htmlvar.update_lines();
    }
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  currentDraggable = null;
});
