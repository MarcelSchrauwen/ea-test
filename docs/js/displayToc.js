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
function mapRectangleMouseOver(sender) {

    $(".previewPanel").css("display", "none");

    if (!sender || !sender.href) return;

    var informationURL = sender.href;
    if (!informationURL) return;

    jQuery.get(informationURL, function (data) {

        var loadedHTML = jQuery.parseHTML(data);
        var docDOM = $('<output>').append(loadedHTML);
        var bodyDOM = $('.ElementPage', docDOM);

        if (!bodyDOM.length) return;

        var itemNotes = $('.ObjectDetailsNotes', bodyDOM);

        if (!itemNotes.length) return;

        var notes = unescapeHtml(itemNotes.html() || "");
        if (notes === "") return;

        var array = sender.coords.split(',');

        $(".previewPanel").html("");
        $(".previewPanel").append(notes);

        var tooltip = $(".previewPanel");
        tooltip.css("display", "block");

        var tooltipWidth = tooltip.outerWidth();
        var tooltipHeight = tooltip.outerHeight();

        // Bereken positie: rechterzijde van tooltip gelijk met rechterzijde object
        // array[2] = rechterzijde van het object
        var left = Number(array[2]) - tooltipWidth;

        // Onderzijde van tooltip 5px boven bovenzijde object
        // array[1] = bovenzijde van het object
        var top = Number(array[1]) - tooltipHeight - 5;

        // zorg dat tooltip niet buiten venster valt
        if (left < 0) left = 5;
        if (top < 0) top = 5;

        tooltip.css("margin-top", top + "px");
        tooltip.css("margin-left", left + "px");

    });

}

function mapRectangleMouseOut(sender) {
    if ($(".previewPanel:hover").length === 0) {
        $(".previewPanel").css("display", "none");
    }
}

function unescapeHtml(safe) {
    return $('<div>').html(safe).text();
}
// EINDE - TOOLTIP CODE
