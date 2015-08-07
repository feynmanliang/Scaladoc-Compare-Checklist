#!/usr/bin/python

import json

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

diffs = []
fileNames = []
state = "FILE"
with open('scaladoc-compare.diff', 'r') as f:
    fName = None
    loc = None
    add = []
    remove = []
    for line in f:
        if state == "FILE":
            if line[0] != "\n":
                fName = line.strip()
                state = "DIFF"
        elif state == "DIFF":
            if is_number(line[0]):
                if loc != None:
                    diffs.append({ "filename": fName, "location": loc, "add": add, "remove": remove })
                loc = line.strip()
                add = []
                remove = []
            elif line[0] == ">":
                add.append(line.strip())
            elif line[0] == "<":
                remove.append(line.strip())
            elif line[0] == "\n":
                fileNames.append({ "filename" : fName })
                state = "FILE"
            else:
                continue

diffs = filter(lambda x: "org/apache/spark/" in x["filename"], diffs)
fileNames = filter(lambda x: "org/apache/spark/" in x["filename"], fileNames)

#print(json.dumps(fileNames))
#print(json.dumps(diffs))
with open('private/data/files.json','w') as f:
    f.write(json.dumps(fileNames, sort_keys=True, indent=4))

with open('private/data/diffs.json','w') as f:
    f.write(json.dumps(diffs, sort_keys=True, indent=4))
