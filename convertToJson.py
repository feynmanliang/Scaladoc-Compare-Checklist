#!/usr/bin/python

import json

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

res = []
state = "FILE"
with open('scaladoc-compare.diff', 'r') as f:
    fName = None
    diffs = []
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
                    diffs.append({ "location": loc, "add": add, "remove": remove })
                loc = line.strip()
                add = []
                remove = []
            elif line[0] == ">":
                add.append(line.strip())
            elif line[0] == "<":
                remove.append(line.strip())
            elif line[0] == "\n":
                res.append({ "fileName": fName, "diffs": diffs })
                diffs = []
                state = "FILE"
            else:
                continue

print(json.dumps(res))

