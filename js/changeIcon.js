
console.log("JustDeleteMe v2 extension loaded.");

/**
 * Set the icon.
 * 
 * @param icon {"easy" | "medium" | "hard" | "impossible"}
 * @returns {void}
 */
function setIcon(icon) {
    browser.browserAction.setIcon({
        path: `res/icons/${icon}.png`,
    });
}

console.log(`test`);

async function getSites() {
    const _path = "jdm/_data/sites.json";
    const _res = await fetch(_path, {mode:'same-origin'});
    const _blob = await _res.blob();
    const _reader = new FileReader();
    
    _reader.addEventListener("loadend", () => {
        console.log(`result: ${this.result}`);
    });
    
    _reader.readAsText(_blob);
    
    return JSON.parse(_reader.result);
}

getSites().then(sites => {
    console.log(sites);
});
