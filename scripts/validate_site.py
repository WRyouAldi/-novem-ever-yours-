from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "index.html"

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.images = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        element_id = attrs.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicates.append(element_id)
            self.ids.add(element_id)
        if tag == "img":
            src = attrs.get("src")
            if not src:
                self.errors.append("An <img> is missing src.")
            if attrs.get("alt") is None:
                self.errors.append(f"Image {src or '(unknown)'} is missing alt text.")
            if src:
                self.images.append(src)

def main():
    if not HTML_FILE.exists():
        print("FAIL: index.html is missing.")
        return 1
    parser = AuditParser()
    parser.feed(HTML_FILE.read_text(encoding="utf-8"))
    parser.close()
    if parser.duplicates:
        parser.errors.append("Duplicate HTML id values: " + ", ".join(parser.duplicates))
    for src in parser.images:
        if src.startswith(("https://", "http://", "data:", "//")):
            continue
        local_path = (ROOT / src.split("?", 1)[0].split("#", 1)[0]).resolve()
        if not local_path.is_relative_to(ROOT.resolve()):
            parser.errors.append(f"Image path escapes repository: {src}")
    missing = [
        src for src in parser.images
        if not src.startswith(("https://", "http://", "data:", "//"))
        and not (ROOT / src.split("?", 1)[0].split("#", 1)[0]).exists()
    ]
    if parser.errors:
        for error in parser.errors:
            print("FAIL:", error)
        return 1
    print(f"PASS: parsed index.html; {len(parser.ids)} unique IDs; {len(parser.images)} image elements.")
    if missing:
        print("WARN: personal image files are not present yet (placeholders will be shown):")
        for src in missing:
            print(" -", src)
    else:
        print("PASS: all local image files exist.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
