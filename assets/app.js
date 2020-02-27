$.ajaxSetup({ cache: false });

/**
 * Convert stylized size to actual number.
 * @param {string} size Stylized size in form x[KMG], where x is a float.
 */
function sizeUnstyler(size) {
    const unit = size.trim().toUpperCase().slice(-1);
    if (unit === "K") {
        return parseFloat(size) * 1024;
    } else if (unit === "M") {
        return parseFloat(size) * 1048576;
    } else if (unit === "G") {
        return parseFloat(size) * 1073741824;
    } else {
        return parseFloat(size);
    }
}

$.getJSON("websites.json", function (websites) {
    /** Non-standard documentation for @param {Object} websites
    * Metadata for all my websites.
    * Each nested object contains the metadata for the website given by the
    * object's key. They have the following properties:
    * @property {string} name Name which appears on the index
    * @property {boolean} public If website's repository is public
    * @property {string} repo Website's repository in form author/name
    * @property {string} [path] Path to main index file within its repo.
    *  If not given, the main index file is at the root of the repo.
    * @property {string} size Size of resources required to load website.
    * @property {Object} [altIcon] Alternative icon if needed.
    * @property {string} altIcon.src Image URL
    * @property {string} altIcon.alt Image alt text
    */
    $.getJSON("modifiedDates.json", function (modifiedDates) {
        /** Non-standard documentation for @param {Object} modifiedDates
         * The last modified dates for my websites.
         * @property {array} failed List of website names for which a last
         *  modified date could not be found.
         * @property {string} timestamp When the date finder finished
         * @property {Object} websites Website names and their modification date
         */

        // make sure document is ready (although it probably is)
        $(document).ready(function () {
            // clear error message in address element
            $("address").html("");

            // get sort settings
            /** query given in url */
            const params = window.location.search.slice(1).split(";");
            /** if sort order should get reversed */
            const reverseOrder = params[1] ? params[1].split("=")[1] === "D" : false;
            var sortedWebsiteNames;

            // handle sort settings and change links
            // N for Name; M for last Modified; S for Size
            switch (params[0] ? params[0].split("=")[1] : "N") {
                case "M":
                    sortedWebsiteNames = Object.keys(websites).sort(function (a, b) {
                        const dateA = modifiedDates.websites[a];
                        const dateB = modifiedDates.websites[b];

                        if (dateA < dateB) {
                            return -1;
                        } else if (dateA > dateB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    // change appropriate header link to allow descending sort
                    if (reverseOrder) {
                        sortedWebsiteNames.reverse();
                    } else {
                        $(".indexhead .indexcollastmod a").prop("href", "?C=M;O=D");
                    }
                    break;
                case "S":
                    sortedWebsiteNames = Object.keys(websites).sort(function (a, b) {
                        const sizeA = sizeUnstyler(websites[a].size);
                        const sizeB = sizeUnstyler(websites[b].size);

                        if (sizeA < sizeB) {
                            return -1;
                        } else if (sizeA > sizeB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    if (reverseOrder) {
                        sortedWebsiteNames.reverse();
                    } else {
                        $(".indexhead .indexcolsize a").prop("href", "?C=S;O=D");
                    }
                    break;
                case "N":
                default:
                    sortedWebsiteNames = Object.keys(websites).sort();
                    if (reverseOrder) {
                        sortedWebsiteNames.reverse();
                    } else {
                        $(".indexhead .indexcolname a").prop("href", "?C=N;O=D");
                    }
                    break;
            }
            // reverse sort order if needed
            // A for Ascending; D for Descending
            if (params[1] === "D") {
                sortedWebsiteNames.reverse();
            }

            // build the table
            for (let i = 0; i < sortedWebsiteNames.length; i++) {
                const websiteName = sortedWebsiteNames[i];
                const website = websites[websiteName];
                // the only reason why i'm not using for of
                const parity = i % 2 ? "odd" : "even";

                // build link
                var link = "../";
                // if it's not in schobbish.github.io, add the repo name
                link += website.repo === "Schobbish/schobbish.github.io" ? ""
                    : website.repo.split("/")[1] + "/";
                link += website.path ? website.path : "";

                // set icon
                const icon = website.altIcon ? website.altIcon : {
                    src: "assets/text.gif",
                    alt: "[TXT]"
                };

                // index last modify date needs to be corrected
                const lastModifiedDate = websiteName === "index" ? modifiedDates.timestamp
                    : (modifiedDates.websites[websiteName] ? modifiedDates.websites[websiteName]
                        : "\xa0");
                const size = website.size ? website.size : "  - ";
                const description = website.description ? website.description : "\xa0";

                // append to table
                $(".indexbreakrow:last").before(`
<tr class="${parity}" id="${websiteName}">
    <td class="indexcolicon"><img src="${icon.src}" alt="${icon.alt}"></td>
    <td class="indexcolname"><a href="${link}">${website.name}</a></td>
    <td class="indexcollastmod">${lastModifiedDate}</td>
    <td class="indexcolsize">${size}</td>
    <td class="indexcoldesc">${description}</td>
</tr>`);
            }

            // build disclaimer
            var address = "Some server at schobbish.com. ";
            address += "Modification dates are updated automatically every Sunday morning at 03:14 UTC. ";
            address += "They were last updated at " + modifiedDates.timestamp + ". ";
            address += "Sizes do not get automatically updated. ";
            $("address").html(address);
        });
    }).fail(function () {
        console.error("uh oh error getting modifiedDates.json");
    });
}).fail(function () {
    console.error("uh oh error getting websites.json");
});


