document.getElementById("generate").addEventListener("click", async () => {
    let website = document.getElementById("website").value;
    let username = document.getElementById("username").value;
    let length = parseInt(document.getElementById("length").value);
    let masterPassword = prompt("Enter Master Password to Encrypt:"); // Ask for master password

    if (!website || !username || !length || !masterPassword) {
        alert("Please fill in all fields and enter a Master Password!");
        return;
    }

    // Generate a password
    let password = generatePassword(length);
    document.getElementById("password").value = password;

    // Store it automatically
    await savePassword(website, username, password, masterPassword);
    alert("Password generated and stored securely!");
});


document.getElementById("generate").addEventListener("click", function() {
    let length = document.getElementById("length").value;
    length = length ? parseInt(length) : 12; // Default length is 12 if empty

    let password = generatePassword(length);
    document.getElementById("password").value = password;

    // Hide "Generate" button and show "Copy" & "Reset" buttons
    document.getElementById("generate").style.display = "none";
    document.getElementById("password").style.display = "block";
    document.getElementById("copy").style.display = "block";
    document.getElementById("reset").style.display = "block";
});

document.getElementById("copy").addEventListener("click", function() {
    let passwordField = document.getElementById("password");
    if (passwordField.value) {
        navigator.clipboard.writeText(passwordField.value)
            .then(() => alert("Password copied to clipboard!"))
            .catch(err => console.error("Error copying password: ", err));
    }
});

document.getElementById("reset").addEventListener("click", function() {
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

    password = password.sort(() => Math.random() - 0.5);

    return password.join("");
}


document.getElementById("savePassword").addEventListener("click", async () => {
    let website = document.getElementById("website").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let masterPassword = document.getElementById("masterPassword").value;

    if (!website || !username || !password || !masterPassword) {
        alert("Please fill in all fields!");
        return;
    }

    await savePassword(website, username, password, masterPassword);
    alert("Password saved successfully!");
});

// Retrieve and display passwords
document.getElementById("getPasswords").addEventListener("click", async () => {
    let masterPassword = document.getElementById("masterPassword").value;
    if (!masterPassword) {
        alert("Please enter your master password!");
        return;
    }

    let passwords = await getPasswords(masterPassword);
    let list = document.getElementById("passwordList");
    list.innerHTML = ""; // Clear old results

    passwords.forEach(entry => {
        let li = document.createElement("li");
        li.textContent = `🌐 ${entry.website} | 👤 ${entry.username} | 🔑 ${entry.password || "Incorrect master password!"}`;
        list.appendChild(li);
    });
});

