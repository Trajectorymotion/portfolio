param (
    [string]$Path
)

try {
    $content = Get-Content -Path $Path -Encoding Unicode -Raw
} catch {
    $content = Get-Content -Path $Path -Raw
}

# Regex to find title and videoId in a more structured way
# Example: "title":{"runs":[{"text":"Stop Competing With 1000’s 😮‍💨"}],"accessibility":{"accessibilityData":{"label":"Stop Competing With 1000’s 😮‍💨 by Trajectory Motion 8 seconds 48 views"}}},"videoId":"clWBv6XaSLI"
$regex = [regex]'\"title\":\{\"runs\":\[\{\"text\":\"(.*?)\"\}\]\}.*?\"videoId\":\"([a-zA-Z0-9_-]{11})\"'
$matches = $regex.Matches($content)

$results = @()
foreach ($m in $matches) {
    $title = $m.Groups[1].Value
    $id = $m.Groups[2].Value
    
    # Filter out UI strings and long metadata
    $uiStrings = 'Share|Play all|Keyboard shortcuts|Settings|Feedback|Help|More|Like|Dislike|Add to queue'
    if ($title -and ($title.Length -lt 100) -and ($title -notmatch $uiStrings)) {
        $results += [PSCustomObject]@{ id = $id; title = $title }
    }
}

$results | Select-Object -Unique | ConvertTo-Json
