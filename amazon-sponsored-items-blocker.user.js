// ==UserScript==
// @name         Amazon sponsored items blocker
// @namespace    https://github.com/Wintus/amazon-sponsored-items-blocker
// @version      0.2.2
// @description  Blocks sponsored search results on Amazon
// @include      *://www.amazon.*/*
// @include      *://www.amazon.co.*/*
// @grant        none
// @run-at document-end
// ==/UserScript==

// using: ES2015
// using: DOM4

const label = "amazon-sponsored-items-blocker";
const mainId = "search";
const listClass = "s-main-slot";
const adClass = "AdHolder"; // direct child of the above
const wideClass = "s-widget" // direct child of listClass
const dataComponentType = "s-ads-metrics" // direct child of listClass

console.log(`${label}: started`);

/**
 * @param {Node} node
 * @return {boolean} node is HTMLElement
 */
const isAd = (node) =>
  node instanceof HTMLElement && node.classList.contains(adClass);

/**
 * @param {Node[]} nodes
 * @param {function(Node|Element): boolean} pred
 */
const removeSponsoredAds = (nodes, pred) => {
  const ads = nodes.filter(pred);
  console.debug(`${label}: ads`, ads);

  for (const ad of ads) {
    ad.remove();
  }
  console.log(`${label}: ${ads.length} ads removed!`);
};

const observer = new MutationObserver((mutations) => {
  const nodes = mutations.flatMap(({ addedNodes }) => [...addedNodes]);
  removeSponsoredAds(nodes, isAd);
});

/**
 * @type {Element | null}
 */
const main = document
  .getElementById(mainId)
  .getElementsByClassName(listClass)
  .item(0);
if (main) {
  // initial
  const elements = Array.from(main.getElementsByClassName(wideClass));
  const predicate = ({ dataset, firstElementChild: elem }) =>
    dataset.index === '0' || (
      elem instanceof HTMLElement &&
      elem.dataset.componentType === dataComponentType
    );
  removeSponsoredAds(elements, predicate);
  removeSponsoredAds(Array.from(main.children), isAd);
  // changes
  observer.observe(main, {
    childList: true,
  });
} else {
  console.error(`${label}: no target`);
}

console.log(`${label}: loaded`);
