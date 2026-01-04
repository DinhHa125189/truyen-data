const fs = require("fs");
const path = require("path");

const root = process.cwd();

const stories = [];

fs.readdirSync(root, { withFileTypes: true }).forEach(dir => {
  if (!dir.isDirectory()) return;

  const infoPath = path.join(root, dir.name, "info.json");
  if (!fs.existsSync(infoPath)) return;

  try {
    const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    stories.push(info);
  } catch (e) {
    console.error("Lỗi info.json:", dir.name);
  }
});

fs.writeFileSync(
  "index.json",
  JSON.stringify(stories, null, 2),
  "utf8"
);

console.log("✅ index.json updated:", stories.length, "truyện");
