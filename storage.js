// Open IndexedDB Database
function openDatabase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("PasswordManagerDB", 1);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("passwords")) {
                db.createObjectStore("passwords", { keyPath: "website" });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

// Encrypt Data
function encryptData(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

// Decrypt Data
function decryptData(ciphertext, key) {
    try {
        let bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        return null;
    }
}

// Save Password to IndexedDB
async function savePassword(website, username, password, masterPassword) {
    let db = await openDatabase();
    let transaction = db.transaction("passwords", "readwrite");
    let store = transaction.objectStore("passwords");

    let encryptedData = encryptData({ username, password }, masterPassword);
    store.put({ website, data: encryptedData });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(event.target.error);
    });
}

// Retrieve Passwords
async function getPasswords(masterPassword) {
    let db = await openDatabase();
    let transaction = db.transaction("passwords", "readonly");
    let store = transaction.objectStore("passwords");

    return new Promise((resolve, reject) => {
        let request = store.getAll();
        request.onsuccess = function () {
            let decryptedPasswords = request.result.map(entry => {
                let decryptedData = decryptData(entry.data, masterPassword);
                return decryptedData ? { website: entry.website, ...decryptedData } : { website: entry.website, username: "???", password: null };
            });
            resolve(decryptedPasswords);
        };
        request.onerror = (event) => reject(event.target.error);
    });
}
