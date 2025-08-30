
function showPopupMessage(title, message, isSuccess = true) {
    // Remove existing popup if any
    const existing = document.getElementById("customPopup");
    if (existing) existing.remove();

    // Create popup wrapper
    const popup = document.createElement("div");
    popup.id = "customPopup";
    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "9999";

    // Create popup box
    const box = document.createElement("div");
    box.style.background = "#eee";
    box.style.padding = "20px 30px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    box.style.textAlign = "center";
    box.style.maxWidth = "400px";
    box.style.width = "100%";
    box.style.borderLeft = `6px solid ${isSuccess ? "green" : "red"}`;

    // Set content
    box.innerHTML = `
        <h2 style="margin-top: 0; color: ${isSuccess ? 'green' : 'red'};">${title}</h2>
        <p>${message}</p>
        <button id="popupCloseBtn" style="
            margin-top: 20px;
            padding: 8px 16px;
            background: #fca130;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        ">Close</button>
    `;

    popup.appendChild(box);
    document.body.appendChild(popup);

    // Close button
    document.getElementById("popupCloseBtn").onclick = function () {
        document.getElementById("customPopup").remove();
    };
}

