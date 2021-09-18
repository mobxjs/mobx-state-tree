module.exports = {
    inputFiles: ["src/index.ts"],
    module: "commonjs",
    excludeNotExported: true,
    excludePrivate: true,
    excludeProtected: true,
    mode: "file",
    readme: "none",
    out: "../../docs/API",
    theme: "docusaurus",
    tsconfig: "tsconfig.json",
    listInvalidSymbolLinks: true
    // mdHideSources: true
}
