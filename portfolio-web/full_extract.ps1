param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw

# Search for video IDs and titles in playlistVideoRenderer blocks
# Pattern: "videoId":"[ID]","thumbnail":...,"title":{"runs":[{"text":"[TITLE]"}]}

$results = @()
$matches = [regex]::Matches($content, '\{"playlistVideoRenderer":\{"videoId":"(?<id>.*?)".*?"title":\{"runs":\[\{"text":"(?<title>.*?)"\}\]\}')

foreach ($m in $matches) {
    $id = $m.Groups['id'].Value
    $title = $m.Groups['title'].Value
    $results += "$title|$id"
}

$results | Select-Object -Unique
