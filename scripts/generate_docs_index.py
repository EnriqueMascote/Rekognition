from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUT = ROOT / "docs-index"
OUT.mkdir(exist_ok=True)

items = []
for md in DOCS.rglob("*.md"):
    text = md.read_text(encoding="utf-8")
    title = md.stem
    if text.startswith("---"):
        fm = text.split("---", 2)[1]
        m = re.search(r"^title:\s*(.+)$", fm, re.M)
        if m:
            title = m.group(1).strip()
    items.append({
        "path": str(md.relative_to(ROOT)),
        "title": title,
        "size": len(text),
    })

(OUT / "manifest.json").write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Generated {OUT / 'manifest.json'}")
