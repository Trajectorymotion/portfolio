param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw

# Search for the video object pattern in ytInitialData
# Expected pattern: "title":{"runs":[{"text":"VIDEO_TITLE"}]},"videoId":"VIDEO_ID"
$regex = [regex]'\"title\":\{\"runs\":\[\{\"text\":\"(.*?)\"\}\]\}.*?\"videoId\":\"([a-zA-Z0-9_-]{11})\"'
$matches = $regex.Matches($content)

$results = @()
foreach ($m in $matches) {
    $title = $m.Groups[1].Value
    $id = $m.Groups[2].Value
    
    # Filter out common YouTube UI strings that match the pattern but aren't videos
    $uiStrings = 'Share|Play all|Keyboard shortcuts|Settings|Feedback|Help|More|Like|Dislike'
    if ($title -and $title -notmatch $uiStrings) {
        $results += "$title|$id"
    }
}

# Output unique results
$results | Select-Object -Unique
