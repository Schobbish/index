$.ajaxSetup({ cache: false });
var globalWebsites;
$.getJSON("assets/websites.json", function (data) {
    /**
     * Metadata for all mt websites.
     * Each nested object contains the metadata for the website given by the
     * object's key. They have the following properties:
     * @property {string} name Name which appears on the index
     * @property {boolean} public If website's repository is public
     * @property {string} repo Website's repository repo, in form author/name
     * @property {string} [path] Path to main index file within its repo.
     *  If not given, the main index file is at the root of the repo.
     * @property {string} getCommitsSince ISO 8601 date string
     *  Don't get commits before this date; helps with bandwith or something.
     * @property {string} size Size of resources required to load website.
     */
    const websites = data;
    globalWebsites = websites;

    // make sure document is ready (although it probably is)
    $(document).ready(function () {
        // clear error message in address element
        $("address").html("");

        const sortedWebsiteNames = Object.keys(websites).sort();

        for (const websiteName of sortedWebsiteNames) {
            const website = websites[websiteName];

            // can only do this if the repository is public
            if (website.public) {
                var apiurl = `https://api.github.com/repos/${website.repo}/commits?`;
                apiurl += website.getCommitsSince ? `&since=${website.getCommitsSince}` : "";
                apiurl += website.path ? `&path=${website.path}` : "";

                // get the json
                $.getJSON(apiurl, function (ghdata) {
                    if (ghdata.message) {
                        console.error(`API URL bad for ${websiteName}: ${ghdata.message}`);
                    } else {
                        console.log(websiteName, website.getCommitsSince, ghdata[0].commit.author.date)
                    }
                }).fail(function() {
                    console.error(`Failed getting JSON from GitHub for ${websiteName}`)
                });
            } else {

            }
        }
    });
}).fail(function () {
    console.error("uh oh error getting websites.json");
});


