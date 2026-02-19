param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw

# Split by the video renderer start tag
# This avoids regex stalling on massive single-line content
$parts = $content -split 'playlistVideoRenderer'

$results = @()

foreach ($part in $parts) {
    if ($part -match '"videoId":"(?<id>[a-zA-Z0-9_-]{11})"') {
        $id = $Matches['id']
        
        # Look for the title which usually follows in the same object
        if ($part -match '"title":\{"runs":\[\{"text":"(?<title>.*?)"\}\]\}') {
            $title = $Matches['title']
            $results += "$title|$id"
        }
    }
}

$results | Select-Object -Unique
