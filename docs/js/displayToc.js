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
            }
            else {
                titles[i].style.background = "#DDDDDD";
                titles[i].style.color = "#666666";
            }
        }

        var tabs = table.getElementsByClassName('ItemBody');
        if (tabs.length > 0) {
            height = toggleItemDetails(tabs, item);
        }
    }
}

function toggleItemDetails(tabs, title) {
    var i, height = 0;

    for (i = 0; i < tabs.length; i++) {
        var tab = tabs[i];

        if (tab.id == title + "Table") {
            tab.style.display = "block";
            height = tab.clientHeight;
        }
        else
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
            }
            else {
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

/* ------------------------------
   Maatwerk: Tooltip functionaliteit
   ------------------------------ */
$(document).ready(function() {
    // Voeg tooltip-div toe als die nog niet bestaat
    if($("#eaTooltip").length === 0){
        $("body").append('<div id="eaTooltip" style="position:absolute; display:none; background:#fff; border:1px solid #ccc; padding:8px; max-width:400px; max-height:300px; overflow:auto; z-index:1000; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.2); font-family:Arial,sans-serif; font-size:12px; line-height:1.4em;"></div>');
    }

    // Delegated binding voor hover
    $(document).on("mouseenter", "map area", function(e){
        var href = $(this).attr("href"); // bijv. EA57.htmObjectDetailsNotes
        var lastHtm = href.lastIndexOf(".htm");
        if(lastHtm === -1) return;

        var url = href.substring(0, lastHtm + 4);        // EA57.htm
        // Laad de volledige pagina (voor nu)
        $("#eaTooltip").load(url, function(response, status, xhr){
            if(status === "error"){
                $("#eaTooltip").text("Fout bij laden: " + xhr.status + " " + xhr.statusText);
            }
            $("#eaTooltip").css({ top: e.pageY+15, left: e.pageX+15 }).fadeIn(200);
        });
    }).on("mouseleave", "map area", function(){
        $("#eaTooltip").hide().empty();
    }).on("mousemove", "map area", function(e){
        $("#eaTooltip").css({ top: e.pageY+15, left: e.pageX+15 });
    });
});
