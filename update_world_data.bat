@echo off
cd /d "%~dp0"
REM Find a Python that actually RUNS, not merely one that appears on the PATH. Windows ships a
REM stub at python.exe that only opens the Microsoft Store, and "where python" finds it happily -
REM so a PATH check reports success and the script then dies. Prove it by executing it.
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

%PYCMD% update_world_data.py
