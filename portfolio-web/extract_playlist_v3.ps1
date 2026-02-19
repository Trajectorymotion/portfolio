param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw

# Search for videoRenderer or playlistVideoRenderer patterns
# We look for "videoId":"..." and "title":{"runs":[{"text":"..."}]} nearby
# A common pattern is: "videoId":"ID","thumbnail":...,"title":{"runs":[{"text":"TITLE"}]}

$regex = [regex]'"videoId":"(?<id>[a-zA-Z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"(?<title>.*?)"\}\]\}'
$matches = $regex.Matches($content)

$results = @()
foreach ($m in $matches) {
    $id = $m.Groups['id'].Value
    $title = $m.Groups['title'].Value
    $results += "$title|$id"
}

# Output unique results
$results | Select-Object -Unique
