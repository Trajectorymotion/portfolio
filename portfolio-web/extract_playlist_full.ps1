param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw

# Search for the video object pattern in ytInitialData
# We'll use a regex that handles the JSON-like structure of titles and IDs
$regex = [regex]'\"title\":\{\"runs\":\[\{\"text\":\"(.*?)\"\}\]\}.*?\"videoId\":\"([a-zA-Z0-9_-]{11})\"'
$matches = $regex.Matches($content)

$results = @()
foreach ($m in $matches) {
    $title = $m.Groups[1].Value
    $id = $m.Groups[2].Value
    
    # Filter out common YouTube UI strings
    $uiStrings = 'Share|Play all|Keyboard shortcuts|Settings|Feedback|Help|More|Like|Dislike|Add to queue'
    if ($title -and $title -notmatch $uiStrings) {
        $results += "$title|$id"
    }
}

# Output unique results
$results | Select-Object -Unique
