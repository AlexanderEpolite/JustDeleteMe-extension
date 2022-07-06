
const data_url = "https://raw.githubusercontent.com/jdm-contrib/jdm/master/_data/sites.json";

//taken from https://github.com/jdm-contrib/justdelete.me-firefox-addon/blob/master/lib/main.js
const subdomains = ['www', 'support', 'mail', 'ssl', 'new', 'cgi1', 'en', 'myaccount', 'meta', 'help', 'support', 'edit'];

(async () => {
    console.log(`Started background server.`);
    
    //fetch the data
    const json = await (await fetch(data_url)).json();
    
    /**
     * Set the icon.
     *
     * @param icon {"easy" | "medium" | "hard" | "impossible" | "unknown"}
     * @param windowId {number} the current ID of the window.
     * @returns {void}
     */
    function setIcon(icon, windowId) {
        
        //keep the default icon if the site isn't listed.
        if(icon === "unknown") {
            browser.browserAction.setIcon({
                path: {
                    128: "res/ext_icon_144.png",
                },
            });
            return;
        }
        
        browser.browserAction.setIcon({
            path: {
                128: `res/icons/${icon}.png`,
            },
        });
    }
    
    /**
     * Get the hostname from a URL.
     * 
     * Parodied from https://github.com/jdm-contrib/justdelete.me-firefox-addon/blob/master/lib/main.js
     * 
     * @param url {string} the URL.
     * @returns {string} the hostname.
     */
    function getHostname(url) {
        
        // Quickly strip any odd subdomains off
        for(let i = 0; i < subdomains.length; i++) {
            url = url.replace('/' + subdomains[i] + '.', '/');
        }
        
        return new URL(url).hostname;
    }
    
    /**
     * Search for the site and return the difficulty
     * 
     * @param domain {string}
     * @returns {"easy" | "medium" | "hard" | "impossible" | undefined} the difficulty, or undefined if there is none.
     */
    function searchForSite(domain) {
        for(const site of json) {
            if(!site.domains) {
                continue;
            }
            
            for(const dm of site.domains) {
                if(domain === dm) {
                    return site.difficulty;
                }
            }
        }
    }
    
    function onTabChange() {
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
            let tab = tabs[0];
            if(!tab.url) {
                //there will not be a url on special tabs (such as about:*, addons.mozilla.org, and the new tab page).
                return setIcon("unknown", tab.windowId);
            }
            let hostname = getHostname(tab.url);
            setIcon(searchForSite(hostname) || "unknown", tab.windowId);
        });
    }
    
    browser.tabs.onActivated.addListener(() => {
        onTabChange();
    });
    
    //this definitely makes my top 10 for hacky things
    //please submit a pr if you know an event hook which
    //triggers when someone types in a new tab
    setInterval(() => {
        onTabChange();
    }, 100);
})();
