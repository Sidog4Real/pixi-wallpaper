import { Application, Assets, ColorMatrixFilter, TilingSprite } from "pixi.js";

async function main() {
  const app = new Application();

  await app.init({
    resizeTo: window,
    background: "#222222",
  });

  document.body.appendChild(app.canvas);

  // --- helpers ---
  function randomTint() {
    return Math.floor(Math.random() * 0xffffff);
  }

  // --- load textures ---
  const textures = [];
  for (let i = 0; i <= 5; i++) {
    textures.push(await Assets.load(`/images/layer${i}.png`));
  }

  // --- create tiling layers ---
  const layers = textures.map((tex, i) => {
    const t = new TilingSprite({
      texture: tex,
      width: app.screen.width,
      height: app.screen.height,
    });

    t.tint = randomTint();
    t.filters = [new ColorMatrixFilter()];
    t.zIndex = i;

    app.stage.addChild(t);
    return t;
  });

  app.stage.sortableChildren = true;

  // --- simple wallpaper layout ---
  function layout() {
    const w = app.screen.width;
    const h = app.screen.height;

    for (const t of layers) {
      t.width = w;
      t.height = h;
      t.tilePosition.set(0, 0); // wallpaper origin
    }
  }

  layout();
  window.addEventListener("resize", layout);

  // --- click canvas to randomise colours ---
  app.canvas.addEventListener("pointerdown", () => {
    for (const t of layers) t.tint = randomTint();
  });

  // --- download button (bottom-right) ---
  const btn = document.createElement("button");
  btn.textContent = "Download PNG";

  Object.assign(btn.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    cursor: "pointer",
    zIndex: 9999,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    fontSize: "14px",
    backdropFilter: "blur(6px)",
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // stops also triggering the canvas click behind it

    // Extract the current rendered stage as a canvas
    const canvas = app.renderer.extract.canvas(app.stage);

    // Convert to PNG data URL
    const dataUrl = canvas.toDataURL("image/png");

    // Trigger a download
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `wallpaper-${Date.now()}.png`;
    a.click();
  });

  document.body.appendChild(btn);
}

main().catch((err) => console.error("Pixi init failed:", err));
