/**
 * Get the file in jdm/_data/sites.json
 * 
 * Since this is a browser extension, we can't use the filesystem.
 */
async function getSites() {
    const _path = "../jdm/_data/sites.json";
    const _res = await fetch(_path, {mode:'same-origin'});
    const _blob = await _res.blob();
    const _reader = new FileReader();
    
    _reader.addEventListener("loadend", () => {
        console.log(`result: ${this.result}`);
    });
    
    _reader.readAsText(_blob);
    
    return JSON.parse(_reader.result);
}
