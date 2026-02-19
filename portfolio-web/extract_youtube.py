import re
import json
import sys

def extract_videos(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all video IDs
    video_ids = list(set(re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', content)))
    
    # Try to find titles as well
    # Titles are usually in "title":{"runs":[{"text":"..."}]}
    # We'll try to find snippets that include both videoId and title
    results = []
    for vid in video_ids:
        # Look for the video id and then the next title text
        # This is a bit brittle but might work for basic cases
        pattern = re.escape(f'"videoId":"{vid}"') + r'.*?"title":\{"runs":\[\{"text":"(.*?)"\}\]\}'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            title = match.group(1)
            # Filter out UI strings
            if title not in ["Share", "Play all", "Add to queue", "Settings", "Feedback", "Help"]:
                results.append({"id": vid, "title": title})
        else:
            results.append({"id": vid, "title": "Untitled Shortcut"})

    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract.py <file_path>")
        sys.exit(1)
    
    videos = extract_videos(sys.argv[1])
    print(json.dumps(videos, indent=2))
