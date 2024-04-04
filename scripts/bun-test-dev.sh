#!/bin/bash

# Run the command in development mode and store the outputs in a temporary file
temp_file_dev=$(mktemp)
NODE_ENV=development find . -wholename './__tests__/*test*' -exec bun test {} \; > "$temp_file_dev" 2>&1

# Check for failures in the outputs
if grep -q "(fail)" "$temp_file_dev"; then
    echo "Development tests failed."
    cat "$temp_file_dev"
    exit 1
else
    echo "All tests passed."
    exit 0
fi