
// a post request gets sent to the server, the body contains the data we want to send
function upload(buildingname, address, thickness, footing, blueprint, stairs, interior, exterior, window, door, roof, slab) {
    // deletes and the building if the name already exists
    const request_delete = new Request('/delete', {
        method: 'POST',
        body: JSON.stringify({
            "name": buildingname
        })
    });

    fetch(request_delete)
        .then(response => {
        })
        .then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })

    const request = new Request('/update_entry', {
        method: 'POST',
        body: JSON.stringify({
            "name": buildingname,
            "address": address,
            "thickness": thickness,
            "footing": footing,
            "blueprint": blueprint,
            "stairs": stairs,
            "interior": interior,
            "exterior": exterior,
            "window": window,
            "door": door,
            "roof": roof,
            "slab": slab
        })
    });

    fetch(request)
        .then(response => {
            return response.text();
        })
        .then(response => {
            console.log(response);
            clearLock();
            location.reload();
        }).catch(error => {
            console.log(error);
        });
}

function submitForm(event) {
    event.preventDefault(); //prevents reloading the page
    //console.log(event);

    // get the values from the event, the order of the array matches the one of the input fields    
    const buildingname = event.target[0].value;
    const address = event.target[1].value;
    const thickness = Number(event.target[2].value);
    const blueprint = event.target[5].files[0];
    const stairs = Number(event.target[4].value);
    const interior = (Math.round(Number(event.target[3].value) * 0.95 * 100) / 100).toFixed(2);
    const footing = Number(document.getElementById("area-footing").innerText);
    const exterior = (Math.round(Number(document.getElementById("area-exterior").innerText) * 0.7 * 100) / 100).toFixed(2);
    const window = Number(document.getElementById("area-window").innerText);
    const door = Number(document.getElementById("area-door").innerText);
    const roof = Number(document.getElementById("area-roof").innerText);
    const slab = Number(document.getElementById("area-slab").innerText);

    // checks if the file is an image
    if (blueprint.type && !blueprint.type.startsWith('image/')) {
        alert('File is not an image.', blueprint.type, blueprint.name);
        return;
    }

    // reads the selected file 
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const file = event.target.result;
        upload(buildingname, address, thickness, footing, file, stairs, interior, exterior, window, door, roof, slab);
    });

    reader.readAsDataURL(blueprint);
}


function updateClicked() {

    // saving the HTML element of the text inputs
    const buildingnameElement = document.getElementById('buildingname');
    const addressElement = document.getElementById('address');
    const thicknessElement = document.getElementById('thickness');
    const browseButtonElement = document.getElementById('browsebutton');
    const stairsElement = document.getElementById('stairs');
    const interiorElement = document.getElementById('interior');

    // saving the value if the text inputs
    const buildingname = buildingnameElement.value;
    const address = addressElement.value;
    const thickness = Number(thicknessElement.value);
    const files = browseButtonElement.files.length;
    const stairs = stairsElement.value;
    const interior = interiorElement.value;

    let valid = true;

    // depending on the input, the border of the text fields color red or green    
    if (buildingnameElement.value == '') {
        buildingnameElement.style.borderColor = "#FF0000";
        valid = false;
    } else {
        buildingnameElement.style.borderColor = "#00FF00";

    }
    if (addressElement.value == '') {
        addressElement.style.borderColor = "#FF0000";
        valid = false;
    } else {
        addressElement.style.borderColor = "#00FF00";

    }
    // the user has to add a number into the text field, otherwise it is not valid
    if (thicknessElement.value == '' || isNaN(thickness)) {
        thicknessElement.style.borderColor = "#FF0000";
        valid = false;
    } else {
        thicknessElement.style.borderColor = "#00FF00";

    }

    if (stairs == '') {
        stairsElement.style.borderColor = "#FF0000";
        valid = false;
    } else {
        stairsElement.style.borderColor = "#00FF00";

    }

    if (interior == '') {
        interiorElement.style.borderColor = "#FF0000";
        valid = false;
    } else {
        interiorElement.style.borderColor = "#00FF00";

    }

    if (files == 0) {
        //browseButtonElement.style.borderColor = "#FF0000";
        browseButtonElement.style.border = "solid red 1px";
    } else {
        //browseButtonElement.style.borderColor = "#00FF00";
        browseButtonElement.style.border = "solid #00FF00 1px";
    }


    if (valid) {
        document.getElementById("validmessage").innerHTML = "";
        buildingnameElement.style.borderColor = "";
        addressElement.style.borderColor = "";
        thicknessElement.style.borderColor = "";
        browseButtonElement.style.border = "";
        stairsElement.style.border = "";
        interiorElement.style.border = "";
        //JSON.stringify({"name": buildingname, "address": address, "thickness": thickness})
        //`{"name": "${buildingname}", "address": "${address}", "thickness": ${thickness}}` 

        // if the inputs are not valid, an error message telling that appears, the p tag already exists but has no inner text        
    } else {
        document.getElementById("validmessage").innerHTML = "Some input fields are not valid!";
    }

}

