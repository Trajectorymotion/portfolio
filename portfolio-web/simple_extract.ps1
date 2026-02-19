param (
    [string]$Path
)

$content = Get-Content -Path $Path -Raw
$regex = [regex]'\"videoId\":\"(?<id>[a-zA-Z0-9_-]{11})\"'
$matches = $regex.Matches($content)
$ids = $matches | ForEach-Object { $_.Groups['id'].Value } | Select-Object -Unique

foreach ($id in $ids) {
    Write-Output "ID: $id"
}
