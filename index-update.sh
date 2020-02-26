#!/bin/bash
# pass Personal Access Token as first arg to the script please
# do NOT store personal access token in this repo.
# this script is quiet - only prints if there are errors
# this script will automatically commit all and push to the server;
# consider running assets/update.py when that's not needed
cd "$(dirname "$0")"

git pull
python3 assets/update.py 8809b90f213a76269865d00c8379377f5a356a37
git add .
git commit -m "bot commit $(date)"
git push
