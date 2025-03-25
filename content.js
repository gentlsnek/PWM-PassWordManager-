document.addEventListener("click", function(event) {
    let target = event.target;

    // Check if the clicked element is a password field
    if (target.tagName === "INPUT" && target.type === "password") {
        showPasswordButton(target);
    }
});

function showPasswordButton(passwordField) {
    // Remove existing button if it exists
    let existingBtn = document.getElementById("password-gen-btn");
    if (existingBtn) existingBtn.remove();

    // Create a floating button
    let button = document.createElement("button");
    button.innerText = "🔑 Generate";
    button.id = "password-gen-btn";
    button.style.position = "absolute";
    button.style.left = (passwordField.getBoundingClientRect().left + window.scrollX + passwordField.offsetWidth + 5) + "px";
    button.style.top = (passwordField.getBoundingClientRect().top + window.scrollY) + "px";
    button.style.padding = "5px 10px";
    button.style.backgroundColor = "#0074f8";
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";

    document.body.appendChild(button);

    // Handle password generation
    button.addEventListener("click", function() {
        let password = generatePassword(12); // Default 12-character password
        passwordField.value = password;
        button.remove(); // Remove button after generating password
    });
}

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
