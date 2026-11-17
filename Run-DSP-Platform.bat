@echo off
title DSP Learning Platform
echo Starting DSP Learning Platform...
if exist "release\DSP-Platform.exe" (
    start "" "release\DSP-Platform.exe"
) else (
    echo [ERROR] release\DSP-Platform.exe not found!
    echo Running with npm instead...
    npm run dev
)
