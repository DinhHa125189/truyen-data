const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function isStoryDir(dir) {
  return fs.statSync(dir).isDirectory() &&
         !dir.includes(".git") &&
         !dir.includes("scripts");
}

const dirs = fs.readdirSync(ROOT)
  .map(name => path.join(ROOT, name))
  .filter(isStoryDir);

dirs.forEach(storyPath => {
  const slug = path.basename(storyPath);

  const files = fs.readdirSync(storyPath)
    .filter(f => f.endsWith(".md") && f.startsWith("chuong-"));

  if (!files.length) return;

  const chapters = files.map(f => {
    const m = f.match(/(\d+)/);
    if (!m) return null;
    const num = parseInt(m[1], 10);
    return { number: num, title: `Chương ${num}` };
  }).filter(Boolean)
    .sort((a, b) => a.number - b.number);

  const index = {
    story: slug.replace(/-/g, " "),
    slug,
    chapters
  };

  fs.writeFileSync(
    path.join(storyPath, "index.json"),
    JSON.stringify(index, null, 2),
    "utf-8"
  );

  console.log(`✅ Updated index.json for ${slug}`);
});
