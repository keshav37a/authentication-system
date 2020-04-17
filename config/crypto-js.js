const CryptoJS = require("crypto-js");

const secretKey = "the-game-is-on";
 
// Encrypt
module.exports.encrypt = function(string){
    let ciphertext = CryptoJS.AES.encrypt(string, secretKey).toString();
    return ciphertext;
}

//Decrypt
module.exports.decrypt = function(ciphertext){
    let bytes  = CryptoJS.AES.decrypt(ciphertext, secretKey);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log('in decrypt: ', originalText);
    return originalText.toString();
}
 


 
