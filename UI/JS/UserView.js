

async function fetchUserById() {
  console.log("fetchUserById started...");

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");

  if (!userId) {
    showPopupMessage("Error", "User ID not found in URL.", false);
    return;
  }

  const baseURL = "http://localhost:5122";
  const apiUrl = `${baseURL}/api/UserWorld/${userId}`;

  try {
    const response = await fetch(apiUrl);
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user. Status: ${response.status}, ${errorText}`);
    }

    const user = await response.json();
    console.log("User data:", user);

    // Fill form fields with data
    document.getElementById("fullName").value = user.fullName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("dob").value = user.dateOfBirth?.split("T")[0] || "";
    document.getElementById("contact").value = user.contactNumber || "";
    document.getElementById("address").value = user.address || "";

  //
    document.getElementById("nationality").value = user.nationalityId?.nationalityName || "";
    document.getElementById("country").value = user.countryId?.countryName || "";
    document.getElementById("state").value = user.stateId?.stateName || "";
    document.getElementById("city").value = user.cityId?.cityName || "";

    // Gender
    if (user.gender === 1) document.getElementById("genderMale").checked = true;
    else if (user.gender === 2) document.getElementById("genderFemale").checked = true;
    else if (user.gender === 3) document.getElementById("genderOther").checked = true;

    // Profession
    document.getElementById("profession").value = user.profession || "";

    // Languages Known ✅ fixed mapping
    if (Array.isArray(user.languagesKnown)) {
      const langs = user.languagesKnown.map(l => l.languageName?.toLowerCase());

      if (langs.includes("english")) document.getElementById("langEnglish").checked = true;
      if (langs.includes("hindi")) document.getElementById("langHindi").checked = true;
      if (langs.includes("marathi")) document.getElementById("langMarathi").checked = true;
    }

    // Photo
    document.getElementById("photo").src = user.photoPath || "../Multimedia/sample-user.jpg";

    // About
    document.getElementById("about").value = user.aboutYourself || "";

  } catch (err) {
    console.error("Error loading user:", err);
    showPopupMessage("Error", "Error loading user: " + err.message, false);
  }
}

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", fetchUserById);
