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
	e.target.style.backgroundColor = "goldenrod";
	if (e.target === lastSelected) {
	    e.target.style.backgroundColor = "lightblue";
	}
    }
});

document.getElementById("sort-by").addEventListener("change", sortListedNames);

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

    let response = await fetch(url, { cache: 'force-cache' });
    response = await response.json();
    response.results.map((d) => data.push(d));
    populateNames(data);

    for (let i = 2, end = Math.ceil(response.count / data.length); i <= end; i++) {
	additionalFetch(i);
    }

    async function additionalFetch(index) {
	let response = await fetch(url + `?page=${index}`, { cache: 'force-cache' });
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
	return `<li id="${n.name}">${n.name}</li>`;
    }).join('');
    document.getElementById("list").innerHTML = `<ul>${list}</ul>`;
}

// Grabs the li from the 'list' html id and creates the right hand side of the page viewed 
function toNamedValue(e) {
    if (e.target.nodeName !== 'LI') return;
    let result = "";
    const keysAvailable = ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'];
    const named = getNamed(e.target.id);
    
    for (let k in named) {
	if (keysAvailable.includes(k)) {
	    result += `<span><p class="name">${k}</p><p class="name-value">${named[k]}</p></span>`;
	}
    }

    if (lastSelected !== undefined) {
	lastSelected.style.backgroundColor = "goldenrod";
    }
    e.target.style.backgroundColor = "lightblue";
    lastSelected = e.target;

    document.getElementById("named-value").innerHTML = result;
}

function sortListedNames(e) {
    const filter = e.target.value;
    console.log(filter);
    const nameList = Array.from(document.getElementById("list").getElementsByTagName('LI')).map((l) => {
	return l.id;
    });

    let filterList = nameList.map((n) => getNamed(n))
	.sort((a, b) => {
	    if (a[filter] < b[filter]) return -1;
	    else if (a[filter] === b[filter]) return 0;
	    else return 1;
	});

    // If the value of sort method is 'none' or 'name' just use
    // the populateNames() function
    if (filter === 'none' || filter === 'name') {
	populateNames(filterList);
	return;
    }
    
    // Get a collection of list items to dump into an UL
    let list = filterList.map((n) => {
	return `<li id="${n.name}">${n.name}</li>`;
    });

    console.log(list);
    let counter = 0;
    let currentList = '';
    let testList = '';
    let ulList = document.getElementById("list");
    ulList.innerHTML = '';
    while (counter < list.length) {
	let ul = document.createElement('UL');
	ul.innerHTML = filterList[counter][filter];
	currentList = filterList[counter][filter];
//	console.log(currentList);
	while ( counter < list.length && currentList === filterList[counter][filter]) {
	    ul.innerHTML += list[counter];
	    currentList = filterList[counter][filter];
	    counter++;
	}

	ulList.appendChild(ul);
    }
    
//    document.getElementById("list").innerHTML = `<ul>${list}</ul>`;    
}
