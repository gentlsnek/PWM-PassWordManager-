// Secure Password Manager with Master Password Integration

// Function to derive a secure key from the master password
async function deriveKey(password, salt) {
    let encoder = new TextEncoder();
    let keyMaterial = await crypto.subtle.importKey(
        "raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
}

// Function to hash and store the master password securely
async function storeMasterPassword(password) {
    let salt = crypto.getRandomValues(new Uint8Array(16));
    let key = await deriveKey(password, salt);
    let hashed = new Uint8Array(await crypto.subtle.digest("SHA-256", await key.exportKey("raw")));
    await browser.storage.local.set({ masterHash: Array.from(hashed), salt: Array.from(salt) });
}

// Function to verify the master password
async function verifyMasterPassword(password) {
    let data = await browser.storage.local.get(["masterHash", "salt"]);
    if (!data.masterHash || !data.salt) return false;
    let key = await deriveKey(password, new Uint8Array(data.salt));
    let hashed = new Uint8Array(await crypto.subtle.digest("SHA-256", await key.exportKey("raw")));
    return hashed.every((byte, i) => byte === data.masterHash[i]);
}

// Function to encrypt data using AES-GCM
async function encryptData(data, password) {
    let salt = crypto.getRandomValues(new Uint8Array(16));
    let iv = crypto.getRandomValues(new Uint8Array(12));
    let key = await deriveKey(password, salt);
    let encoder = new TextEncoder();
    let encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv }, key, encoder.encode(data)
    );
    
    return { salt: Array.from(salt), iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
}

// Function to decrypt data using AES-GCM
async function decryptData(encryptedData, password) {
    let { salt, iv, encrypted } = encryptedData;
    let key = await deriveKey(password, new Uint8Array(salt));
    let decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(encrypted)
    );
    
    let decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// Function to save encrypted data to a file
function saveToFile(filename, data) {
    let blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to read and decrypt file
async function loadFromFile(file, password) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = async function(event) {
            try {
                let encryptedData = JSON.parse(event.target.result);
                let decryptedData = await decryptData(encryptedData, password);
                resolve(decryptedData);
            } catch (error) {
                reject("Failed to decrypt file. Wrong password?");
            }
        };
        reader.readAsText(file);
    });
}

// UI Integration for Master Password Setup
document.getElementById("setMasterPassword").addEventListener("click", async function() {
    let newPassword = document.getElementById("newMasterPassword").value;
    if (!newPassword) {
        console.log("Master password is required!");
        return;
    }
    await storeMasterPassword(newPassword);
    console.log("Master password set successfully!");
    document.getElementById("setupMasterPassword").style.display = "none";
});

// UI Integration for File Export and Import
document.getElementById("export-btn").addEventListener("click", async function() {
    let password = document.getElementById("newMasterPassword").value;
    if (!password || !(await verifyMasterPassword(password))) {
        console.log("Incorrect master password!");
        return;
    }
    let data = JSON.stringify({ "example.com": { username: "user", password: "mypassword" } });
    let encryptedData = await encryptData(data, password);
    saveToFile("passwords.enc", encryptedData);
});

document.getElementById("import-btn").addEventListener("change", function(event) {
    let file = event.target.files[0];
    let password = document.getElementById("newMasterPassword").value;
    if (!password || !verifyMasterPassword(password)) {
        console.log("Incorrect master password!");
        return;
    }
    
    loadFromFile(file, password).then(decryptedData => {
        console.log("Decrypted Data:", decryptedData);
    }).catch(error => console.log(error));
});


//the above code is fuckall chatgpt giberish i dont fucking understand
//find a way to understand this giberish and make it make sense to layman and apply that to project
//need to look into proper benifits of using whatever local storage firefox uses to some other technology like sqlite
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


//add inputs for closing the 2 alerts as well.
//will have to make probsbly 1 function for running both of them 