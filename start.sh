#!/bin/bash
# This script is used by Render to serve static files
echo "Starting static file server..."
python3 -m http.server $PORT
