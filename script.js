// main function to get the weather data fetching
// the endpoint alongside with the API Key
async function getWeatherData (location) {

  try {

    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?key=WKFYJE6TRZS5YY56FZ335YXX2`);

    const weatherData = await response.json();

    // self-explanatory
    const weatherTemp = weatherData.days[0].hours[0].temp;
    const weatherIcon = weatherData.days[0].icon;
    const weatherDesc = weatherData.days[0].description;
    const name = weatherData.resolvedAddress;

    console.log(weatherData)

    return { weatherTemp, weatherIcon, weatherDesc, name };

  } catch {

    console.error("Wrong API key or given location.");

  }

};

// getting the gif through endpoint and API Key
async function getGif (gif) {

  try {

    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=RYiFAV3Kl01C4ynbn7YjuTGySEWVeytT&s=${gif}`, {mode: 'cors'});

    const gifData = await response.json();
    
    const gifElement = gifData.data.images.original.url;

    return { gifElement };

  } catch {

    console.error("Wrong API key or given entry.");

  }

};

// DOM
const searchBar = document.getElementById('search-bar');
const myForm = document.querySelector('.my-form');

// displays the weather details:
// how many degrees are
function displayWeatherDetails () {

  const regex = /([A-Za-z]|[0-9]{5})+/;
  const searchContainer = document.querySelector('.search-bar-container');
  const tempContainer = document.querySelector('.temp-container');

  if (regex.test(searchBar.value)) {

    // this async func is created in order for
    // JS be able to pull the three returned data from
    // async getWeatherData();
    async function showWeather (location) {

      const loading = document.getElementById('loading');

      // re-styling to get rid of the error styling
      searchBar.style.backgroundColor = '#642dd1';
      searchBar.style.border = 'none';

      // clears the container to avoid duplication
      tempContainer.innerHTML = "";

      // displays the loading animation
      // while JS fetchs the API
      loading.style.display = 'block';

      // fetch the weather data
      const data = await getWeatherData(location);

      if(data) {

        // hides the loading animation
        // once the data is grabbed
        loading.style.display = 'none';

        // clears the user input
        searchBar.value = '';

        // originally is 100px, so it needs to be
        // reduced in order for the additional elements
        // be centered
        searchContainer.style.marginBlock = "10px";

        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';

        const temp = document.createElement('h1');
        temp.style.color = '#fff';
        temp.innerHTML = `${Math.floor(data.weatherTemp)}°F`

        // adding the button to toggle the degree reading
        const changeTemp = document.createElement('button');
        changeTemp.className = 'buttons';
        changeTemp.id = 'change-temp';
        changeTemp.innerHTML = 'Change Temp';

        const locationId = document.createElement('p');
        locationId.className = "location-id";
        locationId.innerHTML = `<strong>${data.name}</strong>`

        const description = document.createElement('p');
        description.className = "temp-description";
        description.textContent = `${data.weatherDesc}`;

        wrapper.appendChild(temp);
        wrapper.appendChild(changeTemp);
        tempContainer.appendChild(wrapper);
        tempContainer.appendChild(locationId);
        tempContainer.appendChild(description);
        tempContainer.style.marginBlock = "40px";

        changeTemp.addEventListener('click', () => {

          const farenheitCondition = temp.innerHTML === `${Math.floor(data.weatherTemp)}°F`
          const tempInF = Math.floor(data.weatherTemp);

          if (farenheitCondition) {
            temp.innerHTML = `${Math.floor((tempInF - 32) * 5/9)}°C`
          } else {
            temp.innerHTML = `${Math.floor(data.weatherTemp)}°F`
          }
        
        });

        displayGif(data.weatherIcon);

      } else {

        // hides the loading animation
        // once the data is grabbed
        loading.style.display = 'none';

        // some invalid styling to notify the user
        searchBar.style.backgroundColor = '#ff5454';
        searchBar.style.border = '3px solid #ff0000';

        // originally is 100px, so it needs to be
        // reduced in order for the additional elements
        // be centered
        searchContainer.style.marginBlock = "10px";

        const errorMsg = document.createElement('h3');
        errorMsg.className = "error";
        errorMsg.innerHTML = `<span>${searchBar.value}</span> is not a valid location.`

        tempContainer.appendChild(errorMsg);

        displayGif("dead emoji");

      }

    }; // end of showWeather();

    showWeather(searchBar.value);

  }
};

// displays gifs according to the
// weather conditions
function displayGif (condition) {

  async function showGif () {

    const data = await getGif(condition);

    if (data) {

      const gifContainer = document.querySelector('.gif-container');

      gifContainer.innerHTML = '';

      const img = document.createElement('img');
      img.style.width = "100px";
      img.style.borderRadius = "10px";
      img.src = data.gifElement;

      gifContainer.appendChild(img);

    }
    
  };

  showGif(condition);

};

myForm.addEventListener('submit', async (event) => {

  event.preventDefault();

  displayWeatherDetails();

});