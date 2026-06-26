param(
  [int]$Pages = 6,
  [string]$OutputPath = "data/external/authorized-missing-cases.json"
)

$ErrorActionPreference = "Stop"

function Remove-SensitiveText {
  param([string]$Value)
  if ([string]::IsNullOrWhiteSpace($Value)) { return "" }
  $text = $Value
  $text = $text -replace '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}', '[correo privado]'
  $text = $text -replace '(?<!\d)(\+?\d[\d\s().-]{6,}\d)(?!\d)', '[telefono privado]'
  $text = $text -replace '(?i)\b(c[eé]dula|cedula|documento|dni|pasaporte)\b[^,.;\n]*', '[documento privado]'
  $text = $text -replace '(?i)\b(edificio|residencias|res\.|torre|piso|apartamento|apto|casa|quinta|calle|carrera|avenida|av\.|bloque)\b[^,.;\n]*', 'referencia privada'
  return $text.Trim()
}

function Convert-Status {
  param([string]$Status)
  if ($Status -eq "found") { return "found" }
  return "active_search"
}

function Get-PageData {
  param([int]$Page)
  $url = "https://buscardesaparecidos.com/buscar?page=$Page"
  $html = (Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 30).Content
  $match = [regex]::Match($html, '<script data-page="app" type="application/json">(?<json>.*?)</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $match.Success) {
    throw "No se encontro data-page JSON en $url"
  }
  $json = [System.Net.WebUtility]::HtmlDecode($match.Groups["json"].Value)
  return $json | ConvertFrom-Json
}

$cases = New-Object System.Collections.Generic.List[object]
$stats = $null

for ($page = 1; $page -le $Pages; $page += 1) {
  $data = Get-PageData -Page $page
  if ($null -eq $stats) { $stats = $data.props.stats }

  foreach ($person in $data.props.people.data) {
    $caseUrl = "https://buscardesaparecidos.com/caso/$($person.slug)"
    $description = Remove-SensitiveText $person.description
    $location = Remove-SensitiveText ($person.last_seen_location)
    $summaryParts = @()
    if ($location) { $summaryParts += "Ultimo lugar reportado: $location." }
    if ($description) { $summaryParts += $description }
    if ($summaryParts.Count -eq 0) { $summaryParts += "Reporte publico autorizado por la fuente original." }

    $cases.Add([ordered]@{
      id = "bd-$($person.slug)"
      status = Convert-Status $person.status
      public_nombre = Remove-SensitiveText $person.full_name
      public_edad_aproximada = if ($person.age) { [string]$person.age } else { "" }
      public_ciudad_sector = $location
      public_resumen = ($summaryParts -join " ")
      photo_url = if ($person.photo_url) { [string]$person.photo_url } else { "" }
      source_url = $caseUrl
      source_label = "Buscar Desaparecidos"
      source_type = "Fuente autorizada"
      source_authorized = $true
      updated_at = if ($person.updated_at) { [string]$person.updated_at } else { (Get-Date).ToString("o") }
    })
  }
}

$payload = [ordered]@{
  source = "Buscar Desaparecidos"
  source_url = "https://buscardesaparecidos.com/buscar"
  authorization_note = "Lote publicado bajo autorizacion informada por la coordinacion del proyecto. Datos privados de reportantes fueron excluidos."
  generated_at = (Get-Date).ToString("o")
  pages_imported = $Pages
  count = $cases.Count
  source_stats = $stats
  cases = $cases
}

$resolvedOutput = Join-Path (Get-Location) $OutputPath
$outputDir = Split-Path $resolvedOutput -Parent
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
$jsonOut = $payload | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($resolvedOutput, $jsonOut, $utf8NoBom)

Write-Output "Generated $($cases.Count) authorized public cases at $OutputPath"
