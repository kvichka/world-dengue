#!/bin/bash
cd "$(dirname "$0")"

echo "============================================================"
echo " Dengue Dashboard - update everything"
echo "============================================================"
echo
echo " Step 1 of 2: your national data, from the Excel file"
echo " Step 2 of 2: WHO global data, downloaded from the internet"
echo
echo " Step 2 is optional. If you are offline it will be skipped"
echo " and your national update is still saved."
echo

echo "Checking for Python..."
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "ERROR: Python 3 was not found on this computer."
    echo "Install it from https://python.org and try again."
    read -p "Press Enter to close..."
    exit 1
fi

echo "Checking for openpyxl..."
python3 -c "import openpyxl" &> /dev/null || {
    echo "Installing openpyxl, one time only..."
    python3 -m pip install openpyxl
}

echo
echo "------------------------------------------------------------"
echo " STEP 1 of 2  -  National data from Dengue_Master_Data_Entry.xlsx"
echo "------------------------------------------------------------"
if ! python3 update_data.py --no-pause; then
    echo
    echo "============================================================"
    echo " STOPPED - the national update failed. See the error above."
    echo " Nothing was uploaded. Fix the problem and run this again."
    echo "============================================================"
    echo
    read -p "Press Enter to close..."
    exit 1
fi

echo
echo "------------------------------------------------------------"
echo " STEP 2 of 2  -  WHO global data from the internet"
echo "------------------------------------------------------------"
python3 update_world_data.py --no-pause
WORLD_CODE=$?

echo
echo "============================================================"
if [ "$WORLD_CODE" -eq 0 ]; then
    echo " DONE - both updates finished."
    echo
    echo " Upload these to GitHub, replacing the old ones:"
    echo "     Data/dengue-data.json"
    echo "     Data/who-dengue-global.json"
    echo "     Data/who-dengue-global.csv    (optional)"
elif [ "$WORLD_CODE" -eq 2 ]; then
    echo " DONE - but only partly."
    echo
    echo " Your NATIONAL data updated successfully and is saved."
    echo " The WHO download was skipped - no internet, or WHO is down."
    echo " That is not a problem: the global tab will keep showing the"
    echo " figures from the last successful download."
    echo
    echo " Upload this to GitHub, replacing the old one:"
    echo "     Data/dengue-data.json"
    echo
    echo " Run this again later if you want the WHO data refreshed too."
else
    echo " DONE - but the WHO step reported an error above."
    echo
    echo " Your NATIONAL data updated successfully and is saved."
    echo " Upload this to GitHub, replacing the old one:"
    echo "     Data/dengue-data.json"
fi
echo
echo " GitHub Pages redeploys about a minute after you commit."
echo " You do NOT need to re-upload index.html for a data update."
echo "============================================================"
echo
read -p "Press Enter to close..."
