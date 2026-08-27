@echo off
setlocal
cd /d "%~dp0"
title Update Dengue Dashboard

echo ============================================================
echo  Dengue Dashboard - update everything
echo ============================================================
echo.
echo  Step 1 of 2: your national data, from the Excel file
echo  Step 2 of 2: WHO global data, downloaded from the internet
echo.
echo  Step 2 is optional. If you are offline it will be skipped
echo  and your national update is still saved.
echo.

REM Find a Python that actually RUNS, not merely one that appears on the PATH.
REM Windows ships a stub at python.exe that only opens the Microsoft Store, and "where python"
REM finds it happily - so checking the PATH reports success and the script then dies. Try the
REM official py launcher first, then plain python, and in both cases prove it by executing it.
echo Checking for Python...
set "PYCMD="

py -3 -c "import sys" >nul 2>nul
if not errorlevel 1 set "PYCMD=py -3"
if defined PYCMD goto :have_python

python -c "import sys" >nul 2>nul
if not errorlevel 1 set "PYCMD=python"
if defined PYCMD goto :have_python

echo.
echo ERROR: No working Python was found on this computer.
echo.
echo   If Windows just offered you the Microsoft Store, that is the
echo   placeholder, not a real install. Get Python from https://python.org
echo   and tick "Add Python to PATH" during setup.
echo.
pause
exit /b 1

:have_python
echo Using: %PYCMD%

echo Checking for openpyxl...
%PYCMD% -c "import openpyxl" >nul 2>nul
if errorlevel 1 (
    echo Installing openpyxl, one time only...
    %PYCMD% -m pip install openpyxl
)

echo.
echo ------------------------------------------------------------
echo  STEP 1 of 2  -  National data from Dengue_Master_Data_Entry.xlsx
echo ------------------------------------------------------------
%PYCMD% update_data.py --no-pause
if errorlevel 1 (
    echo.
    echo ============================================================
    echo  STOPPED - the national update failed. See the error above.
    echo  Nothing was uploaded. Fix the problem and run this again.
    echo ============================================================
    echo.
    pause
    exit /b 1
)
set NATIONAL_OK=1

echo.
echo ------------------------------------------------------------
echo  STEP 2 of 2  -  WHO global data from the internet
echo ------------------------------------------------------------
%PYCMD% update_world_data.py --no-pause
set WORLD_CODE=%errorlevel%

echo.
echo ============================================================
if "%WORLD_CODE%"=="0" (
    echo  DONE - both updates finished.
    echo.
    echo  Upload these to GitHub, replacing the old ones:
    echo      Data\dengue-data.json
    echo      Data\who-dengue-global.json
    echo      Data\who-dengue-global.csv    ^(optional^)
) else if "%WORLD_CODE%"=="2" (
    echo  DONE - but only partly.
    echo.
    echo  Your NATIONAL data updated successfully and is saved.
    echo  The WHO download was skipped - no internet, or WHO is down.
    echo  That is not a problem: the global tab will keep showing the
    echo  figures from the last successful download.
    echo.
    echo  Upload this to GitHub, replacing the old one:
    echo      Data\dengue-data.json
    echo.
    echo  Run this again later if you want the WHO data refreshed too.
) else (
    echo  DONE - but the WHO step reported an error above.
    echo.
    echo  Your NATIONAL data updated successfully and is saved.
    echo  Upload this to GitHub, replacing the old one:
    echo      Data\dengue-data.json
)
echo.
echo  GitHub Pages redeploys about a minute after you commit.
echo  You do NOT need to re-upload index.html for a data update.
echo ============================================================
echo.
pause
