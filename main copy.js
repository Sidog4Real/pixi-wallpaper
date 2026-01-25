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
    textures.push(await Assets.load(`images/layer${i}.png`));
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

  // Shared grid origin for EVERY layer
  const originX = 0;
  const originY = 0;

  for (const t of layers) {
    t.width = w;
    t.height = h;

    // Force same origin
    t.tilePosition.x = originX;
    t.tilePosition.y = originY;

    // Optional: ensure no fractional values ever sneak in
    t.tilePosition.x = Math.round(t.tilePosition.x);
    t.tilePosition.y = Math.round(t.tilePosition.y);
  }
}

  layout();
  window.addEventListener("resize", layout);
}

main();
