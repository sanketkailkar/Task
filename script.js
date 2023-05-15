const userInput = document.getElementById("userInput");
const tableBody = document.getElementById("myTableBody");
const loader = document.querySelector(".loader");
const errorDiv = document.getElementById("errorDiv");
const errorMessage = document.getElementById("errorMessage");
const cityDiv = document.querySelector(".cityData");
const limit = document.getElementById("noOfCities");
const warningMessage = document.querySelector(".warningMessage");


const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '18ddbc0c3cmsh78b0478cdd9dbdep1a1712jsn48aba89aa917',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

userInput.addEventListener("change", async function (e) {
    let value = e.target.value;
    let limitValue = limit.value;

    if (limitValue > 10) {
        warningMessage.innerHTML = "Put number between 1 to 10 only."
    } else {
        cityDiv.style.display = "none";
        warningMessage.innerHTML = "";
        if (value !== "") {
            errorDiv.style.display = "none";
            errorMessage.innerHTML = "";
            try {
                errorDiv.style.display = "none";
                errorMessage.innerHTML = "";

                loader.style.display = "block";

                const params = { countryIds: 'IN', namePrefix: 'del', limit: '5' };

                const response = await fetch(`${url}?namePrefix=${value}&limit=${limitValue}`, options);
                if (response.ok) {
                    const result = await response.json();
                    const resultData = result.data;
                    const rowResult = makeRows(resultData);

                    loader.style.display = "none";
                    tableBody.innerHTML = rowResult;
                    cityDiv.style.display = "block";
                } else {
                    errorDiv.style.display = "flex";
                    errorMessage.innerHTML = "No result found";
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            errorDiv.style.display = "flex";
            errorMessage.innerHTML = "Search searching";
        }
    }
});

function makeRows(data) {
    let rows = "";
    if (data.length > 0) {
        errorDiv.style.display = "none";
        errorMessage.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            const valueOfData = data[i];
            const placeName = valueOfData.city;
            const country = valueOfData.country;
            const countryCode = valueOfData.countryCode;

            const row = `<tr>
                        <td>${i + 1}</td>
                        <td>${placeName}</td>
                        <td id="tdImg"><img src="https://flagsapi.com/${countryCode}/flat/32.png"> ${country}</td>
                    </tr>`
            rows += row;
        }
        return rows;

    } else {
        errorDiv.style.display = "flex";
        errorMessage.innerHTML = "No result found";
    }
    return rows;
};

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        userInput.focus();
    }
});