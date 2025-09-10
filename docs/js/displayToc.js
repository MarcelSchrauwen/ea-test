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
/
}

function mapRectangleMouseOut(sender) {
    if ($(".previewPanel:hover").length === 0) {
        $(".previewPanel").css("display", "none");
    }
}

function unescapeHtml(safe) {
    return $('<div>').html(safe).text();
}
// START - TOOLTIP CODE
function mapRectangleMouseOver(sender) {
    $(".previewPanel").hide();

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

        var array = sender.coords.split(',').map(function (v) { return Number(v); });

        var $tooltip = $(".previewPanel");
        $tooltip.html("").append(notes).append(taggedValues.html());

        // Maak tooltip meetbaar zonder te flashen
        $tooltip.css({
            display: "block",
            visibility: "hidden",
            top: 0,
            left: 0,
            margin: 0
        });

        // Zoek de img die bij de map hoort (als die bestaat) en bepaal offset
        var mapName = (sender.parentElement && sender.parentElement.name) ? sender.parentElement.name : null;
        var $img = mapName ? $('img[usemap="#' + mapName + '"]').first() : $();
        var imgOffset = $img.length ? $img.offset() : { left: 0, top: 0 };

        // Coördinaten van het gebied in document-ruimte
        var x1 = imgOffset.left + (array[0] || 0); // linkerkant van gebied
        var y1 = imgOffset.top + (array[1] || 0);  // bovenkant van gebied
        var x2 = imgOffset.left + (array[2] || 0); // rechterkant van gebied

        var tooltipW = $tooltip.outerWidth();
        var tooltipH = $tooltip.outerHeight();
        var gap = 8; // kleine ruimte tussen gebied en tooltip

        // viewport bounds in document-coördinaten
        var viewportLeft = $(window).scrollLeft();
        var viewportTop = $(window).scrollTop();
        var viewportRight = viewportLeft + $(window).width();
        var viewportBottom = viewportTop + $(window).height();

        var left, top;

        // Prefer rechts van het gebied (rechtsboven)
        if (x2 + gap + tooltipW <= viewportRight) {
            left = x2 + gap;
        } else if (x1 - gap - tooltipW >= viewportLeft) {
            // anders links van het gebied (linksboven)
            left = x1 - gap - tooltipW;
        } else {
            // fallback: clamp binnen viewport
            left = Math.min(Math.max(viewportLeft + gap, x2 + gap), viewportRight - tooltipW - gap);
        }

        // vertical: top uitlijnen met de bovenkant van het gebied, maar binnen viewport houden
        top = y1;
        if (top + tooltipH > viewportBottom - gap) {
            top = viewportBottom - tooltipH - gap;
        }
        if (top < viewportTop + gap) {
            top = viewportTop + gap;
        }

        // Plaats en maak zichtbaar
        $tooltip.css({
            left: Math.round(left) + "px",
            top: Math.round(top) + "px",
            visibility: "visible"
        });

        // Herpositioneer tijdens scroll/resize zolang tooltip zichtbaar is
        var handler = function () { repositionTooltip(sender, $tooltip); };
        $(window).on('resize.tooltip scroll.tooltip', handler);
        // bewaar handler zodat we (optioneel) later specifiek kunnen verwijderen
        $tooltip.data('tooltip-handler', handler);
    });
}

function repositionTooltip(sender, $tooltip) {
    if (!$tooltip || $tooltip.length === 0 || $tooltip.css('display') === 'none') return;

    var array = sender.coords.split(',').map(function (v) { return Number(v); });

    var mapName = (sender.parentElement && sender.parentElement.name) ? sender.parentElement.name : null;
    var $img = mapName ? $('img[usemap="#' + mapName + '"]').first() : $();
    var imgOffset = $img.length ? $img.offset() : { left: 0, top: 0 };

    var x1 = imgOffset.left + (array[0] || 0);
    var y1 = imgOffset.top + (array[1] || 0);
    var x2 = imgOffset.left + (array[2] || 0);

    var tooltipW = $tooltip.outerWidth();
    var tooltipH = $tooltip.outerHeight();
    var gap = 8;

    var viewportLeft = $(window).scrollLeft();
    var viewportTop = $(window).scrollTop();
    var viewportRight = viewportLeft + $(window).width();
    var viewportBottom = viewportTop + $(window).height();

    var left;
    if (x2 + gap + tooltipW <= viewportRight) {
        left = x2 + gap;
    } else if (x1 - gap - tooltipW >= viewportLeft) {
        left = x1 - gap - tooltipW;
    } else {
        left = Math.min(Math.max(viewportLeft + gap, x2 + gap), viewportRight - tooltipW - gap);
    }

    var top = y1;
    if (top + tooltipH > viewportBottom - gap) top = viewportBottom - tooltipH - gap;
    if (top < viewportTop + gap) top = viewportTop + gap;

    $tooltip.css({ left: Math.round(left) + "px", top: Math.round(top) + "px" });
}

function mapRectangleMouseOut(sender) {
    if ($(".previewPanel:hover").length === 0) {
        $(".previewPanel").css("display", "none");
        // verwijder eventueel toegevoegde handlers
        $(window).off('resize.tooltip scroll.tooltip');
        $(".previewPanel").removeData('tooltip-handler');
    }
}

function unescapeHtml(safe) {
    return $('<div>').html(safe).text();
}
// EINDE - TOOLTIP CODE