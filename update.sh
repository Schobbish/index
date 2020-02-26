#!/bin/bash
# pass Personal Access Token as first arg to the script please
# do NOT store personal access token in this repo.
# this script is quiet - only prints if there are errors
# this script will automatically pull, commit all, and push to remote;
# consider running update.py instead if that's not needed or wanted.
cd "$(dirname "$0")"

git pull -q
python3 update.py 8809b90f213a76269865d00c8379377f5a356a37
git add .
git commit -qm "bot commit $(date)"
git push -q
