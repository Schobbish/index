#!/usr/bin/env python3
# pass Personal Access Token as first arg to the script please
# do NOT store personal access token in this repo.
# this script is quiet - it only prints if there are errors.
# consider running update.py to have changes automatically pushed
import datetime
import json
import sys

import requests

# load website metadata
websites = json.loads(open("websites.json", "r").read())
sortedWebsiteNames = sorted(list(websites.keys()))
modifiedDates = {
    "websites": {},
    "failed": [],
}

for websiteName in sortedWebsiteNames:
    website = websites[websiteName]

    # build url
    apiurl = "https://api.github.com/repos/"
    if "repo" in website:
        apiurl = apiurl + website["repo"] + "/commits"
    else:
        # need repo to get the last modify date!
        print(websiteName + "failed: no repo found in websites.json")
        modifiedDates["failed"].append(websiteName)
        continue
    if "path" in website:
        apiurl = apiurl + "?path=" + website["path"]

    resp = requests.get(apiurl, auth=("Schobbish", sys.argv[1]))
    data = resp.json()

    # try to catch various errors without using try statement
    if resp.status_code != 200:
        # not good!
        print(
            websiteName + " failed: HTTP status code " + str(resp.status_code))
        modifiedDates["failed"].append(websiteName)
        continue
    if type(data) is not list:
        # likely 404 message
        print(websiteName + " failed: not list: " + json.dumps(data))
        modifiedDates["failed"].append(websiteName)
        continue
    if not len(data):
        # data isn't long enough; likely path mistype
        print(websiteName + " failed: empty list recieved")
        modifiedDates["failed"].append(websiteName)
        continue

    # write to modifiedDates
    modifiedDates["websites"][websiteName] = data[0]["commit"]["author"]["date"]

# write timestamp
modifiedDates["timestamp"] = datetime.datetime.utcnow().isoformat(
    timespec="seconds")
# write to file
open("modifiedDates.json", "w").write(
    json.dumps(modifiedDates, sort_keys=True, indent=4))
