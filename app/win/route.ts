export const dynamic = "force-dynamic"
export const revalidate = 0

const script = String.raw`
$ErrorActionPreference = "Stop"

$repoZipUrl = "https://github.com/mrmatias-of/GLWinTool/archive/refs/heads/main.zip"
$tempRoot = Join-Path $env:TEMP "GLWinTool"
$zipPath = Join-Path $tempRoot "GLWinTool-main.zip"
$extractRoot = Join-Path $tempRoot "repo"
$appRoot = Join-Path $extractRoot "GLWinTool-main"
$scriptPath = Join-Path $appRoot "GLWinTool.ps1"

New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
if (Test-Path -LiteralPath $extractRoot) {
    Remove-Item -LiteralPath $extractRoot -Recurse -Force
}

Invoke-RestMethod -Uri $repoZipUrl -OutFile $zipPath
Expand-Archive -LiteralPath $zipPath -DestinationPath $extractRoot -Force

if (-not (Test-Path -LiteralPath $scriptPath)) {
    throw "GLWinTool.ps1 nao encontrado apos baixar o GL WinTool."
}

powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File $scriptPath
`.trim()

export function GET() {
  return new Response(script, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store, max-age=0",
    },
  })
}
