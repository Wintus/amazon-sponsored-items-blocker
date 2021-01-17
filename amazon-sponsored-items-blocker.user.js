// ==UserScript==
// @name         Amazon sponsored items blocker
// @namespace    https://github.com/Wintus/amazon-sponsored-items-blocker
// @version      0.2.1
// @description  Blocks sponsored search results on Amazon
// @include      *://www.amazon.*/*
// @include      *://www.amazon.co.*/*
// @grant        none
// @run-at document-end
// ==/UserScript==

// using: ES2015

const label = 'amazon-sponsored-items-blocker';
const mainId = 'search';
const listClass = 's-main-slot';
const adClass = 'AdHolder'; // direct child of the above

/**
 * @param {Node} node
 * @return {boolean} node is HTMLElement
 */
const isAd = (node) =>
    node instanceof HTMLElement &&
    node.classList.contains(adClass);

/**
 * @param {Node[]} nodes
 */
const removeSponsoredAds = nodes => {
    /**
     * @type {HTMLElement[]}
     */
    const ads = nodes.filter(isAd);
    console.debug(`${label}: ads`, ads);

    for (const ad of ads) {
        ad.remove();
    }
    console.log(`${label}: ${ads.length} ads removed!`);
};

const observer = new MutationObserver(mutations => {
    const nodes = mutations.flatMap(({target: {childNodes}, addedNodes}) => [...childNodes, ...addedNodes]);
    removeSponsoredAds(nodes);
});

/**
 * @type {Element | null}
 */
const main = document.getElementById(mainId).getElementsByClassName(listClass).item(0);
if (main) {
    // initial
    removeSponsoredAds(Array.from(main.children));
    // changes
    observer.observe(main, {
        childList: true,
    });
} else {
    console.error(`${label}: no target`);
}

console.log(`${label}: loaded`);
