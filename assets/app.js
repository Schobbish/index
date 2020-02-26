$.ajaxSetup({ cache: false });

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
    * @property {Object} altIcon Alternative icon if needed.
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

            const sortedWebsiteNames = Object.keys(websites).sort();
            for (let i = 0; i < sortedWebsiteNames.length; i++) {
                const websiteName = sortedWebsiteNames[i];
                const website = websites[websiteName];
                // the only reason why i'm not using for of
                const parity = i % 2 ? "odd" : "even";

                // build link
                var link = "../";
                // if it's not in schobbish.github.io, add the repo name
                link += website.repo === "Schobbish/schobbish.github.io" ? "" :
                    website.repo.split("/")[1] + "/";
                link += website.path ? website.path : "";

                // set icon
                const icon = website.altIcon ? website.altIcon : {
                    src: "assets/text.gif",
                    alt: "[TXT]"
                };

                // index last modify date needs to be corrected
                const lastModifiedDate = websiteName === "index" ?
                    modifiedDates.timestamp :
                    (modifiedDates.websites[websiteName] ?
                        modifiedDates.websites[websiteName] :
                        "Error getting modification date.");

                // append to table
                $("tbody:first").append(`
<tr class="${parity}" id="${websiteName}">
    <td class="indexcolicon"><img src="${icon.src}" alt="${icon.alt}"></td>
    <td class="indexcolname"><a href="${link}">${website.name}</a></td>
    <td class="indexcollastmod">${lastModifiedDate}</td>
    <td class="indexcolsize">${website.size}</td>
</tr>`);
            }
            // append hr
            $("tbody:first").append(`<tr class="indexbreakrow">
    <th colspan="4">
        <hr>
    </th>
</tr>`);
            // build disclaimer
            var address = "Some server at schobbish.com";
            address += "\nModification dates last updated automatically " +
                modifiedDates.timestamp;
            address += "\nSizes do not get automatically updated. "
            address += " Last size update: 2020-02-25T07:53:00Z"
        });
    }).fail(function () {
        console.error("uh oh error getting modifiedDates.json");
    });
}).fail(function () {
    console.error("uh oh error getting websites.json");
});


