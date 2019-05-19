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

    while(url !== null) {
	let response = await fetch(url);
	let temp = await response.json();
	temp.results.map((d) => data.push(d));
	url = temp.next;
	populateNames(data);
    }
}

function populateNames(nL) {
    //Using <ul>
    //Each name in nL will have a <li>
    const list = nL.map((n) => {
	return `<li data-listname="${n.name}">${n.name}</li>`;
    }).join('');
    document.getElementById("list").innerHTML = `<ul>${list}</ul>`;
}

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
