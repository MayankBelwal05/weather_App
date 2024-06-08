"use strict";

const API = "fe4feefa8543e06d4f3c66d92c61b69c";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const timeEl = document.createElement("h3");
timeEl.classList.add("default_time");
dateEl.insertAdjacentElement("afterend", timeEl);

const btnEl = document.querySelector(".btn_search");
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

// display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();

dateEl.textContent = date + " " + month + " " + year;

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

// display current time
function updateTime() {
  const now = new Date();
  timeEl.textContent = formatTime(now);
}
updateTime();
setInterval(updateTime, 1000);

// add event
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  // check empty value
  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
   
    alert("Please Enter City or Country Name")
    console.log("Please Enter City or Country Name");
  }
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
      // display image content
      const ImageContent = displayImageContent(result);

      // display right side content
      const rightSide = rightSideContent(result);

      // forecast function
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
        iconsContainer.classList.add("fadeIn");
        dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
      }, 1500);
    } else {
      const message = `<h2 class="weather_temp">${result.cod}</h2>
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconsContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {}
}

// display image content and temp
function displayImageContent(data) {
  return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="" />
    <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

// Function to convert Unix timestamp to readable time format
function convertTimestampToTime(timestamp) {
  const date = new Date(timestamp * 1000); 
  return date.toLocaleTimeString(); 
}

// display the right side content

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
          <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
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

// function rightSideContent(result) {
//   const sunriseTime = convertTimestampToTime(result.sys.sunrise);
//   const sunsetTime = convertTimestampToTime(result.sys.sunset);

//   return `
// <div class="headLine">
//   <h3 class="headLineIn">Weather in<span>&nbsp;&nbsp;</span><span class="cityName">${result.name}</span></h3>
// </div>

//   <div class="content">
//           <p class="title">LOCATION:</p>
//           <span class="value">${result.name} ,${result.sys.country}</span>
//         </div>
//         <div class="content">
//           <p class="title">TEMP</p>
//           <span class="value"> 🌡️ ${Math.round(result.main.temp - 275.15)}°C</span>
//         </div>
//         <div class="content">
//           <p class="title">HUMIDITY</p>
//           <span class="value"> ❄️ ${result.main.humidity}%</span>
//         </div>
//         <div class="content">
//           <p class="title">WIND SPEED</p>
//           <span class="value">🌫️ ${result.wind.speed} Km/h</span>
//         </div>
//         <div class="content">
//           <p class="title">VISIBILITY</p>
//           <span class="value"> 👁️ ${Math.round(result.visibility)/1000 }  km </span>
//         </div>
//         <div class="content">
//           <p class="title">SUNRISE</p>
//           <span class="value"> ☀️ ${sunriseTime} </span>
//         </div>
//         <div class="content">
//           <p class="title">SUNSET</p>
//           <span class="value"> 🟠 ${sunsetTime} </span>
//         </div>
//          `;
// }

async function displayForeCast(lat, long) {
  const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(ForeCast_API);
  const result = await data.json();
  // filter the forecast
  const uniqeForeCastDays = [];
  const daysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqeForeCastDays.includes(forecastDate)) {
      return uniqeForeCastDays.push(forecastDate);
    }
  });
  console.log(daysForecast);

  daysForecast.reverse().forEach((content, indx) => { // Reverse the order
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
    }
  });
}

// forecast html element data
function forecast(frContent) {
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  return `<li>
  <img src="https://openweathermap.org/img/wn/${
    frContent.weather[0].icon
  }@4x.png" />
  <span>${joinDay}</span>
  <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
</li>`;
}
