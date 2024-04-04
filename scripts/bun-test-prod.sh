#!/bin/bash

# Run the command and store the outputs in a temporary file
temp_file=$(mktemp)
NODE_ENV=production find . -wholename './__tests__/*test*' -exec bun test {} \; > "$temp_file" 2>&1

# Check for failures in the outputs
if grep -q "(fail)" "$temp_file"; then
    echo "Production tests failed."
    cat "$temp_file"
    exit 1
else
    echo "All production tests passed."
    exit 0
fi
