

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