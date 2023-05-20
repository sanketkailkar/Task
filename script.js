const userInput = document.getElementById("userInput");
const inputBoxMessage = document.getElementById("inputBoxMessage");
const emptyMsg = document.querySelector(".emptyMsg");
const inputMsg = document.querySelector(".inputMsg");

const tableBody = document.querySelector(".myTableBody");
const loaderDiv = document.getElementById("loaderDiv");
const loader = document.querySelector(".loader");

const errorDiv = document.querySelector(".errorDiv");
const errorMessage = document.querySelector(".errorMessage");

const cityDiv = document.querySelector(".cityData");
const limit = document.querySelector(".noOfCities");
const warningMessage = document.querySelector(".warningMessage");


const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '18ddbc0c3cmsh78b0478cdd9dbdep1a1712jsn48aba89aa917',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

const removeLoader = () => {
    loaderDiv.className = "fade";
}
const addLoader = () => {
    loaderDiv.classList.remove('fade');
}

const showEmptyMessage = () => {
    emptyMsg.classList.add("emptyMessage");
}
const hideEmptyMessage = () => {
    emptyMsg.classList.remove("emptyMessage");
}
const showLetterAndNumberMsg = () => {
    inputMsg.classList.add("letterAndNumber");
}
const hideLetterAndNumberMsg = () => {
    inputMsg.classList.remove("letterAndNumber");
}
function inputFocusHandler() {
    userInput.focus();
}

const showErrorMessage = () => {
    errorMessage.classList.remove("hideErrorMessage");
}
const hideErrorMessage = () => {
    errorMessage.classList.add("hideErrorMessage");
}
const showErrorDiv = () => {
    errorDiv.classList.remove("hideErrorDiv");
}
const hideErrorDiv = () => {
    errorDiv.classList.add("hideErrorDiv");
}

const showWarningMessage = () => {
    warningMessage.classList.add("showWarningMessage");
}
const hideWarningMessage = () => {
    warningMessage.classList.remove("showWarningMessage");
}
const showCityData = () => {
    cityDiv.classList.remove("hideCityData");
}
const hideCityData = () => {
    cityDiv.classList.add("hideCityData");
}

const showMyTableBody = () => {
    tableBody.classList.remove("hideMyTableBody");
}
const hideMyTableBody = () => {
    tableBody.classList.add("hideMyTableBody");
}


function userInputValidation(inputText) {
    const regexLetters = /^[A-Za-z0-9]+$/;
    hideEmptyMessage();
    hideLetterAndNumberMsg();

    if (inputText.value === "") {
        showEmptyMessage();
        inputFocusHandler();
    }
    else if (inputText.value.match(regexLetters)) {
        return true;
    } else {
        showLetterAndNumberMsg();
        userInput.removeEventListener("change", true);
        // userInput.removeEventListener("change", inputFocusHandler, true);
    }
};

function limitValueValidation(limit) {
    hideWarningMessage();
    let limitValue = Number.parseInt(limit.value);
    const regexNumber = /^[0-9]+$/;
    if (limitValue === 0 || limitValue > 10) {
        showWarningMessage();
    } else if (limit.value.match(regexNumber)) {
        return true;
    } else {
        showWarningMessage();
        userInput.removeEventListener("change", true);
    }
};

removeLoader();
hideErrorMessage();
showMyTableBody();

const userInputHandler = async function (e) {
    let value = e.target.value;
    let limitValue = limit.value;

    userInputValidation(userInput);

    if (limitValue > 10) {
        showWarningMessage();
    } else {
        hideWarningMessage();
        if (value !== "") {
            hideErrorDiv();
            try {
                hideErrorDiv();
                addLoader();

                const params = { countryIds: 'IN', namePrefix: 'del', limit: '5' };

                const response = await fetch(`${url}?namePrefix=${value}&limit=${limitValue}`, options);
                if (response.ok) {
                    const result = await response.json();
                    const resultData = result.data;
                    const rowResult = makeRows(resultData);

                    removeLoader();
                    showMyTableBody();
                    tableBody.innerHTML = rowResult;
                    showCityData();

                } else {
                    removeLoader();
                    // hideMyTableBody();
                    showErrorDiv();
                    showErrorMessage();

                }
            } catch (error) {
                console.error(error);
            }
        } else {
            hideMyTableBody();
            showErrorDiv();
        }
    }
};

function makeRows(data) {
    let rows = "";
    if (data.length > 0) {
        hideErrorDiv();

        for (let i = 0; i < data.length; i++) {
            const valueOfData = data[i];
            const placeName = valueOfData.city;
            const country = valueOfData.country;
            const countryCode = valueOfData.countryCode;

            const row = `<tr>
                        <td>${i + 1}</td>
                        <td>${placeName}</td>
                        <td id="tdImg"><img src="https://flagsapi.com/${countryCode}/flat/24.png"> ${country}</td>
                    </tr>`
            rows += row;
        }
        return rows;

    } else {
        hideMyTableBody();
        showErrorDiv();
        showErrorMessage();
        console.log("error");
    }
    return rows;
};


const keypressHandler = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault;
        userInputValidation(userInput);
        limitValueValidation(limit);
    } else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        inputFocusHandler();
    } else if (userInput.value === "" && e.key === 'Enter') {
        showEmptyMessage();
        inputFocusHandler();
    } else if (userInput.value !== "" && limit.value === "") {

    }
};

userInput.addEventListener("change", userInputHandler);
document.addEventListener('keydown', keypressHandler)