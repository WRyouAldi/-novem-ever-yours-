from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "manifest.json"

def main():
    if not MANIFEST.exists():
        print("FAIL: assets/manifest.json is missing.")
        return 1
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    photos = [data["hero"]["path"], *[item["path"] for item in data["photos"]]]
    videos = data["videos"]
    paths = photos + [p for item in videos for p in (item["path"], item["poster"])]
    missing = [path for path in paths if not (ROOT / path).is_file()]
    if missing:
        print("FAIL: missing media files:")
        for path in missing: print(" -", path)
        return 1
    if len(data["photos"]) != 21 or len(videos) != 11:
        print(f"FAIL: expected 21 gallery photos and 11 videos; found {len(data['photos'])} and {len(videos)}.")
        return 1
    source = (ROOT / "src" / "main.jsx").read_text(encoding="utf-8")
    required = ["photo-", "clip-", "Dialog.Root", "Our Journey", "Our Gallery", "Our Video", "Dear Sayang"]
    absent = [token for token in required if token not in source]
    if absent:
        print("FAIL: React experience is missing required features: " + ", ".join(absent))
        return 1
    print(f"PASS: {len(photos)} photos (including cover), {len(videos)} videos and {len(videos)} posters exist.")
    print("PASS: React app includes the story, gallery, Base UI lightbox and letter sections.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
