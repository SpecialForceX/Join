async function onloadFunc() {
    console.log('test');
    let test = await loadData("");
    console.log(test);
}

const BASE_URL = 'https://join-storage-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadData(path="") {
    let response = await fetch(BASE_URL + path + ".json"); // fetch default wert ist GET
    return responseAsJson = await response.json();
}

//CRUD-Operationen "Create, Read, Update, Delete"

//POST
async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseAsJson = response.json();
}

//DELETE
async function deleteData(path="") {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "DELETE",
    });
    return responseAsJson = response.json();
}

//PATCH
async function patchData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PATCH",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseAsJson = response.json();
}

//PUT
async function putData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseAsJson = response.json();
}