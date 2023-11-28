document.addEventListener("DOMContentLoaded", function () {
    const locationInput = document.getElementById("location-input");
    const searchBtn = document.getElementById("search-btn");
    const geolocationBtn = document.getElementById("geolocation-btn");
    const todaySunrise = document.getElementById("today-sunrise");
    const todaySunset = document.getElementById("today-sunset");
    const todayDawn = document.getElementById("today-dawn");
    const todayDusk = document.getElementById("today-dusk");
    const todayDayLength = document.getElementById("today-day-length");
    const todaySolarNoon = document.getElementById("today-solar-noon");
    const tomorrowSunrise = document.getElementById("tomorrow-sunrise");
    const tomorrowSunset = document.getElementById("tomorrow-sunset");
    const tomorrowDawn = document.getElementById("tomorrow-dawn");
    const tomorrowDusk = document.getElementById("tomorrow-dusk");
    const tomorrowDayLength = document.getElementById("tomorrow-day-length");
    const tomorrowSolarNoon = document.getElementById("tomorrow-solar-noon");
    const errorMessage = document.getElementById("error-message");


async function getWeatherData(latitude, longitude) {
    const apiKey = 'c235e13f8ff263ac15b81791182e92ac';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(weatherUrl);
        const weatherData = await response.json();

        // Updated weather information
        const temperatureElement = document.getElementById('temperature');
        const weatherDescriptionElement = document.getElementById('weather-description');

        if (weatherData.main && weatherData.weather && weatherData.weather.length > 0) {
            const temperature = Math.round(weatherData.main.temp);
            const weatherDescription = weatherData.weather[0].description;

            temperatureElement.textContent = `${temperature}°C`;
            weatherDescriptionElement.textContent = weatherDescription;

            // Called the function to update the background
            updateBackground(document.getElementById('weather-info'), weatherDescription);
        } else {
            temperatureElement.textContent = 'N/A';
            weatherDescriptionElement.textContent = 'N/A';
            temperatureElement.value = '';
            weatherDescriptionElement.value = ''
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Error fetching weather data. Please try again.');
    }
}

function updateBackground(element, weatherDescription) {
    // Converted the weather description to lowercase for case-insensitive matching
    const lowerCaseWeatherDescription = weatherDescription.toLowerCase();

    // Defined conditions and corresponding background images
    const backgroundMappings = {
        'clear sky': 'url("sunny.jpeg")',
        'broken clouds': 'url("clouds.jpg")',
        'light rain': 'url("rain.jpeg")',
        'thunderstorm': 'url("thunder.jpeg")',
        'light snow': 'url("snow.avif")',
        'few clouds': 'url("few clouds.jpeg")',
        'overcast clouds': 'url("overcast.webp")',
        'scattered clouds': 'url("scatclouds.jpeg")',
        'drizzle': 'url("drizzle.jpeg")',
        'shower rain': 'url("drizzle.jpeg")',
        'mist': 'url("mist.jpeg")', 
        'smoke': 'url("smoke.avif")', 
    };

    // Set the background based on the weather description
    const backgroundImage = backgroundMappings[lowerCaseWeatherDescription] || '';

    // Applied background image, prevented repeating, and stretch to cover the container
    element.style.backgroundImage = backgroundImage;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
}


const currentDayElement = document.getElementById('current-day');
const currentDateElement = document.getElementById('current-date');

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const today = new Date();
const dayOfWeek = daysOfWeek[today.getDay()];
const month = monthsOfYear[today.getMonth()];
const dayOfMonth = today.getDate();
const year = today.getFullYear();

currentDayElement.textContent = dayOfWeek;
currentDateElement.textContent = `${dayOfMonth} ${month}, ${year}`;

    //------------------------------------------------------------//
  
    async function getSunriseSunset(latitude, longitude) {
        const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=today`;
        const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0&date=tomorrow`;
    
        try {
            //loading UI
            todaySunrise.textContent = "Loading...";
            todaySunset.textContent = "Loading...";
            todayDawn.textContent = "Loading...";
            todayDusk.textContent = "Loading...";
            todayDayLength.textContent = "Loading...";
            todaySolarNoon.textContent = "Loading...";
            errorMessage.textContent = ""; // Clear the error message
    
            // Fetched today's data
            const todayResponse = await fetch(todayUrl);
            const todayData = await todayResponse.json();
    
            // Handled today's data and updated the UI
            todaySunrise.textContent = todayData.results.sunrise || "Not available";
            todaySunset.textContent = todayData.results.sunset || "Not available";
            
    
            // Calculated and displayed dawn and dusk
            const todayDawnTime = todayData.results.dawn || "Not available";
            const todayDuskTime = todayData.results.dusk || "Not available";
            todayDawn.textContent = `${todayDawnTime}`;
            todayDusk.textContent = `${todayDuskTime}`;
    
            // Calculated and displayed day length
            const todayDayLengthValue = calculateDayLength(todayData.results.sunrise, todayData.results.sunset);
            todayDayLength.textContent = `${todayDayLengthValue}`;
    
            // Calculated and displayed solar noon
            const todaySolarNoonValue = calculateSolarNoon(todayData.results.sunrise, todayData.results.sunset);
            todaySolarNoon.textContent = `${todaySolarNoonValue}`;
    
            // Fetched tomorrow's data
            const tomorrowResponse = await fetch(tomorrowUrl);
            const tomorrowData = await tomorrowResponse.json();
                    // debugged data
                                    console.log("Today's API response:", todayData);
                                    console.log("Tomorrow's API response:", tomorrowData);
    
            if (tomorrowData.results) {
                // Handled tomorrow's data and update the UI
                tomorrowSunrise.textContent = tomorrowData.results.sunrise || "Not available";
                tomorrowSunset.textContent = tomorrowData.results.sunset || "Not available";
    
                // Calculated and displayed dawn and dusk for tomorrow
                const tomorrowDawnTime = tomorrowData.results.dawn || "Not available";
                const tomorrowDuskTime = tomorrowData.results.dusk || "Not available";
                tomorrowDawn.textContent = `${tomorrowDawnTime}`;
                tomorrowDusk.textContent = `${tomorrowDuskTime}`;
    
                // Calculated and displayed day length for tomorrow
                const tomorrowDayLengthValue = calculateDayLength(tomorrowData.results.sunrise, tomorrowData.results.sunset);
                tomorrowDayLength.textContent = `${tomorrowDayLengthValue}`;
    
                // Calculated and displayed solar noon for tomorrow
                const tomorrowSolarNoonValue = calculateSolarNoon(tomorrowData.results.sunrise, tomorrowData.results.sunset);
                tomorrowSolarNoon.textContent = `${tomorrowSolarNoonValue}`;
            } else {
                // Handled case where tomorrow's data was not available
                tomorrowSunrise.textContent = "Not available";
                tomorrowSunset.textContent = "Not available";
                tomorrowDawn.textContent = "Not available";
                tomorrowDusk.textContent = "Not available";
                tomorrowDayLength.textContent = "Not available";
                tomorrowSolarNoon.textContent = "Not available";
            }
        } catch (error) {
            console.error("Error fetching sunrise/sunset data:", error);
            showError("Error fetching data. Please try again.");
        } finally {
            // Removed loading UI after the API request was completed
            todaySunrise.textContent = todaySunrise.textContent || "Not available";
            todaySunset.textContent = todaySunset.textContent || "Not available";
            todayDawn.textContent = todayDawn.textContent || "Not available";
            todayDusk.textContent = todayDusk.textContent || "Not available";
            todayDayLength.textContent = todayDayLength.textContent || "Not available";
            todaySolarNoon.textContent = todaySolarNoon.textContent || "Not available";
            tomorrowSunrise.textContent = tomorrowSunrise.textContent || "Not available";
            tomorrowSunset.textContent = tomorrowSunset.textContent || "Not available";
            tomorrowDawn.textContent = tomorrowDawn.textContent || "Not available";
            tomorrowDusk.textContent = tomorrowDusk.textContent || "Not available";
            tomorrowDayLength.textContent = tomorrowDayLength.textContent || "Not available";
            tomorrowSolarNoon.textContent = tomorrowSolarNoon.textContent || "Not available";
        }


    }
    
    function parseTimeString(timeString) {
        //Used regular expression to match time in the format "hh:mm:ss AM/PM"
        const timeRegex = /^(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/;
    
        const match = timeString.match(timeRegex);
    
        if (!match) {
            console.error("Invalid time format:", timeString);
            return null;
        }
    
        const [, hours, minutes, seconds, ampm] = match;
        let parsedHours = parseInt(hours, 10);
    
        // Adjusted hours for PM
        if (ampm === "PM" && parsedHours < 12) {
            parsedHours += 12;
        }
    
        return {
            hours: parsedHours,
            minutes: parseInt(minutes, 10),
            seconds: parseInt(seconds, 10)
        };
    }
    
    function calculateDayLength(sunrise, sunset) {
        try {
            // Parsed sunrise and sunset time strings
            const sunriseTime = parseTimeString(sunrise);
            const sunsetTime = parseTimeString(sunset);
    
            if (!sunriseTime || !sunsetTime) {
                return "Not available";
            }
    
            // Calculated the time difference in minutes
            const timeDifference = (sunsetTime.hours * 60 + sunsetTime.minutes) - (sunriseTime.hours * 60 + sunriseTime.minutes);
    
            // Converted the time difference to hours and minutes
            const hours = Math.floor(timeDifference / 60);
            const minutes = timeDifference % 60;
    
            console.log("Day length hours:", hours, "minutes:", minutes);
    
            return `${hours}h ${minutes}m`;
        } catch (error) {
            console.error("Error calculating day length:", error);
            return "Not available";
        }
    }
    
    function calculateSolarNoon(sunrise, sunset) {
        try {
            // Parsed sunrise and sunset time strings
            const sunriseTime = parseTimeString(sunrise);
            const sunsetTime = parseTimeString(sunset);
    
            if (!sunriseTime || !sunsetTime) {
                return "Not available";
            }
    
            // Calculated solar noon as the midpoint between sunrise and sunset
            const solarNoonHours = Math.floor((sunsetTime.hours + sunriseTime.hours) / 2);
            const solarNoonMinutes = Math.floor((sunsetTime.minutes + sunriseTime.minutes) / 2);
    
            console.log("Solar noon hours:", solarNoonHours, "minutes:", solarNoonMinutes);
    
            return `${solarNoonHours}h ${solarNoonMinutes}m`;
        } catch (error) {
            console.error("Error calculating solar noon:", error);
            return "Not available";
        }
    }
    
    async function getCoordinates(location) {
        // Checked if the location is a valid string
        const isValidLocation = /^[a-zA-Z, ]+$/.test(location);
    
        if (!isValidLocation) {
            showError("Invalid location. Please enter a valid location name.");
            return;
        }
    
        const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(location)}`;
    
        try {
            todaySunrise.textContent = "Loading...";
            todaySunset.textContent = "Loading...";
    
            const response = await fetch(apiUrl);
            const data = await response.json();
    
            // Checked if there is a valid result
            if (data && data.length > 0) {
                const firstResult = data[0];
    
                // Checked if the result has latitude and longitude
                if (
                    firstResult.lat &&
                    firstResult.lon &&
                    !isNaN(parseFloat(firstResult.lat)) &&
                    !isNaN(parseFloat(firstResult.lon))
                ) {
                    return { latitude: parseFloat(firstResult.lat), longitude: parseFloat(firstResult.lon) };
                } else {
                    showError("Location not found. Please enter a valid location.");
                    alert("Location not found. Please enter a valid location.");
                }
            } else {
                showError("Location not found. Please enter a valid location.");
                alert("Location not found. Please enter a valid location.");
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            showError("Error fetching coordinates. Please try again.");
        } finally {
            // Removed loading UI after the API request was completed
            todaySunrise.textContent = todaySunrise.textContent || "Not available";
            todaySunset.textContent = todaySunset.textContent || "Not available";
    
        }
    }
    
    
    function resetSunriseSunsetData() {
        todaySunrise.textContent = "";
        todaySunset.textContent = "";
        todayDawn.textContent = "";
        todayDusk.textContent = "";
        todayDayLength.textContent = "";
        todaySolarNoon.textContent = "";
    
        tomorrowSunrise.textContent = "";
        tomorrowSunset.textContent = "";
        tomorrowDawn.textContent = "";
        tomorrowDusk.textContent = "";
        tomorrowDayLength.textContent = "";
        tomorrowSolarNoon.textContent = "";
    
        errorMessage.textContent = "";
    }
    
  
    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden");
    }
  
    searchBtn.addEventListener("click", async () => {
        const location = locationInput.value.trim();
    
        // Checked if the location contains at least one non-numeric character
        if (/\D/.test(location)) {
            resetSunriseSunsetData();
    
            const coordinates = await getCoordinates(location);
            if (coordinates) {
                getWeatherData(coordinates.latitude, coordinates.longitude);
                getSunriseSunset(coordinates.latitude, coordinates.longitude);
            }
        } else {
            resetSunriseSunsetData();
            showError("Please enter a valid location.");
            alert("Please enter a valid location.");
        }
    });
  
    geolocationBtn.addEventListener('click', async () => {
        // Cleared the input field
        locationInput.value = '';
      
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // Added loading UI here if needed
              getSunriseSunset(latitude, longitude);
            },
            (error) => {
              console.error('Error getting geolocation:', error);
              showError('Error getting current location. Please try again.');
            }
          );
        } else {
          showError('Geolocation is not supported by your browser.');
        }
      });
      
  });
  
    // Displayed the location
    function displayLocation(location) {
        const displayedLocationElement = document.getElementById('displayed-location');
        displayedLocationElement.textContent = location;
}

const backgrounds = ['1.avif', '2.avif', '3.avif', '4.avif', '5.avif', '6.avif', '7.avif', '8.avif', '9.avif', '12.avif', '13.avif', '14.avif', '15.avif', '18.avif', '19.avif', '20.avif'];
let currentBackgroundIndex = backgrounds.length - 1;
function changeBackground() {
    if (currentBackgroundIndex < 0) {
        currentBackgroundIndex = backgrounds.length - 1; 
    }

    const imageUrl = backgrounds[currentBackgroundIndex];
    document.body.style.backgroundImage = `url(${imageUrl})`;

    currentBackgroundIndex--;
}

changeBackground();

setInterval(changeBackground, 9000);