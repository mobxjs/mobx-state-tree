#!/bin/bash
export NODE_ENV=development
export MST_TESTING=1
find . -wholename './__tests__/*.test.ts' -print0 | xargs -0 bun test
