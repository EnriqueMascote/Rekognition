from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DOC_PATHS = [ROOT / "docs", ROOT / "standards"]

required = ["title:", "status:", "owner:", "classification:", "mandatory:", "last_reviewed:", "tags:"]
missing = []

for root in DOC_PATHS:
    if not root.exists():
        continue
    for md in root.rglob("*.md"):
        text = md.read_text(encoding="utf-8")
        if not text.startswith("---"):
            missing.append((md, "missing frontmatter"))
            continue
        fm = text.split("---", 2)[1]
        for key in required:
            if key not in fm:
                missing.append((md, f"missing {key}"))

if missing:
    print("Metadata validation failed:")
    for path, msg in missing:
        print(f"- {path.relative_to(ROOT)}: {msg}")
    sys.exit(1)

print("Metadata validation passed.")
