// Recieve messages
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {

//alert("content script: " + request.action);	
//alert("content script: " + request.greeting);

// textarea JS example: http://code.google.com/p/chrome-textarea-formatter/source/browse/trunk/src/script.js

var replaceText;
if (request.greeting) {
	replaceText = request.greeting;
} else {
	document.activeElement.select();
	replaceText = document.activeElement.value;
}

//alert(replaceText);

var replacedText;
if (request.action == 1) {
	replacedText = encryptText(replaceText);
} else {
	replacedText = decryptText(replaceText);
}

replaceIt(document.activeElement, replacedText);


document.activeElement.select();


//var textArea = document.activeElement;
// Required for Google Calendar to notice the new value and save the changes
//$(textArea).blur();
//$(textArea).focus();
//$(textArea).sendkeys('{enter}');

if (request.greeting == "hello")
   sendResponse({farewell: "laters"});
else
  sendResponse({farewell: "byebye"}); // snub them.    
  
});






function replaceIt(txtarea, newtxt) {
  $(txtarea).val(
        $(txtarea).val().substring(0, txtarea.selectionStart)+
        newtxt+
        $(txtarea).val().substring(txtarea.selectionEnd)
   );  
}









function encryptText(text) {
 
 var pu = new getPublicKey(publicKey);
 
 if (pu.vers == -1) {
	return;
 }
 //variables: pu.vers; pu.user;

 var pubkey = pu.pkey.replace(/\n/g,'');
 
 if(pu.keyid.length != 16)
 {
   alert('Invalid Key Id');
   return;
 } 

 var keytyp = -1;
 if(pu.type == 'ELGAMAL') keytyp = 1;
 if(pu.type == 'RSA')     keytyp = 0;
 if(keytyp == -1)
 {
   alert('Unsupported Key Type');
   return;
 } 

 return doEncrypt(pu.keyid, keytyp, pubkey, text);

}








// Holds data when private key decoded with password on first call to doDecrypt()
var dk = [];
var pk = [];
var qk = [];
var uk = [];
var seskey = '';

function decryptText(text) { 
 doDecrypt(pk, qk, dk, uk, privateKey);
 return doDecrypt(pk, qk, dk, uk, text);
}