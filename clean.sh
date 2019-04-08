#!/usr/bin/env bash

find src | grep .d.ts | xargs rm
find src | grep .js | xargs rm