module.exports = {
    src: ["src/index.ts"],
    module: "commonjs",
    excludeNotExported: true,
    excludePrivate: true,
    excludeProtected: true,
    mode: "file",
    readme: "none",
    out: "./docs/API",
    theme: "docusaurus",
    tsconfig: "tsconfig.json",
    listInvalidSymbolLinks: true,
    mdHideSources: true
    // Note: TypeDoc uses the current git remote (e.g. your fork) for "Defined in" source links.
    // After generation, scripts/fix-docs-source-links.js rewrites them to https://github.com/mobxjs/mobx-state-tree/
}
