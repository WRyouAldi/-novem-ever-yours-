from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "index.html"
EXTERNAL = ("https://", "http://", "data:", "//")

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.media = []
        self.errors = []
        self.video_count = 0

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
                self.media.append(src)
        if tag == "video":
            self.video_count += 1
            if attrs.get("poster"):
                self.media.append(attrs["poster"])
        if tag in ("source", "audio", "video"):
            src = attrs.get("src")
            if src:
                self.media.append(src)

def main():
    if not HTML_FILE.exists():
        print("FAIL: index.html is missing.")
        return 1
    parser = AuditParser()
    parser.feed(HTML_FILE.read_text(encoding="utf-8"))
    parser.close()
    if parser.duplicates:
        parser.errors.append("Duplicate HTML id values: " + ", ".join(parser.duplicates))
    missing = []
    for src in parser.media:
        if src.startswith(EXTERNAL):
            continue
        local_path = (ROOT / src.split("?", 1)[0].split("#", 1)[0]).resolve()
        if not local_path.is_relative_to(ROOT.resolve()):
            parser.errors.append(f"Media path escapes repository: {src}")
        elif not local_path.exists():
            missing.append(src)
    if parser.errors:
        for error in parser.errors:
            print("FAIL:", error)
        return 1
    print(f"PASS: parsed index.html; {len(parser.ids)} unique IDs; {len(parser.media)} media references; {parser.video_count} video players.")
    if missing:
        print("WARN: media files are not present in the repository yet:")
        for src in missing:
            print(" -", src)
    else:
        print("PASS: every referenced local media file exists.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
