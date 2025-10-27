# PowerShell script to resize coinhome.jpg to multiple sizes

Add-Type -AssemblyName System.Drawing

$inputPath = Resolve-Path ".\assets\images\coinhome.jpg"
$outputDir = Split-Path $inputPath

# Sizes to create
$sizes = @(
    @{Width=768; Height=523; Name="coinhome-768x523.jpg"},
    @{Width=800; Height=545; Name="coinhome-800x545.jpg"},
    @{Width=1024; Height=697; Name="coinhome-1024x697.jpg"}
)

# Load original image
$originalImg = [System.Drawing.Image]::FromFile($inputPath)
Write-Host "Original size: $($originalImg.Width)x$($originalImg.Height) px`n" -ForegroundColor Cyan

foreach ($size in $sizes) {
    $outputPath = Join-Path $outputDir $size.Name
    
    # Create resized bitmap
    $resized = New-Object System.Drawing.Bitmap($size.Width, $size.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($resized)
    
    # High quality settings
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Draw resized image
    $graphics.DrawImage($originalImg, 0, 0, $size.Width, $size.Height)
    
    # Save as PNG first to avoid GDI+ errors
    $tempPng = $outputPath -replace '\.jpg$', '.png'
    $resized.Save($tempPng, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Convert to JPEG
    $pngImg = [System.Drawing.Image]::FromFile($tempPng)
    $jpgBitmap = New-Object System.Drawing.Bitmap($pngImg)
    $jpgBitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    # Cleanup
    $graphics.Dispose()
    $resized.Dispose()
    $pngImg.Dispose()
    $jpgBitmap.Dispose()
    Remove-Item $tempPng -Force
    
    $fileSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
    Write-Host "  ✓ Created: $($size.Name) ($fileSize KB)" -ForegroundColor Green
}

# Cleanup original
$originalImg.Dispose()

Write-Host "`n✅ All resize operations completed!" -ForegroundColor Green

