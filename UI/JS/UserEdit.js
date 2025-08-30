
// //On DOMContentLoaded
// document.addEventListener("DOMContentLoaded", async () => {

//     const baseURL = "http://localhost:5122";
//       const urlParams = new URLSearchParams(window.location.search);
//       const userId = urlParams.get("userId");


//     //Get user details by id and fill the form
//     await OnPageLoadShowUserDetailsInForm(baseURL, userId);

//     // On button click, call UpdateUser
//     const updateButton = document.getElementById("submit");

//     updateButton.addEventListener("click", function (e) {
//         e.preventDefault(); // prevent form submission
//         UpdateUser(baseURL, userId);
//     });
// });

// async function OnPageLoadShowUserDetailsInForm(baseURL, userId) {

//   if (!userId) {
//     showPopupMessage("Error", "User ID not found in URL.", false);
//     return;
//   }

//   const apiUrl = `${baseURL}/api/UserWorld/${userId}`;

//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) throw new Error("Failed to fetch user data");

//     const user = await response.json();

//     // Fill inputs
//     document.getElementById("fullname").value = user.fullName || "";
//     document.getElementById("email").value = user.email || "";
//     document.getElementById("username").value = user.username || "";
//     document.getElementById("password").value = user.password || "";
//     document.getElementById("dob").value = user.dateOfBirth?.split("T")[0] || "";
//     document.getElementById("contact").value = user.contactNumber || "";
//     document.getElementById("address").value = user.address || "";
//     document.getElementById("profession").value = user.profession || "";
//     document.getElementById("about").value = user.aboutYourself || "";

//     // Nationality / Country / State / City
//         if (user.nationalityId) document.getElementById("nationality").value = user.nationalityId;
//         if (user.countryId) document.getElementById("country").value = user.countryId;
//         if (user.stateId) document.getElementById("state").value = user.stateId;
//         if (user.cityId) document.getElementById("city").value = user.cityId;

//     // Gender
//     if (user.gender) {
//       //const genderValue = user.gender.toString(); // Expecting 1, 2, or 3

//         let genderText = "";

//         switch (user.gender) {
//         case 1:
//             genderText = "Male";
//             break;
//         case 2:
//             genderText = "Female";
//             break;
//         case 3:
//             genderText = "Other";
//             break;
//         default:
//             genderText = "";
//         }

//       const genderRadio = document.querySelector(`input[name="gender"][value="${genderText}"]`);
//       if (genderRadio) genderRadio.checked = true;
//     }

//     // Languages Known (checkboxes)
//             if (Array.isArray(user.languagesKnown)) {
//             const langs = user.languagesKnown.map(l =>
//                 typeof l === "string" ? l.toLowerCase() : l.languageName?.toLowerCase()
//             );

//             if (langs.includes("english")) {
//                 document.getElementById("langEnglish").checked = true;
//             }
//             if (langs.includes("hindi")) {
//                 document.getElementById("langHindi").checked = true;
//             }
//             if (langs.includes("marathi")) {
//                 document.getElementById("langMarathi").checked = true;
//             }
//             }

//     // Photo (Optional)
//     if (user.photoFilePath) {
//       const photoPreview = document.getElementById("photoPreview");
//       if (photoPreview) {
//         photoPreview.src = user.photoFilePath;
//       }
//     }

//   } catch (err) {
//     showPopupMessage("Error", "Error loading user: " + err.message, false);
//   }
// }

// function UpdateUser(baseURL, userId) {
 
//     let isValid = true;

//     // Text Fields Validation
//     if (document.getElementById("fullname").value.trim() === "") {
//         document.getElementById("error-fullname").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-fullname").style.display = "none";
//     }

//     if (document.getElementById("email").value.trim() === "") {
//         document.getElementById("error-email").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-email").style.display = "none";
//     }

//     if (document.getElementById("username").value.trim() === "") {
//         document.getElementById("error-username").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-username").style.display = "none";
//     }

//     if (document.getElementById("password").value.trim() === "") {
//         document.getElementById("error-password").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-password").style.display = "none";
//     }

//     if (document.getElementById("dob").value.trim() === "") {
//         document.getElementById("error-dob").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-dob").style.display = "none";
//     }

//     if (document.getElementById("contact").value.trim() === "") {
//         document.getElementById("error-contact_number").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-contact_number").style.display = "none";
//     }


//     // Dropdown Validation
//     if (document.getElementById("nationality").value === "") {
//       document.getElementById("error-nationality").style.display = "block";
//       isValid = false;
//     } else {
//       document.getElementById("error-nationality").style.display = "none";
//     }

//     if (document.getElementById("country").value === "") {
//       document.getElementById("error-country").style.display = "block";
//       isValid = false;
//     } else {
//       document.getElementById("error-country").style.display = "none";
//     }
//     if (document.getElementById("state").value === "") {
//       document.getElementById("error-state").style.display = "block";
//       isValid = false;
//     }else{
//       document.getElementById("error-state").style.display = "none";
//     }

//     if (document.getElementById("city").value === "") {
//       document.getElementById("error-city").style.display = "block";
//       isValid = false;
//     } else {
//       document.getElementById("error-city").style.display = "none";
//     }

//     // Gender (Radio) Validation
//     let genderSelected = document.querySelector('input[name="gender"]:checked');
//     if (!genderSelected) {
//         document.getElementById("error-gender").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-gender").style.display = "none";
//     }

//     // Language (Checkbox) Validation
//     let langSelected = document.querySelectorAll('input[name="language"]:checked');
//     if (langSelected.length === 0) {
//         document.getElementById("error-LK").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-LK").style.display = "none";
//     }

//     // File Validation
//     if (document.getElementById("file").value === "") {
//         document.getElementById("error-file").style.display = "block";
//         isValid = false;
//     } else {
//         document.getElementById("error-file").style.display = "none";
//     }

//     // Submit message if valid
//     if (isValid) {
//         // // Create a user object from the form inputs
//         // const userData = {
//         //   fullname: document.getElementById("fullname").value,
//         //   email: document.getElementById("email").value,
//         //   username: document.getElementById("username").value,
//         //   contact: document.getElementById("contact").value,
//         //   address: document.getElementById("address").value,
//         //   city: document.getElementById("city").value
//         // };
    
//         // // Get old users from localStorage or create new list
//         // let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    
//         // // Add the new user
//         // users.push(userData);
    
//         // // Save back to localStorage
//         // localStorage.setItem("registeredUsers", JSON.stringify(users));
        


//         //Save user details using API
//         // Extract gender (radio buttons)
//         const genderValue = document.querySelector('input[name="gender"]:checked');
//         const gender = genderValue ? (genderValue.value === "Male" ? 1 : genderValue.value === "Female" ? 2 : 3) : null;

//         // Extract languages known (checkboxes)
//         const languageCheckboxes = document.querySelectorAll('input[name="language"]:checked');

//         const languagesKnown = Array.from(languageCheckboxes).map(lang => {
//             switch (lang.value) {
//                 case "English": return 1;
//                 case "Hindi": return 2;
//                 case "Marathi": return 3;
//                 default: return null;
//             }
//         }).filter(id => id !== null);

//         // Get file path (Note: browser only provides fake path, usually not useful for server)
//         const photoInput = document.getElementById("file");
//         const photoFilePath = photoInput.value; // Browser security blocks full path

//         const payload = {
//             fullName: document.getElementById("fullname").value,
//             email: document.getElementById("email").value,
//             username: document.getElementById("username").value,
//             password: document.getElementById("password").value,
//             dateOfBirth: new Date(document.getElementById("dob").value).toISOString(),
//             contactNumber: document.getElementById("contact").value,
//             address: document.getElementById("address").value,
//             nationalityId: document.getElementById("nationality").value,
//             countryId: document.getElementById("country").value,
//             stateId: document.getElementById("state").value,
//             cityId: document.getElementById("city").value,
//             profession: document.getElementById("profession").value,
//             photoFilePath: photoFilePath,  // Note: might need to upload file separately
//             aboutYourself: document.getElementById("about").value,
//             languagesKnown: languagesKnown
//         };

//          const apiUrl = `${baseURL}/api/UserWorld/${userId}`;

//        fetch(apiUrl, { 
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(payload)
//         })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(err => { throw err; });
//             }
//             return response.json();
//         })
//         .then(data => {
                
//             //Read userId from URL to show success message
//             const urlParams = new URLSearchParams(window.location.search);
//             const userId = urlParams.get("userId");

//             // Refresh page with same userId after 1 second
//             setTimeout(() => {
//                 window.location.href = `UserEdit.html?userId=${userId}`;
//             }, 500);

//             showPopupMessage("Success", "User details updated successfully!", true);

//                 //document.getElementById("registration_form").reset();
//             })
//             .catch(error => {
//                 showPopupMessage("Error", "Failed to update user." + error, false);
//             });
//     }
//     else
//     {
//         showPopupMessage("Error", "Please enter values for required fields", false);
//     }
// }


// -------------------------
// Load dropdown list helpers
// -------------------------
async function loadNationalities(baseURL) {
    try {
        const res = await fetch(`${baseURL}/api/UserWorld/NationalityList`);
        if (!res.ok) throw new Error("Nationality list load failed");
        const list = await res.json();
        const sel = document.getElementById("nationality");
        if (!sel) return;
        sel.innerHTML = '<option value="">--Select Nationality--</option>';
        list.forEach(n => {
            const o = document.createElement("option");
            o.value = n.nationalityId;
            o.textContent = n.nationalityName;
            sel.appendChild(o);
        });
    } catch (e) {
        console.error(e);
        showPopupMessage("Error", "Nationality list load failed", false);
    }
}

async function loadCountries(baseURL) {
    const res = await fetch(`${baseURL}/api/UserWorld/CountryList`);
    if (!res.ok) throw new Error("Country list load failed");
    const list = await res.json();
    const sel = document.getElementById("country");
    if (!sel) return;
    sel.innerHTML = '<option value="">--Select Country--</option>';
    list.forEach(c => {
        const o = document.createElement("option");
        o.value = c.countryId;
        o.textContent = c.countryName;
        sel.appendChild(o);
    });
}

async function loadStates(baseURL, countryId) {
    if (!countryId) return;
    const res = await fetch(`${baseURL}/api/UserWorld/StateList/${countryId}`);
    if (!res.ok) throw new Error("State list load failed");
    const list = await res.json();
    const sel = document.getElementById("state");
    if (!sel) return;
    sel.innerHTML = '<option value="">--Select State--</option>';
    list.forEach(s => {
        const o = document.createElement("option");
        o.value = s.stateId;
        o.textContent = s.stateName;
        sel.appendChild(o);
    });
}

async function loadCities(baseURL, stateId) {
    if (!stateId) return;
    const res = await fetch(`${baseURL}/api/UserWorld/CityList/${stateId}`);
    if (!res.ok) throw new Error("City list load failed");
    const list = await res.json();
    const sel = document.getElementById("city");
    if (!sel) return;
    sel.innerHTML = '<option value="">--Select City--</option>';
    list.forEach(c => {
        const o = document.createElement("option");
        o.value = c.cityId;
        o.textContent = c.cityName;
        sel.appendChild(o);
    });
}

// -------------------------
// Populate form flow
// -------------------------
document.addEventListener("DOMContentLoaded", async () => {
    const baseURL = "http://localhost:5122";
    const userId = new URLSearchParams(window.location.search).get("userId");

    await loadNationalities(baseURL);
    await loadCountries(baseURL);

    document.getElementById("country").addEventListener("change", e => {
        loadStates(baseURL, e.target.value);
    });
    document.getElementById("state").addEventListener("change", e => {
        loadCities(baseURL, e.target.value);
    });

    await OnPageLoadShowUserDetailsInForm(baseURL, userId);

    document.getElementById("submit").addEventListener("click", e => {
        e.preventDefault();
        UpdateUser(baseURL, userId);
    });
});

// -------------------------
// Show User Details
// -------------------------
 async function OnPageLoadShowUserDetailsInForm(baseURL, userId) {
    if (!userId) {
        showPopupMessage("Error", "User ID not found in URL.", false);
        return;
    }

    try {
        const res = await fetch(`${baseURL}/api/UserWorld/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const user = await res.json();

        document.getElementById("fullname").value = user.fullName || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("username").value = user.username || "";
        document.getElementById("password").value = user.password || "";
        document.getElementById("dob").value = user.dateOfBirth?.split("T")[0] || "";
        document.getElementById("contact").value = user.contactNumber || "";
        document.getElementById("address").value = user.address || "";
        document.getElementById("profession").value = user.profession || "";
        document.getElementById("about").value = user.aboutYourself || "";

                // Nationality
        if (user.nationalityId?.nationalityId) {
            document.getElementById("nationality").value = user.nationalityId.nationalityId;
        }

        // Country
        if (user.countryId?.countryId) {
            document.getElementById("country").value = user.countryId.countryId;
            await loadStates(baseURL, user.countryId.countryId);
        }

        // State
        if (user.stateId?.stateId) {
            document.getElementById("state").value = user.stateId.stateId;
            await loadCities(baseURL, user.stateId.stateId);
        }

        // City
        if (user.cityId?.cityId) {
            document.getElementById("city").value = user.cityId.cityId;
        }




        // Gender
        if (user.gender) {
            const genderMap = { 1: "Male", 2: "Female", 3: "Other" };
            const g = genderMap[user.gender];
            if (g) {
                const genderRadio = document.querySelector(`input[name="gender"][value="${g}"]`);
                if (genderRadio) genderRadio.checked = true;
            }
        }

        // Languages
        if (Array.isArray(user.languagesKnown)) {
            const langs = user.languagesKnown.map(l =>
                typeof l === "string" ? l.toLowerCase() : l.languageName?.toLowerCase()
            );
            document.getElementById("langEnglish").checked = langs.includes("english");
            document.getElementById("langHindi").checked = langs.includes("hindi");
            document.getElementById("langMarathi").checked = langs.includes("marathi");
        }

        if (user.photoPath) {
    document.getElementById("photoPreview").src = user.photoPath;
}
    } catch (err) {
        showPopupMessage("Error", "Error loading user: " + err.message, false);
    }
}

// -------------------------
// Update User
// -------------------------
function UpdateUser(baseURL, userId) {
    let isValid = true;

    // Required text fields validation
    const requiredFields = ["fullname", "email", "username", "password", "dob", "contact"];
    requiredFields.forEach(id => {
        const el = document.getElementById(id);
        const err = document.getElementById(`error-${id}`);
        if (el && el.value.trim() === "") {
            if (err) err.style.display = "block";
            isValid = false;
        } else {
            if (err) err.style.display = "none";
        }
    });

    // Dropdowns validation
    ["nationality", "country", "state", "city"].forEach(id => {
        const el = document.getElementById(id);
        const err = document.getElementById(`error-${id}`);
        if (el && el.value === "") {
            if (err) err.style.display = "block";
            isValid = false;
        } else {
            if (err) err.style.display = "none";
        }
    });

    // Gender validation
    let genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        document.getElementById("error-gender").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("error-gender").style.display = "none";
    }

    // Languages validation
    let langSelected = document.querySelectorAll('input[name="language"]:checked');
    if (langSelected.length === 0) {
        document.getElementById("error-LK").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("error-LK").style.display = "none";
    }

    // File (optional)
    const fileEl = document.getElementById("file");

    if (isValid) {
        const genderValue = genderSelected ? genderSelected.value : null;
        const gender = genderValue === "Male" ? 1 : genderValue === "Female" ? 2 : 3;

        const languageCheckboxes = document.querySelectorAll('input[name="language"]:checked');
        const languagesKnown = Array.from(languageCheckboxes).map(lang => {
            switch (lang.value) {
                case "English": return 1;
                case "Hindi": return 2;
                case "Marathi": return 3;
                default: return null;
            }
        }).filter(id => id !== null);

        // ✅ Correct payload
        const payload = {
            fullName: document.getElementById("fullname").value,
            email: document.getElementById("email").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            dateOfBirth: new Date(document.getElementById("dob").value).toISOString(),
            contactNumber: document.getElementById("contact").value,
            address: document.getElementById("address").value,
            nationalityId: parseInt(document.getElementById("nationality").value),
            countryId: parseInt(document.getElementById("country").value),
            stateId: parseInt(document.getElementById("state").value),
            cityId: parseInt(document.getElementById("city").value),
            profession: document.getElementById("profession").value,
            photoPath: fileEl && fileEl.value !== "" ? fileEl.value : "",
            aboutYourself: document.getElementById("about").value,
            gender: gender,
            languagesKnown: languagesKnown   // ✅ int array only
        };

        const apiUrl = `${baseURL}/api/UserWorld/${userId}`;

        fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(() => {
            showPopupMessage("Success", "User updated successfully.", true);
            setTimeout(() => {
                window.location.href = "userdata.html"; // ✅ Redirect after success
            }, 1500);
        })
        .catch(err => {
            console.error(err);
            showPopupMessage("Error", "Error updating user.", false);
        });
    }
}

// -------------------------
// Popup helper
// -------------------------
function showPopupMessage(title, message, isSuccess) {
    alert(`${title}: ${message}`);
}



    
