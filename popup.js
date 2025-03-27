'use strict'


//remove anything to do with alerts they dont scale properly with the size of teh plugin window
//fix the transition from first master passentry to then going to the main page
//master password should only be used once and used to encrypt the password strorage file when it is exported
//need a seperate button for settings on the top right or top left
//should have access to import passwords, export passwords, change master password


document.addEventListener("DOMContentLoaded", async function () {
    let setupMasterPassword = document.getElementById("setupMasterPassword");
    let passwordManager = document.getElementById("passMenue");

    if (!setupMasterPassword || !passwordManager) {
        console.error("UI elements not found. Check popup.html for missing IDs.");
        return;
    }

    let masterPassword = await getMasterPassword();

    if (masterPassword) {
        // Show only the Master Password Setup UI
        setupMasterPassword.style.display = "none";
    } else {
        // Show the full Password Manager UI
        passwordManager.style.display = "block";
    }
});

// Function to get the stored Master Password
async function getMasterPassword() {
    let data = await browser.storage.local.get("masterPassword");
    return data.masterPassword || null;
}

// Function to set a new Master Password
async function setMasterPassword(password) {
    await browser.storage.local.set({ masterPassword: password });
}

// Handle setting Master Password
document.getElementById("setMasterPassword").addEventListener("click", async function () {
    let newPassword = document.getElementById("newMasterPassword").value;

    if (!newPassword) {
        console.log("Please enter a Master Password!");
        return;
    }

    await setMasterPassword(newPassword);
    alert("Master Password set successfully!");

    // Reload the popup to show the full password manager UI
    location.reload();
});

// Generate Password Button
document.getElementById("generate").addEventListener("click", function () {
    let length = document.getElementById("length").value;
    length = length ? parseInt(length) : 12; // Default length is 12 if empty

    let password = generatePassword(length);
    document.getElementById("password").value = password;

    // Hide "Generate" button and show "Copy" & "Reset" buttons
    document.getElementById("generate").style.display = "none";
    document.getElementById("password").style.display = "block";
    document.getElementById("copy").style.display = "block";
    document.getElementById("reset").style.display = "block";
    document.getElementById("savePassword").style.display = "block";
});

// Copy Password to Clipboard
document.getElementById("copy").addEventListener("click", function () {
    let passwordField = document.getElementById("password");
    if (passwordField.value) {
        navigator.clipboard.writeText(passwordField.value)
            .then(() => ("Password copied to clipboard!"))  //remove fucking alerts they suck
            .catch(err => console.error("Error copying password: ", err));
    }
});

// Reset Button
document.getElementById("reset").addEventListener("click", function () {
    // Clear password field
    document.getElementById("website").value = "";
    document.getElementById("username").value = "";
    document.getElementById("length").value = "";
    document.getElementById("password").value = "";

    // Hide "Copy" & "Reset" buttons and show "Generate" button
    document.getElementById("generate").style.display = "block";
    document.getElementById("copy").style.display = "none";
    document.getElementById("reset").style.display = "none";
    document.getElementById("password").style.display = "none";
});

// Generate Secure Password
function generatePassword(length) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

    let password = [
        uppercase[Math.floor(Math.random() * uppercase.length)],
        lowercase[Math.floor(Math.random() * lowercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
    ];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    return password.sort(() => Math.random() - 0.5).join("");
}