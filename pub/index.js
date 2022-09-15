
const data_url = "https://raw.githubusercontent.com/jdm-contrib/jdm/master/_data/sites.json";

const subdomains = ['www', 'support', 'mail', 'ssl', 'new', 'cgi1', 'en', 'myaccount', 'meta', 'help', 'support', 'edit'];

(async () => {
    const json = await (await fetch(data_url)).json();
    
    /**
     * Search for the site and return the difficulty
     *
     * @param domain {string}
     * @param query {"difficulty" | "notes"} the query (instead of the "difficulty" parameter).
     * @returns {"easy" | "medium" | "hard" | "impossible" | "limited" | undefined} the difficulty, or undefined if there is none.
     */
    function searchForSite(domain, query = "difficulty") {
        for(const site of json) {
            if(!site.domains) {
                continue;
            }
            
            for(const dm of site.domains) {
                if(domain === dm) {
                    return site[query];
                }
            }
        }
    }
    
    function getHostname(url) {
        
        // Quickly strip any odd subdomains off
        for(let i = 0; i < subdomains.length; i++) {
            url = url.replace('/' + subdomains[i] + '.', '/');
        }
        
        return new URL(url).hostname;
    }
    
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        try {
            let tab = tabs[0];
            if(!tab.url) {
                return;
            }
            
            const base = getHostname(tab.url);
            
            const difficulty = searchForSite(base);
            
            if(!difficulty) {
                document.getElementById("contribute").hidden = false;
                return;
            }
            
            let difficulty_string;
            
            //switch the difficulty to generate a message.
            //this should be easy to translate if you feel up to it.
            switch(difficulty) {
                case "easy":
                    difficulty_string = `It is <b>easy</b> to delete your account for <b>${base}</b>!`;
                    break;
                case "medium":
                    //replace medium with moderately difficult
                    difficulty_string = `It is <b>moderately difficult</b> to delete your account for <b>${base}</b>!`;
                    break;
                case "hard":
                    difficulty_string = `It is <b>hard</b> to delete your account for <b>${base}</b>!`;
                    break;
                case "impossible":
                    difficulty_string = `It is <b>impossible</b> to delete your account for <b>${base}</b>!`;
                    break;
                case "limited":
                    difficulty_string = `There is <b>limited availability</b> in account deletion for <b>${base}</b> (see Notes).`;
                    break;
                default:
                    difficulty_string = `It is <b>${difficulty}</b> to delete your account for <b>${base}</b>!`;
                    break;
            }
            
            document.getElementById("difficulty").innerHTML = difficulty_string;
            
            //if the difficulty is impossible, don't bother trying to show an account deletion link
            if(difficulty !== "impossible") {
                document.getElementById("link").hidden = false;
                document.getElementById("link").href = searchForSite(base, "url");
            }
            
            const notes = searchForSite(base, "notes");
            
            if(notes)
                document.getElementById("message").innerText = `Notes: ${notes}`;
            else
                document.getElementById("message").innerText = `There are no notes for this website.`;
        } catch(e) {
            document.getElementById("e").innerText = e;
        }
    });
})();
