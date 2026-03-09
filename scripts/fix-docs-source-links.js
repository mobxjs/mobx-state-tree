/**
 * Rewrites GitHub source links in generated API docs:
 * 1. Point to the canonical mobxjs/mobx-state-tree repo (so forks produce main-repo links).
 * 2. Use the last commit hash that changed each linked file (from git),
 * so links stay valid and minimize the changes upon subsequent doc builds.
 */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const DOCS_API = path.join(__dirname, "..", "docs", "API")
const REPO_ROOT = path.join(__dirname, "..")
const CANONICAL_BASE = "https://github.com/mobxjs/mobx-state-tree/blob"

// Match "Defined in [path:line](https://github.com/owner/mobx-state-tree/blob/hash/path#Lline)"
const LINK_REGEX = /https:\/\/github\.com\/[^/]+\/mobx-state-tree\/blob\/[a-f0-9]+\/([^#]+)#L(\d+)/g

function getAllMdContent(dir) {
    let out = ""
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const ent of entries) {
        const full = path.join(dir, ent.name)
        if (ent.isDirectory()) {
            out += getAllMdContent(full)
        } else if (ent.name.endsWith(".md")) {
            out += fs.readFileSync(full, "utf8")
        }
    }
    return out
}

function getUniqueFilePathsFromLinks(content) {
    const paths = new Set()
    let m
    while ((m = LINK_REGEX.exec(content)) !== null) {
        paths.add(m[1]) // file path (e.g. src/utils.ts)
    }
    return [...paths]
}

function buildFileToHashMap(filePaths) {
    const map = {}
    for (const filePath of filePaths) {
        try {
            const hash = execSync("git log -1 --format=%h -- " + JSON.stringify(filePath), {
                cwd: REPO_ROOT,
                encoding: "utf8"
            }).trim()
            if (hash) map[filePath] = hash
        } catch (_) {
            // file not in git or not found, skip
        }
    }
    return map
}

function fixFile(filePath, fileToHash) {
    let content = fs.readFileSync(filePath, "utf8")
    const fixed = content.replace(LINK_REGEX, (match, pathInRepo, line) => {
        const hash = fileToHash[pathInRepo]
        if (!hash) return match
        return `${CANONICAL_BASE}/${hash}/${pathInRepo}#L${line}`
    })
    if (fixed !== content) {
        fs.writeFileSync(filePath, fixed, "utf8")
    }
}

function walk(dir, fileToHash) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const ent of entries) {
        const full = path.join(dir, ent.name)
        if (ent.isDirectory()) {
            walk(full, fileToHash)
        } else if (ent.name.endsWith(".md")) {
            fixFile(full, fileToHash)
        }
    }
}

if (!fs.existsSync(DOCS_API)) {
    console.warn("fix-docs-source-links: docs/API not found, skipping")
    process.exit(0)
}

const allContent = getAllMdContent(DOCS_API)
const uniquePaths = getUniqueFilePathsFromLinks(allContent)
const fileToHash = buildFileToHashMap(uniquePaths)
walk(DOCS_API, fileToHash)
