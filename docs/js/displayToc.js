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
        var taggedValues = $('#TaggedValTable', bodyDOM);

        if (!itemNotes.length && !taggedValues.length) return;

        var notes = unescapeHtml(itemNotes.html() || "");
        if (notes === "" && !taggedValues.html()) return;

        $(".previewPanel").html("");
        $(".previewPanel").append(notes);
        $(".previewPanel").append(taggedValues.html());
        $(".previewPanel").css("display", "block");

        // tooltip-afmetingen
        var tooltipWidth = $(".previewPanel").outerWidth();
        var tooltipHeight = $(".previewPanel").outerHeight();

        // coords van <area>
        var array = sender.coords.split(',');
        var x1 = Number(array[0]);
        var y1 = Number(array[1]);
        var x2 = Number(array[2]);
        var y2 = Number(array[3]);

        // afbeelding waarop <map> zit
        var mapName = sender.parentNode.name;
        var imageElem = $('img[usemap="#' + mapName + '"]');

        if (imageElem.length === 0) return;

        var imgOffset = imageElem.offset();

        // horizontaal midden van area
        var rectCenterX = imgOffset.left + (x1 + x2) / 2;

        // verticaal net boven area
        var rectTopY = imgOffset.top + y1;

        // tooltip links en boven positie
        var left = rectCenterX - (tooltipWidth / 2);
        var top  = rectTopY - tooltipHeight - 2; // 2px marge boven

        $(".previewPanel").css({
            "margin-left": left + "px",
            "margin-top": top + "px"
        });

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
