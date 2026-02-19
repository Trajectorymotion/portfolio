param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw
$regex = [regex]'\"videoId\":\"([a-zA-Z0-9_-]{11})\"'
$matches = $regex.Matches($content)
$ids = $matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

foreach ($id in $ids) {
    Write-Output $id
}
