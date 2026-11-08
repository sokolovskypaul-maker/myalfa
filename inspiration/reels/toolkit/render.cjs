// רינדור הקומפוזיציה ל-MP4: node render.cjs [index.html] [out.mp4] [fps]
// פותח את העמוד ב-Chromium ללא ראש ב-1080×1920, קורא ל-seek(t) לכל פריים, שומר PNG, ומקודד ב-ffmpeg.
const { chromium } = require("playwright");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");

(async () => {
  const html = path.resolve(process.argv[2] || "index.html");
  const out = path.resolve(process.argv[3] || "out.mp4");
  const fps = Number(process.argv[4] || 30);
  const frames = fs.mkdtempSync(path.join(os.tmpdir(), "reel-frames-"));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + html);
  await page.evaluate(() => window.ready);                 // הפונטים נטענו
  const duration = await page.evaluate(() => window.duration());
  const total = Math.round(duration * fps);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.seek(t), i / fps);
    await page.screenshot({ path: path.join(frames, String(i).padStart(5, "0") + ".png") });
    if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}/${duration.toFixed(1)}s`);
  }
  await browser.close();

  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", path.join(frames, "%05d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", out], { stdio: "inherit" });
  fs.rmSync(frames, { recursive: true, force: true });
  console.log(`\n${out}: ${total} frames, ${duration.toFixed(2)}s @ ${fps}fps`);
})().catch((e) => { console.error(e); process.exit(1); });
