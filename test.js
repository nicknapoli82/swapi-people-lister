let getNamed;
let lastSelected;
fetchPeople();
document.getElementById("list").addEventListener("click", toNamedValue);

document.getElementById("list").addEventListener("mouseover", (e) => {
    if (e.target.nodeName === 'LI') {
	e.target.style.backgroundColor = "lightgrey";
    }
});

document.getElementById("list").addEventListener("mouseout", (e) => {
    if (e.target.nodeName === 'LI') {
	e.target.style.backgroundColor = "white";
	if (e.target === lastSelected) {
	    e.target.style.backgroundColor = "lightblue";
	}
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
// Above is really just the raw order of things being called. Below is the meat and potatos //
//////////////////////////////////////////////////////////////////////////////////////////////

// fetchPeople() grabs a number of json objects from https://swapi.co/ one request at a time
// stores into global getNamed all the available data from fetches made... Thats it
async function fetchPeople() {
    let data = [];
    let url = "https://swapi.co/api/people/";

    getNamed = (name) => {
	for (let d in data) {
	    if(data[d].name === name) {
		return data[d];
	    }
	}
	return null;
    };

    let response = await fetch(url);
    response = await response.json();
    response.results.map((d) => data.push(d));
    populateNames(data);

    console.log(response.count / data.length);
    for (let i = 2, end = Math.ceil(response.count / data.length); i <= end; i++) {
	additionalFetch(i);
    }

    async function additionalFetch(index) {
	let response = await fetch(url + `?page=${index}`);
	response = await response.json();
	response.results.map((d) => data.push(d));
	populateNames(data);	
    }
}

// As fetches are made from fetchPeople() this is called to continuously populate more items of
// available people who can be observed
function populateNames(nL) {
    //Using <ul>
    //Each name in nL will have a <li>
    const list = nL.map((n) => {
	return `<li data-listname="${n.name}">${n.name}</li>`;
    }).join('');
    document.getElementById("list").innerHTML = `<ul>${list}</ul>`;
}

// Grabs the li from the 'list' html id and creates the right hand side of the page viewed 
function toNamedValue(e) {
    if (e.target.nodeName !== 'LI') return;
    let result = "";
    const keysAvailable = ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'];
    const named = getNamed(e.target.innerText);
    
    for (let k in named) {
	if (keysAvailable.includes(k)) {
	    result += `<span><p class="name">${k}</p><p class="name-value">${named[k]}</p></span>`;
	}
    }

    if (lastSelected !== undefined) {
	lastSelected.style.backgroundColor = "white";
    }
    e.target.style.backgroundColor = "lightblue";
    lastSelected = e.target;

    document.getElementById("named-value").innerHTML = result;
}
