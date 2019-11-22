/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
    title: "MobX-state-tree", // Title for your website.
    tagline:
        "Opinionated, transactional, MobX powered state container combining the best features of the immutable and mutable world for an optimal DX",
    url: "https://mobxjs.github.io/mobx-state-tree", // Your website URL
    baseUrl: "/mobx-state-tree/", // Base URL for your project */
    editUrl: "https://github.com/mobxjs/mobx-state-tree/edit/master/docs/",
    noIndex: true,
    // For github.io type URLs, you would set the url and baseUrl like:
    //   url: 'https://facebook.github.io',
    //   baseUrl: '/test-site/',

    // Used for publishing and more
    projectName: "mobx-state-tree",
    organizationName: "mobxjs",
    // gaTrackingId: "UA-65632006-3",
    // For top-level user or org sites, the organization is still the same.
    // e.g., for the https://JoelMarcey.github.io site, it would be set like...
    //   organizationName: 'JoelMarcey'

    // For no header links in the top nav bar -> headerLinks: [],
    headerLinks: [
        {
            doc: "intro/getting-started",
            label: "docs"
        },
        { href: "https://github.com/mobxjs/mobx-state-tree", label: "GitHub" }
        // {doc: "support", label: "Support mobx-state-tree"}
    ],

    /* path to images for header/footer */
    headerIcon: "img/favicon.ico",
    footerIcon: "img/favicon.ico",
    favicon: "img/favicon.ico",

    /* Colors for website */
    colors: {
        primaryColor: "#000",
        secondaryColor: "#22e7c3"
    },

    /* Custom fonts for website */
    /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

    // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
    copyright: `Copyright © ${new Date().getFullYear()} Michel Weststrate`,

    highlight: {
        // Highlight.js theme to use for syntax highlighting in code blocks.
        theme: "dracula"
    },

    // Add custom scripts here that would be placed in <script> tags.
    scripts: [
        "https://buttons.github.io/buttons.js"
        // "https://codefund.io/properties/439/funder.js" TODO:
    ],

    // On page navigation for the current documentation page.
    onPageNav: "separate",
    // No .html extensions for paths.
    cleanUrl: true,

    // Open Graph and Twitter card images.
    // ogImage: "img/undraw_online.svg",
    // twitterImage: "img/undraw_tweetstorm.svg"

    // For sites with a sizable amount of content, set collapsible to true.
    // Expand/collapse the links and subcategories under categories.
    docsSideNavCollapsible: true

    // Show documentation's last contributor's name.
    // enableUpdateBy: true,

    // Show documentation's last update time.
    // enableUpdateTime: true,

    // You may provide arbitrary config keys to be used as needed by your
    // template. For example, if you need your repo's URL...
    //   repoUrl: 'https://github.com/facebook/test-site',
}

module.exports = siteConfig
