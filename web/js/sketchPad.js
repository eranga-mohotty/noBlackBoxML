class SketchPad {
  constructor(container, size = 400) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.canvas.style = `
            background-color:white;
            box-shadow: 0px 0px 10px 2px black;
        `;
    container.appendChild(this.canvas);

    const lineBreak = document.createElement("br");
    container.appendChild(lineBreak);

    this.undoBtn = document.createElement("button");
    this.undoBtn.innerHTML = "UNDO";
    this.undoBtn.classList = [
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    ];
    container.appendChild(this.undoBtn);

    this.ctx = this.canvas.getContext("2d");

    this.reset();
    this.#addEventListeners();
  }

  reset() {
    this.paths = [];
    this.isDrawing = false;
    this.#redraw();
  }

  #addEventListeners() {
    this.canvas.onmousedown = (evt) => {
      this.paths.push([this.#getMouse(evt)]);
      this.isDrawing = true;
    };

    this.canvas.onmousemove = (evt) => {
      if (this.isDrawing) {
        this.paths[this.paths.length - 1].push(this.#getMouse(evt));
        this.#redraw();
      }
    };

    this.canvas.onmouseup = () => {
      this.isDrawing = false;
    };

    this.canvas.ontouchstart = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousedown(loc);
    };

    this.canvas.ontouchmove = (evt) => {
      const loc = evt.touches[0];
      this.canvas.onmousemove(loc);
    };
    this.canvas.ontouchend = () => {
      this.canvas.onmouseup();
    };

    this.undoBtn.onclick = () => {
      this.paths.pop();
      this.#redraw();
    };
  }
  #getMouse = (evt) => {
    const rect = this.canvas.getBoundingClientRect();
    return [
      Math.round(evt.clientX - rect.left),
      Math.round(evt.clientY - rect.top),
    ];
  };

  #redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    draw.paths(this.ctx, this.paths);

    if (this.paths.length > 0) {
      this.#enableButton(this.undoBtn);
    } else {
      this.#disableButton(this.undoBtn);
    }
  }
  #disableButton(button) {
    button.disabled = true;
    button.classList = [
      "bg-gray-300 font-bold py-2 px-4 rounded-md cursor-not-allowed opacity-50",
    ];
  }
  #enableButton(button) {
    button.disabled = false;
    button.classList = [
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
    ];
  }
}
