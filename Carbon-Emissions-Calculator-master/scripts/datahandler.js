function calculateSlab() {
    const slabs = document.getElementById("slab-amount").value;
    const area = Number(document.getElementById("area-footing").innerText);
    document.getElementById("area-slab").innerText = (Math.round(slabs * area *100)/100).toFixed(2);
}

function calculateWindow() {
    const exterior = Number(document.getElementById("area-exterior").innerText);
    document.getElementById("area-window").innerText = (Math.round(exterior * 0.25 * 100) / 100).toFixed(2);
}

function calculateDoor() {
    const interior = Number(document.getElementById("interior").value);
    const exterior = Number(document.getElementById("area-exterior").innerText);
    console.log(interior, exterior);
    document.getElementById("area-door").innerText = (Math.round((interior + exterior) * 0.05 * 100) / 100).toFixed(2);
}

//deletes the footing area and calculates the slab area again
document.getElementById("delete-footing").addEventListener("click", (event) => {
    document.getElementById("area-footing").innerText = 0;
    calculateSlab();
})

//updates the slab area when the amount changes
document.getElementById("slab-amount").addEventListener("change", (event) => {
    calculateSlab();
})

//updates the door area when the interior wall area changes
document.getElementById("interior").addEventListener("change", (event) => {
    calculateDoor();
})

//deletes the exterior wall area and updates the window and door areas
document.getElementById("delete-exterior").addEventListener("click", (event) => {
    document.getElementById("area-exterior").innerText = 0;
    calculateDoor();
    calculateWindow();
})

//deletes the roof area
document.getElementById("delete-roof").addEventListener("click", (event) => {
    document.getElementById("area-roof").innerText = 0;

})

//reads the data from the infobox

//gets the footing area and updates the slab area
document.getElementById("button-footing").addEventListener("click", (event) => {

    const iframeDoc = document.getElementById('iframe').contentWindow.document;


    const area = Number(iframeDoc.getElementById("area").innerText);
    const oldArea = Number(document.getElementById("area-footing").innerText);
    const newArea = oldArea + area;
    document.getElementById("area-footing").innerText = (Math.round(newArea * 100) / 100).toFixed(2);
    calculateSlab();

})

//gets the exterior wall area (summing up on every click) and updates the window and door areas
document.getElementById("button-exterior").addEventListener("click", (event) => {

    const iframeDoc = document.getElementById('iframe').contentWindow.document;


    const area = Number(iframeDoc.getElementById("area").innerText);
    const oldArea = Number(document.getElementById("area-exterior").innerText);
    const newArea = oldArea + area;
    document.getElementById("area-exterior").innerText = (Math.round(newArea * 100) / 100).toFixed(2);
    calculateWindow();
    calculateDoor();

})

//gets the roof area from the info box and sets the field in the table
document.getElementById("button-roof").addEventListener("click", (event) => {

    const iframeDoc = document.getElementById('iframe').contentWindow.document;


    const area = Number(iframeDoc.getElementById("area").innerText);
    const oldArea = Number(document.getElementById("area-roof").innerText);
    const newArea = oldArea + area;
    document.getElementById("area-roof").innerText = (Math.round(newArea * 100) / 100).toFixed(2);

})

// when clicking on the delete icon, the building of that row will be deleted from the database
document.querySelectorAll('[id=delete-building]').forEach(b => {
    b.addEventListener("click", (event) => {
        if (document.getElementById("enable").checked) {
            const name = b.dataset['name'];

            const request = new Request('/delete', {
                method: 'POST',
                body: JSON.stringify({
                    "name": name,
                })
            });

            fetch(request)
                .then(response => {
                    clearLock();
                    location.reload();
                    // return response.text(); 
                })
                .then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                })
        } else {
            alert("Please enable editing before you delete a building!");
        }
    });
})

// when clicking on the image icon, the blueprint of the building opens in a new tab
document.querySelectorAll('[id=image]').forEach(b => {
    b.addEventListener("click", (event) => {
        const name = b.dataset['name'];
        window.open('/image/' + name).focus();

    })
});

document.querySelectorAll('[id=sensor]').forEach(b => {
    b.addEventListener("click", (event) => {
        window.open('/sensor').focus();

    })
});

// when clicking on the edit icon, the input/text fields get filled again
document.querySelectorAll('[id=edit]').forEach(b => {
    b.addEventListener("click", (event) => {
        const name = b.dataset['name'];
        const request = new Request('/get_info/' + name, { method: 'GET' });

        fetch(request)
            .then(response => {
                return response.json();
            })
            .then(response => {
                console.log(response);
                // filling the input and text fields with the response building data
                document.getElementById('buildingname').value = response.name;
                document.getElementById('address').value = response.address;
                document.getElementById('thickness').value = response.thickness;
                document.getElementById('browsebutton');
                document.getElementById('stairs').value = response.stairs;
                document.getElementById('interior').value = (Math.round(Number(response.interior / 0.95 *100))/100).toFixed(2); // 5% for doors (assumption)
                document.getElementById('area-footing').innerText = response.footing;
                document.getElementById('area-exterior').innerText = (Math.round(Number(response.exterior / 0.7*100))/100).toFixed(2); // 5% doors, 25% windows (assumption), 0.7 to get the original number from the model
                document.getElementById('area-roof').innerText = response.roof;
                document.getElementById('area-slab').innerText = response.slab;
                document.getElementById('slab-amount').value = response.slab / response.footing;
                document.getElementById('area-window').innerText = response.window;
                document.getElementById('area-door').innerText = response.door;



            }).catch(error => {
                console.log(error);
            });
    })
});

// when clicking on the leaf icon, the amount column gets filled with the building data and the emissions will be calculated (e = GWP * Amount) and displayed in the e column

document.querySelectorAll('[id=leaf]').forEach(b => {
    b.addEventListener("click", (event) => {
        const name = b.dataset['name'];
        const request = new Request('/get_info/' + name, { method: 'GET' });
        const request2 = new Request('/get_gwp ', { method: 'GET' });

        fetch(request)
            .then(response => {
                return response.json();
            })
            .then(response => {
                console.log(response);
                // filling the fields in the gwp table with the response building data
                document.getElementById('leaf-footing').innerText = (Math.round(Number(response.footing * response.thickness *100))/100).toFixed(2);
                document.getElementById('leaf-slab').innerText = response.slab;
                document.getElementById('leaf-interior').innerText = response.interior;
                document.getElementById('leaf-exterior-stone').innerText = response.exterior;
                document.getElementById('leaf-exterior-concrete').innerText = response.exterior;
                document.getElementById('leaf-stairs').innerText = response.stairs;
                document.getElementById('leaf-roof-tile').innerText = response.roof;
                document.getElementById('leaf-roof-membrane').innerText = response.roof;
                document.getElementById('leaf-window-glass').innerText = (Math.round(Number(response.window * 0.95 *100))/100).toFixed(2); // 95% glass
                document.getElementById('leaf-window-frame').innerText = (Math.round(Number(response.window * 0.05 *100))/100).toFixed(2); // 5% frame (assumptions)
                document.getElementById('leaf-door').innerText = response.door;

                // filling the e column 
                fetch(request2)
                    .then(response2 => {
                        console.log(response2);
                        return response2.json();
                    })
                    .then(response2 => {
                        console.log(response2);

                        // filling the e column. response2 contains the data of the whole Elements collection. 
                        // .find() finds the entry with the corresponding name, .materials gets the materials attribute, [i] gves the object on position i and .GWP gets the GWP of the element
                        document.getElementById('e-footing').innerText = (response.footing * response.thickness * response2.find(e => e['name'] == 'footing').materials[0].GWP).toFixed(2);
                        document.getElementById('e-slab').innerText = (response.slab * response2.find(e => e['name'] == 'slab').materials[0].GWP).toFixed(2);
                        document.getElementById('e-interior').innerText = (response.interior * response2.find(e => e['name'] == 'interior wall').materials[0].GWP).toFixed(2);
                        document.getElementById('e-exterior-stone').innerText = (response.exterior * response2.find(e => e['name'] == 'exterior wall').materials[0].GWP).toFixed(2);
                        document.getElementById('e-exterior-concrete').innerText = (response.exterior * response2.find(e => e['name'] == 'exterior wall').materials[1].GWP).toFixed(2);
                        document.getElementById('e-stairs').innerText = (response.stairs * response2.find(e => e['name'] == 'stairs').materials[0].GWP).toFixed(2);
                        document.getElementById('e-roof-tile').innerText = (response.roof * response2.find(e => e['name'] == 'roof').materials[0].GWP).toFixed(2);
                        document.getElementById('e-roof-membrane').innerText = (response.roof * response2.find(e => e['name'] == 'roof').materials[1].GWP).toFixed(2);
                        document.getElementById('e-window-glass').innerText = (response.window * response2.find(e => e['name'] == 'window').materials[0].GWP).toFixed(2);
                        document.getElementById('e-window-frame').innerText = (response.window * response2.find(e => e['name'] == 'window').materials[1].GWP).toFixed(2);
                        document.getElementById('e-door').innerText = (response.door * response2.find(e => e['name'] == 'door').materials[0].GWP).toFixed(2);

                        document.getElementById('total-e').innerText =
                            (Number(document.getElementById('e-footing').innerText) +
                                Number(document.getElementById('e-slab').innerText) +
                                Number(document.getElementById('e-interior').innerText) +
                                Number(document.getElementById('e-exterior-stone').innerText) +
                                Number(document.getElementById('e-exterior-concrete').innerText) +
                                Number(document.getElementById('e-stairs').innerText) +
                                Number(document.getElementById('e-roof-tile').innerText) +
                                Number(document.getElementById('e-roof-membrane').innerText) +
                                Number(document.getElementById('e-window-glass').innerText) +
                                Number(document.getElementById('e-window-frame').innerText) +
                                Number(document.getElementById('e-door').innerText)).toFixed(2);

                    }).catch(error => {
                        console.log(error);
                    });

            }).catch(error => {
                console.log(error);
            });



    })
});