"use strict";

const API = "fe4feefa8543e06d4f3c66d92c61b69c";

const timeEl = document.createElement("h3");
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
timeEl.classList.add("default_time");
dateEl.insertAdjacentElement("afterend", timeEl);

const btnEl = document.querySelector(".btn_search");
const locationBtn = document.querySelector('.location-btn');  // Corrected query selector
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

dateEl.textContent = `${date} ${month} ${year}`;

// Function to format time in AM/PM
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return strTime;
}

// Display current time
function updateTime() {
  const now = new Date();
  timeEl.textContent = formatTime(now);
}
updateTime();
setInterval(updateTime, 1000);

// Add event listeners
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // Check for empty value
  if (inputEl.value !== "") {
    const search = inputEl.value;
    inputEl.value = "";
    findLocation(search);
  } else {
    alert("Please enter a location.");
    console.log("Please enter a location.");
  }
});

locationBtn.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    getWeatherData(null, lat, lon);
  }, (error) => {
    console.error("Error getting location:", error);
    alert("Unable to retrieve location. Please check your location settings.");
  });
});

async function findLocation(name) {
  iconsContainer.innerHTML = "";
  dayInfoEl.innerHTML = "";
  listContentEl.innerHTML = "";
  try {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();
    console.log(result);

    if (result.cod !== "404") {
      // Display image content
      const imageContent = displayImageContent(result);

      // Display right side content
      const rightSide = rightSideContent(result);

      // Forecast function
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", imageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    alert("Error fetching location data. Please try again.");
  }
}

const getWeatherData = async (city, lat, lon) => {
  let url = '';
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`;
  } else {
    alert("Please enter a location.");
    console.error("City, latitude, and longitude are missing.");
    return;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    const { lat: latitude, lon: longitude } = data.coord;
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;
    const res2 = await fetch(apiUrl);
    const forecastData = await res2.json();

    displayWeather(data, forecastData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data. Please try again.");
  }
}

function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 273.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString();
}

function rightSideContent(result) {
  const sunriseTime = convertTimestampToTime(result.sys.sunrise);
  const sunsetTime = convertTimestampToTime(result.sys.sunset);

  return `
    <div class="headLine">
      <h3 class="headLineIn">Weather Stats in<span>&nbsp;&nbsp;</span><span class="cityName">${result.name}, ${result.sys.country}</span></h3>
    </div>
    <div class="info-box">
      <div class="content">
        <div class="icon">📍</div>
        <div class="text">
          <p class="title">LOCATION:</p>
          <span class="value">${result.name}, ${result.sys.country}</span>
        </div>
      </div>
      <div class="content">
        <div class="icon">🌡️</div>
        <div class="text">
          <p class="title">TEMP</p>
          <span class="value">${Math.round(result.main.temp - 273.15)}°C</span>
        </div>
      </div>
      <div class="content">
        <div class="icon">💧</div>
        <div class="text">
          <p class="title">HUMIDITY</p>
          <span class="value">${result.main.humidity}%</span>
        </div>
      </div>
      <div class="content">
        <div class="icon">👁️</div>
        <div class="text">
          <p class="title">VISIBILITY</p>
          <span class="value">${Math.round(result.visibility / 1000)} km</span>
        </div>
      </div>
      <div class="content">
        <div class="icon">🌅</div>
        <div class="text">
          <p class="title">SUNRISE</p>
          <span class="value">${sunriseTime}</span>
        </div>
      </div>
      <div class="content">
        <div class="icon">🌇</div>
        <div class="text">
          <p class="title">SUNSET</p>
          <span class="value">${sunsetTime}</span>
        </div>
      </div>
    </div>
  `;
}

async function displayForeCast(lat, long) {
  const foreCastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  try {
    const data = await fetch(foreCastAPI);
    const result = await data.json();
    // Filter the forecast
    const uniqueForecastDays = [];
    const daysForecast = result.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForecastDays.includes(forecastDate)) {
        return uniqueForecastDays.push(forecastDate);
      }
    });

    console.log(daysForecast);

    daysForecast.reverse().forEach((content, indx) => {
      if (indx <= 3) {
        listContentEl.insertAdjacentHTML("afterbegin", displayForecastContent(content));
      }
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    alert("Error fetching forecast data. Please try again.");
  }
}

function displayForecastContent(content) {
  const newDate = new Date(content.dt_txt);
  const dayOfWeek = newDate.toLocaleString("default", { weekday: "long" });

  return `
    <li>
      <div class="day">${dayOfWeek}</div>
      <div class="icons">
        <img src="https://openweathermap.org/img/wn/${content.weather[0].icon}@2x.png"/>
      </div>
      <div class="temp">${Math.round(content.main.temp - 273.15)}°C</div>
    </li>
  `;
}

function displayWeather(data, forecastData) {
  // Populate the weather data in your DOM as needed
  const imageContent = displayImageContent(data);
  const rightSide = rightSideContent(data);
  iconsContainer.innerHTML = imageContent;
  dayInfoEl.innerHTML = rightSide;
  displayForeCast(data.coord.lat, data.coord.lon);
}

// Initialize the page with a default location (e.g., "New York")
findLocation("New York");
