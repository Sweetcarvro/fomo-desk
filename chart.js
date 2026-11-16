/** Tiny placeholder chart (not a trading chart). */
(function (root) {
  function placeholder(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#111113";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#3a3a3c";
    ctx.beginPath();
    ctx.moveTo(16, h / 2);
    ctx.lineTo(w - 16, h / 2);
    ctx.stroke();
    ctx.fillStyle = "#8e8e93";
    ctx.font = "13px sans-serif";
    ctx.fillText("Chart scaffolding — no live prices yet", 16, 24);
  }
  root.DeskChart = { placeholder };
})(window);
