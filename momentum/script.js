// DOM Elements
const time = document.querySelector('.time'),
	date = document.querySelector('.date'),
	greeting = document.querySelector('.greeting'),
	name = document.querySelector('.name'),
	focus = document.querySelector('.focus'),
	blockquote = document.querySelector('blockquote'),
	figcaption = document.querySelector('figcaption');
const btn = document.querySelector('.btn');
const quoteBtn = document.querySelector('.btn-quote');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');
const city = document.querySelector('.city');
// Options
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
let imageCount = 0;
const baseImagesPath = 'assets/images/';
let randomCollectionImage = [];

// Show Time
function showTime() {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December'
	];

	let today = new Date(),
		//let today = new Date(2020, 6, 3, 23, 59, 0),
		dayMonth = today.getDate(),
		month = today.getMonth(),
		dayWeek = today.getDay(),
		hour = today.getHours(),
		min = today.getMinutes(),
		sec = today.getSeconds();

	if (addZero(min) == "00" && addZero(sec) == "00") {
		getImage();
	}
	//Output Date
	date.innerHTML = `${days[dayWeek]}<span>, </span>${dayMonth} ${months[month]}`;

	// Output Time
	time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
    sec
  )}`;

	setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
	return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function generateCollectionBg() {
	for (let i = 0; i < 4; i++) {
		let tempImages = images.slice();
		for (let j = 0; j < 6; j++) {
			randomCollectionImage.push(tempImages.splice([Math.floor(Math.random() * 20 - j)], 1).toString());
		}
	}
}

function setBgProperties(dir, phrase, hour) {
	document.body.style.backgroundImage =
		`url(${baseImagesPath}${dir}/${randomCollectionImage[hour]})`;
	greeting.textContent = phrase;
}

// Set Background and Greeting
function setBgGreet() {
	generateCollectionBg();
	let today = new Date(),
		//let today = new Date(2020, 6, 3, 118, 13, 0),
		hour = today.getHours();

	if (hour < 6) {
		setBgProperties("night", "Good Night, ", hour);
	} else if (hour < 12) {
		// Morning
		setBgProperties("morning", "Good Morning, ", hour);

	} else if (hour < 18) {
		// Afternoon
		setBgProperties("day", "Good Afternoon, ", hour);
	} else {
		setBgProperties("evening", "Good Evening, ", hour);
	}
	imageCount = hour + 1;
	console.log(randomCollectionImage);
}

// Get Name
function getName() {
	if (localStorage.getItem('name') === null) {
		name.textContent = '[Enter Name]';
	} else {
		name.textContent = localStorage.getItem('name');
	}
}

// Set Name
function setName(e) {
	if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			if (e.target.innerText == "" && !localStorage.getItem('name')) {
				e.target.innerText = '[Enter Name]';
				localStorage.setItem('name', e.target.innerText);
			} else if (e.target.innerText == "" && localStorage.getItem('name'))
				e.target.innerText = localStorage.getItem('name');
			else
				localStorage.setItem('name', e.target.innerText);
			name.blur();
		}
	} else {
		if (e.target.innerText == "" && !localStorage.getItem('name')) {
			e.target.innerText = '[Enter Name]';
			localStorage.setItem('name', e.target.innerText);
		} else if (e.target.innerText == "" && localStorage.getItem('name'))
			e.target.innerText = localStorage.getItem('name');
		else
			localStorage.setItem('name', e.target.innerText);
	}
}

// Get Focus
function getFocus() {
	if (!localStorage.getItem('focus')) {
		focus.textContent = '[Enter Focus]';
	} else {
		focus.textContent = localStorage.getItem('focus');
	}
}

// Set Focus
function setFocus(e) {
	if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			if (e.target.innerText == "" && !localStorage.getItem('focus')) {
				e.target.innerText = '[Enter Focus]';
				localStorage.setItem('focus', e.target.innerText);
			} else if (e.target.innerText == "" && localStorage.getItem('focus'))
				e.target.innerText = localStorage.getItem('focus');
			else
				localStorage.setItem('focus', e.target.innerText);
			focus.blur();
		}
	} else {
		if (e.target.innerText == "" && !localStorage.getItem('focus')) {
			e.target.innerText = '[Enter Focus]';
			localStorage.setItem('focus', e.target.innerText);
		} else if (e.target.innerText == "" && localStorage.getItem('focus'))
			e.target.innerText = localStorage.getItem('focus');
		else
			localStorage.setItem('focus', e.target.innerText);
	}
}

//getFocusElement
function getFocusElement(e) {
	console.log(e.target);
	if (e.target.innerText) {
		e.target.innerText = " ";
	}
}

name.addEventListener('click', getFocusElement);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
focus.addEventListener('click', getFocusElement);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

function getDirByHour(hour) {
	if (hour < 6) {
		// Night
		return "night/"
	} else if (hour < 12) {
		//Morning
		return "morning/"
	} else if (hour < 18) {
		// Afternoon
		return "day/"
	} else {
		// Evening
		return "evening/"
	}
}

function viewBgImage(data) {
	const body = document.querySelector('body');
	const src = data;
	const img = document.createElement('img');
	img.src = src;
	img.onload = () => {
		body.style.backgroundImage = `url(${src})`;
	};
}

//Change image to next in given list
function getImage() {
	const imageSrc = baseImagesPath + getDirByHour(imageCount) + randomCollectionImage[imageCount];
	viewBgImage(imageSrc);
	imageCount++;
	if (imageCount > 23)
		imageCount = 0;
}

//Change background by click
btn.addEventListener('click', getImage);
// префикс https://cors-anywhere.herokuapp.com используем для доступа к данным с других сайтов если браузер возвращает ошибку 
//Cross-Origin Request Blocked 
async function getQuote() {
	const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
	const res = await fetch(url);
	const data = await res.json();
	blockquote.textContent = data.quoteText;
	figcaption.textContent = data.quoteAuthor;
}

//Change quote by click
document.addEventListener('DOMContentLoaded', getQuote);
quoteBtn.addEventListener('click', getQuote);

//Get weather
async function getWeather() {
	if (!localStorage.getItem('userCity'))
		localStorage.setItem('userCity', "Минск");
	city.textContent = localStorage.getItem('userCity');
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=d015641e29980cb5a660dff6f3bc0584&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	weatherIcon.className = 'weather-icon owf owf-4x';
	//weather image
	weatherIcon.classList.add(`owf-${data.weather[0].id}`);
	//temperature
	temperature.textContent = `${data.main.temp}°C`;
	//windSpeed
	windSpeed.textContent = `${data.wind.speed}m/s`;
	//Humidity
	humidity.textContent = `${data.main.humidity}%`;
}

async function setCity(event) {
	if (event.code === 'Enter') {

		city.blur();
	} else if (event.type == "blur") {

		if (city.textContent) {
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=d015641e29980cb5a660dff6f3bc0584&units=metric`;
			const res = await fetch(url);
			if (res.status == 200) {
				localStorage.setItem('userCity', city.textContent);
				getWeather();
			} else {
				alert("Error: enter valid city");
				city.textContent = localStorage.getItem('userCity');
			}
		} else {
			city.textContent = localStorage.getItem('userCity');
		}

	}
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

// Run
showTime();
setBgGreet();
getName();
getFocus();
getWeather();