function toggleItem(item) {
    var table = document.getElementById("TableGroup");
    var i;

    if (table) {
        var height = 0;

        var titles = table.getElementsByTagName('li');
        for (i = 0; i < titles.length; i++) {
            if (titles[i].id == item + "Title") {
                titles[i].style.background = "#FFFFFF";
                titles[i].style.color = "#000000";
            } else {

                titles[i].style.background = "#DDDDDD";
                titles[i].style.color = "#666666";
            }
        }

        var tabs = table.getElementsByClassName('ItemBody');
        if (tabs.length > 0) {
            height = toggleItemDetails(tabs, item);
        }

        /* table.style.height = height + aparent.clientHeight + table.clientHeight + "px";*/
    }
}
function toggleItemDetails(tabs, title) {
    var i,
    height = 0;

    for (i = 0; i < tabs.length; i++) {
        var tab = tabs[i];

        if (tab.id == title + "Table") {
            tab.style.display = "block";
            height = tab.clientHeight;
        } else
            tab.style.display = "none";
    }

    return height;
}

function bulkshow(showpage) {
    var pagesData = document.getElementsByClassName("PageBody");

    var i = 0;
    if (showpage !== undefined) {
        var blockdiv;
        for (i = 0; i < pagesData.length; i++) {
            var id = pagesData[i].attributes["id"].value;

            if (showpage == id) {
                blockdiv = document.getElementById(id);
                blockdiv.style.display = 'block';

                var divs = blockdiv.getElementsByClassName("ObjectDetailsNotes");
                for (var j = 0; j < divs.length; j++) {
                    var tmpStr = divs[j].innerHTML;
                    tmpStr = tmpStr.replace(/&gt;/g, ">");
                    tmpStr = tmpStr.replace(/&lt;/g, "<");

                    tmpStr = tmpStr.replace(/#gt;/g, "&gt;");
                    tmpStr = tmpStr.replace(/#lt;/g, "&lt;");

                    divs[j].innerHTML = tmpStr;
                }
            } else {
                document.getElementById(id).style.display = 'none';
            }
        }

        if (blockdiv !== undefined) {
            tableSel = null;
            var tab = blockdiv.getElementsByClassName('TableGroup');
            if (tab.length > 0) {
                toggleItem(tab[0].getElementsByTagName('li')[0].id.replace("Title", ""), tab[0].getElementsByTagName('li')[0]);
            }
        }
    }
}
// START - TOOLTIP CODE
let tooltipTimeout;

function mapRectangleMouseOver(sender) {
    clearTimeout(tooltipTimeout);
    const tooltip = $(".previewPanel");
    tooltip.stop(true, true).css({ opacity: 0, visibility: "hidden" }).hide();

    if (!sender || !sender.href || !sender.coords) return;
    const informationURL = sender.href;

    jQuery.get(informationURL, function (data) {
        const loadedHTML = jQuery.parseHTML(data);
        const docDOM = $('<output>').append(loadedHTML);
        const bodyDOM = $('.ElementPage', docDOM);
        if (!bodyDOM.length) return;

        const itemNotes = $('.ObjectDetailsNotes', bodyDOM);
        const taggedValues = $('#TaggedValTable', bodyDOM);
        if (!itemNotes.length && !taggedValues.length) return;

        const notes = unescapeHtml(itemNotes.html() || "");
        if (notes === "" && !taggedValues.html()) return;

        // Vul tooltip content
        tooltip.html(notes + taggedValues.html())
               .css({
                   display: "block",
                   top: 0,
                   left: 0,
                   opacity: 0,
                   visibility: "hidden"
               });

        // Delay + fade-in
        tooltipTimeout = setTimeout(function () {

            // Bereken positie op basis van coords van <area> + offset van diagram
            const diagramOffset = $(".diagramContainer").offset(); // container van de image map
            const coords = sender.coords.split(','); // x1,y1,x2,y2 van rechthoek
            const x = Number(coords[0]);
            const y = Number(coords[1]);

            let left = diagramOffset.left + x;
            let top = diagramOffset.top + y;

            const offset = 8; // afstand tooltip
            const tooltipWidth = tooltip.outerWidth();
            const tooltipHeight = tooltip.outerHeight();
            const viewportWidth = $(window).width();
            const viewportHeight = $(window).height();

            // Slimme herpositionering
            if (top + tooltipHeight + offset > viewportHeight) {
                top = top - tooltipHeight - offset; // plaats boven
            } else {
                top = top + offset; // plaats onder
            }
            if (left + tooltipWidth > viewportWidth) {
                left = viewportWidth - tooltipWidth - offset;
            }
            if (left < 0) left = offset;

            // Tooltip positioneren en fade-in
            tooltip.css({
                position: "absolute",
                top: top + window.scrollY + "px",
                left: left + window.scrollX + "px",
                visibility: "visible",
                opacity: 0
            }).animate({ opacity: 1 }, 200);

        }, 250); // 250ms delay
    });
}

function mapRectangleMouseOut(sender) {
    clearTimeout(tooltipTimeout);
    $(".previewPanel").stop(true, true).fadeOut(150);
}

function unescapeHtml(safe) {
    return $('<div>').html(safe).text();
}
// EINDE - TOOLTIP CODE