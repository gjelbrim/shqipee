#!/bin/bash

GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD) #current branch
GIT_COMMIT_HASH=$(git rev-parse HEAD | cut -c 1-7) #current commit hash

echo "{\"branch\": \"$GIT_BRANCH\", \"commit\": \"$GIT_COMMIT_HASH\"}" > ./public/version.json