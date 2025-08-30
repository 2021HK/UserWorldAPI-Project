
//Confirm Box Function
function showConfirmPopup(title, message, onConfirm) {
    // Remove existing popup if any
    const existing = document.getElementById("customPopup");
    if (existing) existing.remove();

    // Create overlay
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

    // Create box
    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "20px 30px";
    box.style.borderRadius = "8px";
    box.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    box.style.textAlign = "center";
    box.style.maxWidth = "400px";
    box.style.width = "100%";
    box.style.borderLeft = "6px solid #007BFF";

    // Add content
    box.innerHTML = `
        <h2 style="margin-top: 0;">${title}</h2>
        <p>${message}</p>
        <div style="margin-top: 20px;">
            <button id="popupConfirmBtn" style="
                padding: 8px 16px;
                background: #007BFF;
                color: white;
                border: none;
                border-radius: 4px;
                margin-right: 10px;
                cursor: pointer;
            ">Confirm</button>
            <button id="popupCancelBtn" style="
                padding: 8px 16px;
                background: #fca130;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Cancel</button>
        </div>
    `;

    popup.appendChild(box);
    document.body.appendChild(popup);

    // Handle buttons
    document.getElementById("popupConfirmBtn").onclick = function () {
        document.getElementById("customPopup").remove();
        onConfirm(true);
    };
    document.getElementById("popupCancelBtn").onclick = function () {
        document.getElementById("customPopup").remove();
        onConfirm(false);
    };
}