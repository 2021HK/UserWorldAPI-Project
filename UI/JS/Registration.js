// ---------------- Global Variables ----------------
const baseURL = "http://localhost:5122";   // API base

const form = document.getElementById("registration_form");

document.addEventListener("DOMContentLoaded", function () {
    loadNationalities();
    loadCountries();

    // When country changes → load states
    document.getElementById("country").addEventListener("change", function () {
        loadStates(this.value);
    });

    // When state changes → load cities
    document.getElementById("state").addEventListener("change", function () {
        loadCities(this.value);
    });
});

// ---------------- Dropdown API Calls ----------------

function loadNationalities() {
    fetch(baseURL + "/api/UserWorld/NationalityList")
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById("nationality");
            dropdown.innerHTML = "<option value=''>--Select--</option>";
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.nationalityId;
                option.textContent = item.nationalityName;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading nationalities:", error));
}

function loadCountries() {
    fetch(baseURL + "/api/UserWorld/CountryList")
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById("country");
            dropdown.innerHTML = "<option value=''>--Select--</option>";
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.countryId;
                option.textContent = item.countryName;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading countries:", error));
}

function loadStates(countryId) {
    fetch(baseURL + "/api/UserWorld/StateList/" + countryId)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById("state");
            dropdown.innerHTML = "<option value=''>--Select--</option>";
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.stateId;
                option.textContent = item.stateName;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading states:", error));
}

function loadCities(stateId) {
    fetch(baseURL + "/api/UserWorld/CityList/" + stateId)
        .then(response => response.json())
        .then(data => {
            let dropdown = document.getElementById("city");
            dropdown.innerHTML = "<option value=''>--Select--</option>";
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.cityId;
                option.textContent = item.cityName;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading cities:", error));
}

// ---------------- Registration Submit ----------------

form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop normal form submit

    let isValid = true;

    // ---------- Validation ----------
    if (document.getElementById("fullname").value.trim() === "") {
        document.getElementById("error-fullname").style.display = "block";
        isValid = false;
    } else document.getElementById("error-fullname").style.display = "none";

    if (document.getElementById("email").value.trim() === "") {
        document.getElementById("error-email").style.display = "block";
        isValid = false;
    } else document.getElementById("error-email").style.display = "none";

    if (document.getElementById("username").value.trim() === "") {
        document.getElementById("error-username").style.display = "block";
        isValid = false;
    } else document.getElementById("error-username").style.display = "none";

    if (document.getElementById("password").value.trim() === "") {
        document.getElementById("error-password").style.display = "block";
        isValid = false;
    } else document.getElementById("error-password").style.display = "none";

    if (document.getElementById("DOB").value.trim() === "") {
        document.getElementById("error-DOB").style.display = "block";
        isValid = false;
    } else document.getElementById("error-DOB").style.display = "none";

    if (document.getElementById("contact").value.trim() === "") {
        document.getElementById("error-contact_number").style.display = "block";
        isValid = false;
    } else document.getElementById("error-contact_number").style.display = "none";

    if (document.getElementById("nationality").value === "") {
        document.getElementById("error-nationality").style.display = "block";
        isValid = false;
    } else document.getElementById("error-nationality").style.display = "none";

    if (document.getElementById("country").value === "") {
        document.getElementById("error-country").style.display = "block";
        isValid = false;
    } else document.getElementById("error-country").style.display = "none";

    if (document.getElementById("state").value === "") {
        document.getElementById("error-state").style.display = "block";
        isValid = false;
    } else document.getElementById("error-state").style.display = "none";

    if (document.getElementById("city").value === "") {
        document.getElementById("error-city").style.display = "block";
        isValid = false;
    } else document.getElementById("error-city").style.display = "none";

    let genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        document.getElementById("error-gender").style.display = "block";
        isValid = false;
    } else document.getElementById("error-gender").style.display = "none";

    let langSelected = document.querySelectorAll('input[name="language"]:checked');
    if (langSelected.length === 0) {
        document.getElementById("error-LK").style.display = "block";
        isValid = false;
    } else document.getElementById("error-LK").style.display = "none";

    if (document.getElementById("file").files.length === 0) {
        document.getElementById("error-file").style.display = "block";
        isValid = false;
    } else document.getElementById("error-file").style.display = "none";

    if (!isValid) {
        showPopupMessage("Error", "Please enter values for required fields", false);
        return;
    }

   // ---------- Build Payload ----------
const genderValue = genderSelected.value;
const gender = genderValue === "Male" ? 1 : genderValue === "Female" ? 2 : 3;

const languageCheckboxes = Array.from(langSelected);
const languagesKnown = languageCheckboxes.map(lang => {
    switch (lang.value) {
        case "English": return 1;
        case "Hindi": return 2;
        case "Marathi": return 3;
        default: return null;
    }
}).filter(id => id !== null);

const payload = {
    fullName: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    dateOfBirth: new Date(document.getElementById("DOB").value).toISOString().split("T")[0], // keep only YYYY-MM-DD
    contactNumber: document.getElementById("contact").value,
    address: document.getElementById("address").value,
    nationalityId: parseInt(document.getElementById("nationality").value),
    countryId: parseInt(document.getElementById("country").value),
    stateId: parseInt(document.getElementById("state").value),
    cityId: parseInt(document.getElementById("city").value),
    gender: gender,
    profession: document.getElementById("profession").value,
    aboutYourself: document.getElementById("about").value,
    languagesKnown: languagesKnown,
    photoPath: "/images/profiles/default.jpg" // 🔹 placeholder, since API expects a path not file
};

// ---------- API Call ----------
fetch(baseURL + "/api/UserWorld", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
})
    .then(response => {
        if (!response.ok) return response.json().then(err => { throw err; });
        return response.json();
    })
    .then(data => {
        showPopupMessage("Success", "User registered successfully!", true);
        document.getElementById("registration_form").reset();
    })
    .catch(error => {
        console.error(error);
        showPopupMessage("Error", "Failed to register user. " + (error.title || error.message || JSON.stringify(error)), false);
    });
});


function showPopupMessage(title, message, isSuccess) {
    const popup = document.createElement("div");
    popup.className = "popup-message " + (isSuccess ? "success" : "error");
    popup.innerHTML = `<h2>${title}</h2><p>${message}</p><button onclick="this.parentElement.remove()">Close</button>`;
    document.body.appendChild(popup);
}
