const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set circle color to grey by default
setIndicator("#ccc");

// handleSlider function password length ko UI par dikhata h
function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    // isse code se slider ka sirf slided portion colored hoga baki remaining portion jispe humne slider thumb slide 
    // ni kiya h so as to choose a particular length of the password that will hhave the default color that is being set
    // for it not the color of the slider
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    //using css property in js to change the color of idicator acc to password
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0,9);
}

function getRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97,123));
}

function getRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy wala span/text visible which will be removed after 2 sec using timeout below
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    // Fisher Yates method
    for(let i=array.length-1; i>0; i--){
        // random index find kiya is array me, i+1 isliye kiya h kyoki math.random 0 se 1 ke bich me random
        // index generate arta h par hume array ki length tak chahiye to i+1 karne se range ho jayegi 0 se 
        // array ki length tak in which 0 is inclusive length is exclusive, for ex- 0->6 6 is exclusive so range
        // will be 0->5
        const j = Math.floor(Math.random() * (i+1));
        // fir us random index pe jo pada h usse i pe jo pada h use swap kar diya
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }


    let str="";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
          checkCount++;
    });

    // agar password ki length total checkboxes se kam h to use uske equal kardo
    // agar password ki length 1 krdo or charo checkoxes checked ho to to length atleast 4 to honi chahiye to 
    // agar length 4 se bhi kam h to use checkcount ki value ke barabar banado jese ki 4 bnado
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // jab koi checkbox checked na ho
    if(checkCount == 0) 
       return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // ab naye password ko generate karte h

    console.log("Starting the Journey");
    //sabse pehle purane password ko hata diya
     password = ""; 
    
     //  ab password e chize dal rhe h
    //  if(uppercaseCheck.checked){
    //     password+=getRandomUppercase();
    //  }
    //  if(lowercaseCheck.checked){
    //     password+=getRandomLowercase();
    //  }
    //  if(numbersCheck.checked){
    //     password+=getRandomNumber();
    //  }
    //  if(symbolsCheck.checked){
    //     password+=generateSymbol();
    //  }

    // ek array bana liya h jisme saare functions h uppercase lowercase etc wale sothat randomly call 
    // kar sake ki uppercase use kare ki ab lowercase ki numbers ki symbols etc 
    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(getRandomUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(getRandomLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(getRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // jo checkboxes checked h wo chize to ayegi hi password me
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");

    // ab badme bache hue password me kuch bhi aa sakta jo iske zariye dala jayega
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        // funcArr me jo elements h unse hi bacha password banega to unko randomly funcArr se uthake password
        // me daal diya
        password += funcArr[randIndex]();
   }
   console.log("Remaing addition done");

    // shuffling the password   
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show password on UI
    passwordDisplay.value= password;
    console.log("UI addition done");
    // calculate strength
    calcStrength();


});
