
// using async because we want to use the response status code to return a value from this function
// asks the server to get the lock, if the status is 200, the lock was created successfully in the db
// otherwise there was already an entry/a lock and we can not edit the db
async function tryGetLock() {
    const request = new Request('/get_lock', { method: 'GET' });
    const response = await fetch(request);

    if (response.status === 200) {
        return true;
    }
    if (response.status === 400) {
        return false;
    }
    return false;
}

// refreshes the entry in the db
function updateLock() {
    const request = new Request('/update_lock', { method: 'GET' });

    fetch(request)
        .then(response => {
            console.log('lock updated')

        })
        .catch(error => {
            console.log(error);
        });

}

// removes the entry in the db
function clearLock() {
    const request = new Request('/clear_lock', { method: 'GET' });

    fetch(request)
        .then(response => {
            console.log('lock cleared')

        })
        .catch(error => {
            console.log(error);
        });
}

// tries to create an entry if the checkbox is being enabled. If that fails, an alert pops up. 
// if the checkbox is being disabled, the entry gets removed and someone else can now aquire a lock
// the form inputs get disabled, if we don't have the lock (checkbox is disabled), otherwise they will be enabled
async function EnableBuildingManager(event) {

    var enableElements = false;

    if (event.target.checked) {
        if (await tryGetLock()) {
            enableElements = true;
        } else {
            alert('The database is in use, try again later!');
            enableElements = false;
        }
    } else {
        clearLock();
        enableElements = false;
    }

    // when the is aquired, the form inputs will be enabled, otherwise they will be disabled
    if (enableElements) {
        enableUpdate();
        event.target.checked = true;
        document.querySelectorAll("form > input").forEach(e => {
            e.disabled = false;
        });
        document.getElementById("button-footing").disabled = false;
        document.getElementById("button-exterior").disabled = false;
        document.getElementById("button-roof").disabled = false;
        document.getElementById("slab-amount").disabled = false;

    } else {
        event.target.checked = false;
        disableUpdate();
        document.querySelectorAll("form > input").forEach(e => {
            e.disabled = true;
        })
        document.getElementById("button-footing").disabled = true;
        document.getElementById("button-exterior").disabled = true;
        document.getElementById("button-roof").disabled = true;
        document.getElementById("slab-amount").disabled = true;
    }
}

var interval = 0;

// periodically asks the server to keep the lock, so the user has all the time to edit the db
function enableUpdate() {
    interval = setInterval(updateLock, 20000);
}

// stops updating the lock, when the checkbox gets disabled
function disableUpdate() {
    try {
        clearInterval(interval);
    } catch (err) { }
}

// by default, the form inputs are disabled
document.querySelectorAll("form > input").forEach(e => {
    e.disabled = true;
})
document.getElementById("button-footing").disabled = true;
document.getElementById("button-exterior").disabled = true;
document.getElementById("button-roof").disabled = true;
document.getElementById("slab-amount").disabled = true;

