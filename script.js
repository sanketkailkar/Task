const userInput = document.getElementById('userInput');
const table = document.getElementById('myTableBody');
const tableBody = document.getElementById('myTableBody');
const errorMessage = document.getElementById('errorMessage');
const footer = document.getElementById('footer');
const cityDiv = document.querySelector('.cityData');

const loader = document.createElement('div');
loader.className = 'loader';

const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '18ddbc0c3cmsh78b0478cdd9dbdep1a1712jsn48aba89aa917',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
};

function makeRows(data) {
    console.log(data);
    let rows = "";
    if (data.length > 0) {
        errorMessage.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const valueData = data[i];
            const placeName = valueData.city;
            const country = valueData.country;
            const countryCode = valueData.countryCode;

            const row = `<tr>
                            <td>${i + 1}</td>
                            <td>${placeName}</td>
                            <td><img src="https://flagsapi.com/${countryCode}/flat/24.png"> ${country}</td>
                        </tr>`
            rows += row;
        }
        // footer.style.display = "flex";
        return rows;
    } else {
        errorMessage.innerHTML = "No result found";
    }
    return rows;
};

userInput.addEventListener('change', async function (e) {
    const value = e.target.value;
    const limitValue = document.getElementById('noOfCities').value;
    if (limitValue > 10) {
        let div = document.createElement('div');
        div.className = 'divCities';
        cityDiv.appendChild(div);
        div.innerHTML = "Put number between 1 to 10 only.";
    } else {
        const params = { countryIds: 'IN', namePrefix: 'del', limit: '5' };
        if (value !== '') {
            try {
                const loaderDiv = document.getElementById('loaderDiv');
                loaderDiv.appendChild(loader);
                loader.style.display = 'block';

                const response = await fetch(`${url}?namePrefix=${value}&limit=${limitValue}`, options);
                if (response.ok) {
                    errorMessage.innerHTML = "";
                    const result = await response.json();
                    const rowResult = makeRows(result.data);

                    loader.style.display = 'none';
                    table.innerHTML = rowResult;
                } else {
                    errorMessage.innerHTML = "No result found";
                }

            } catch (error) {
                console.error(error);
            }
        } else {
            errorMessage.innerHTML = "Start searching";
        }
    }


});

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        userInput.focus();
    }
});