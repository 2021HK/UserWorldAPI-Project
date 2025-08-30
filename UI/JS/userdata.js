
const baseURL = "http://localhost:5122";
// Global list of users
let userList = [];

// Fetch all users from API
async function fetchUsers() {
    try {
        const response = await fetch(`${baseURL}/api/UserWorld`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            showPopupMessage("Error", "Could not load user data. <br>Status: " + response.status, false);
            return;
        }

        userList = await response.json();
        console.log("Users fetched:", userList);

        const tbody = document.querySelector("table tbody");
        tbody.innerHTML = "";

        userList.forEach(user => {
            const row = document.createElement("tr");

            row.innerHTML = `
            
                <td data-label="Name">${user.fullName}</td>
                <td data-label="Username">${user.username}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Contact Number">${user.contactNumber}</td>
                        <td data-label="City">${user.cityId?.cityName || ''}</td>
                
                <td>
                    <a href="UserEdit.html?userId=${user.id}">Edit</a> |
                    <a href="UserView.html?userId=${user.id}">Details</a> |
                    <a href="#" onclick="deleteUser('${user.id}')">Delete</a>
                </td>
            `;
             // 
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        showPopupMessage("Error", "Could not load user data. Server not reachable.", false);
    }
}

// Function to delete a user
async function deleteUser(userId) {
    showConfirmPopup("Confirm Delete", "Are you sure you want to delete this user?", async function (confirmed) {
        if (!confirmed) return;

        try {
            const response = await fetch(`${baseURL}/api/UserWorld/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Delete error:", errorText);
                showPopupMessage("Error", "Failed to delete user.", false);
                return;
            }

            showPopupMessage("Success", "User deleted successfully.", true);
            fetchUsers(); // Refresh after delete
        } catch (error) {
            console.error("Delete error:", error);
            showPopupMessage("Error", "Error while deleting user: " + error, false);
        }
    });
}

// Call fetch on page load
fetchUsers();

