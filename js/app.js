const search = document.getElementById("search");
const overlay = document.getElementById("overlay");
const overlayCard = document.querySelector(".card");
const overlayData = document.querySelector(".data");
const employeesSection = document.querySelector(".employees");

async function getEmployees() {
	try {
		const response = await fetch(
			"https://randomuser.me/api/?results=12&nat=US&noinfo"
		);
		const employeeList = await checkStatus(response);
		generateEmployeeLI(employeeList.results);
	} catch (error) {
		console.error(Error(error));
	}
}

function checkStatus(response) {
	if (response.ok) return Promise.resolve(response.json());
	else return Promise.reject(response.status);
}

function generateEmployeeLI(employees) {
	employees.forEach((employee, index) => {
		const li = document.createElement("li");
		li.className = "employee";
		li.innerHTML = `
	        <img src="${employee.picture.large}" alt="${employee.name.first} ${
			employee.name.last
		}">
            <div class="main-info">
                <h3  id="${index}">${employee.name.first} ${
			employee.name.last
		}</h3>
                <p>${employee.email}</p>
                <p>${employee.location.city}</p>
            </div>
            <div class="additional-info">
                <p>${employee.cell.replace("-", " ")}</p>
                <p>${employee.location.street.number} ${
			employee.location.street.name
		}, ${employee.location.state} ${employee.location.postcode}</p>
                <p>Birthday: ${modifyDate(employee.dob.date.substr(0, 10))}</p>
            </div>
	    `;
		employeesSection.appendChild(li);
	});
}

function modifyDate(date) {
	const arr = date.split("-");
	return arr.reverse().join("/");
}

function getCurrentElement() {
	const identifier = overlayData.querySelector("h3").id;
	return document.querySelectorAll("li")[identifier];
}

employeesSection.addEventListener("click", (event) => {
	if (event.target.tagName !== "UL") {
		const element = event.target.closest("li");
		overlayData.innerHTML = element.innerHTML;
		overlay.style.display = "flex";
	}
});

overlay.addEventListener("click", (event) => {
	const target = event.target;
	if (target.className.includes("exit")) {
		overlay.style.display = "none";
		overlayData.innerHTML = "";
	} else if (target.tagName === "SPAN") {
		const currrentElement = getCurrentElement();
		if (target.parentElement.className === "next") {
			if (currrentElement.nextElementSibling)
				overlayData.innerHTML = currrentElement.nextElementSibling.innerHTML;
			else overlayData.innerHTML = document.querySelector("li").innerHTML;
		} else {
			if (currrentElement.previousElementSibling)
				overlayData.innerHTML =
					currrentElement.previousElementSibling.innerHTML;
			else
				overlayData.innerHTML =
					document.querySelector("li:last-child").innerHTML;
		}
	}
});

search.addEventListener("input", (event) => {
	const val = search.value.toLowerCase();
	const array = document.querySelectorAll("li");
	array.forEach((element) => {
		const string = element.querySelector("h3").textContent.toLowerCase();
		if (!string.includes(val)) {
			element.style.display = "none";
		} else element.style.display = "";
	});
});

getEmployees();
