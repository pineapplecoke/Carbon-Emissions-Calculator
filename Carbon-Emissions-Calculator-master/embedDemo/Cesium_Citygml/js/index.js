$(function() {
    // var iframe = document.getElementById("iframe1");
    // iwindow = iframe.contentWindow;
    // var idoc = iwindow.document;
    // console.log("document", idoc);
    console.log('running');
    var LibraryQuery = jQuery.noConflict();
    LibraryQuery(document).on("dblclick", function() {
        LibraryQuery("#myinfobox").show();
        var selectedId = LibraryQuery("iframe").contents().find("tr").eq(3).text().substring(6);

        getselectedJsonObject(selectedId);

        // LibraryQuery('iframe').attr('src', LibraryQuery('iframe').attr('src'));

        // document.querySelector('iframe').contentWindow.location.reload();
        // LibraryQuery("iframe").addClass("ifr1");

    })
    LibraryQuery("div").on("click", "thead", function() {
        LibraryQuery(this).parent().hide();

    })

    function getselectedJsonObject(selectedId) {

        LibraryQuery.getJSON("data/Geojson.json", function(data) {

            LibraryQuery.each(data.features, function(i, item) {
                
                if (item.properties.gml_id == selectedId) {

                    var info = data.features[i];

                    var type = info.type;
                    var gml_id = info.properties.gml_id;
                    //var Material = info.material;
                    var coordinates = item.geometry.coordinates;
                    var arr = [];

                    console.log(item);

                    for (var i = 0; i < coordinates.length; i++) {
                        arr.push(coordinates[i][0]);

                    }
                    var square = compute_3D_polygon_area(arr);
                    LibraryQuery("#myinfobox").html("<thead class='icon-cancel-circle'></thead><tbody><tr><th>type</th><td>" + type + "</td></tr>" +
                        "<tr><th>GML_ID</th><td>" + gml_id + "</td></tr>" +
                        '<tr><th>Square</th><td id="area">' + square + "</td></tr></tbody>")

                    // console.log(window.parent.document.getElementById('areacalculate').value);

                    //window.parent.document.getElementById('CallthisID').value = 1;
                    
                    //window.parent.document.getElementById('inputCitygmlArea').value = square;
                   
                }

            })

        });

        // return info;
    }

    //In geometry, Heron's formula (sometimes called Hero's formula), named after Hero of Alexandria,gives the area of a triangle when the lengths of all three sides are known. 
    //Unlike other triangle area formulae, there is no need to calculate angles or other distances in the triangle first.
    
    function compute_3D_polygon_area(points) {
        if (points.length < 3) return 0.0;
        var P1X, P1Y, P1Z, P2X, P2Y, P2Z, P3X, P3Y, P3Z;
        P1X = points[0][0];
        P1Y = points[0][1];
        P1Z = points[0][2];

        P2X = points[1][0];
        P2Y = points[1][1];
        P2Z = points[1][2];

        P3X = points[2][0];
        P3Y = points[2][1];
        P3Z = points[2][2];
        var a = Math.pow(((P2Y - P1Y) * (P3Z - P1Z) - (P3Y - P1Y) * (P2Z - P1Z)), 2) + Math.pow(((P3X - P1X) * (P2Z - P1Z) -
            (P2X - P1X) * (P3Z - P1Z)), 2) + Math.pow(((P2X - P1X) * (P3Y - P1Y) - (P3X - P1X) * (P2Y - P1Y)), 2);
        var cosnx = ((P2Y - P1Y) * (P3Z - P1Z) - (P3Y - P1Y) * (P2Z - P1Z)) / (Math.pow(a, 1 / 2));
        var cosny = ((P3X - P1X) * (P2Z - P1Z) - (P2X - P1X) * (P3Z - P1Z)) / (Math.pow(a, 1 / 2));
        var cosnz = ((P2X - P1X) * (P3Y - P1Y) - (P3X - P1X) * (P2Y - P1Y)) / (Math.pow(a, 1 / 2));
        var s = cosnz * ((points[points.length - 1][0]) * (P1Y) - (P1X) * (points[points.length - 1][1])) + cosnx * ((points[points.length - 1][1]) * (
            P1Z) - (P1Y) * (points[points.length - 1][2])) + cosny * ((points[points.length - 1][2]) * (P1X) - (P1Z) * (points[points.length - 1][0]));

        for (var i = 0; i < points.length - 1; i++) {
            var p1 = points[i];
            var p2 = points[i + 1];
            var ss = cosnz * ((p1[0]) * (p2[1]) - (p2[0]) * (p1[1])) + cosnx * ((p1[1]) *
                (p2[2]) - (p2[1]) * (p1[2])) + cosny * ((p1[2]) * (p2[0]) - (p2[2]) * (p1[0]));
            s += ss;
            //console.log(s);
        }

        s = Math.abs(s / 2.0);

        return s;
    }

})