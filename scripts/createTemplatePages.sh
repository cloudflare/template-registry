#!/bin/bash
for f in *; do echo "File is '$f'">> "${f:0:${#f}-4}md"; done
