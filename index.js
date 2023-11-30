let lastWeatherFetch = 0
let lastBitcoinFetch = 0
const refreshInterval = 60 * 60 * 1000
const unsplashAccessKey = '54aIZJPJRr2XLQw_72nDFVYvfa2lrplGNyslGHfYRqw'

function fetchWeatherData(latitude, longitude) {
    const currentTime = new Date().getTime()
    const cachedWeatherData = getCachedData("weatherData")

    if (cachedWeatherData && currentTime - cachedWeatherData.timestamp < refreshInterval) {
        // Use cached weather data
        updateWeatherUI(cachedWeatherData.data)
    } else {
        // Fetch and cache new weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=982507f7ee87e5e3245f25253654ed1d`)
            .then(res => {
                if (!res.ok) {
                    throw Error("Weather data not available")
                }
                return res.json()
            })
            .then(data => {
                updateWeatherUI(data)
                setCachedData("weatherData", data)
            })
            .catch(err => console.error(err))
    }
}

function updateWeatherUI(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    document.getElementById("weather").innerHTML = `
        <div id="top-weather">
            <img src=${iconUrl} alt="Weather Icon" id="weather-icon" />
            <p id="temp">${Math.round(data.main.temp)} ° </p>
        </div>
        <p id="location">${data.name}, ${data.sys.country}</p>
    `
}

function fetchBitcoinData() {
    const currentTime = new Date().getTime()
    const cachedBitcoinData = getCachedData("bitcoinData")

    if (cachedBitcoinData && currentTime - cachedBitcoinData.timestamp < refreshInterval) {
        // Use cached Bitcoin data
        updateBitcoinUI(cachedBitcoinData.data)
    } else {
        // Fetch and cache new Bitcoin data
        fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
            .then(res => {
                if (!res.ok) {
                    throw Error("Something went wrong");
                }
                return res.json()
            })
            .then(data => {
                updateBitcoinUI(data)
                setCachedData("bitcoinData", data)
            })
            .catch(err => console.error(err))
    }
}

function updateBitcoinUI(data) {
    document.getElementById("crypto").innerHTML = ` 
        <div id="crypto-top">
            <img src=${data.image.small} alt="Bitcoin Icon" id="bitcoin-icon" />
            <span id="bitcoin-title">${data.name}</span>
        </div>
        <div id="crypto">
            <p>Current price: € ${data.market_data.current_price.eur}</p>
        </div>
    `
}

function getCachedData(key) {
    const cachedData = localStorage.getItem(key)
    if (cachedData) {
        return JSON.parse(cachedData)
    }
    return null;
}

function setCachedData(key, data) {
    const currentTime = new Date().getTime()
    const cacheData = {
        data: data,
        timestamp: currentTime,
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
}

function updateTime() {
    const date = new Date()
    const timeElement = document.getElementsByClassName("time")[0]
    const userLocale = navigator.language
    const options = { hour: "numeric", minute: "numeric" }
    const formattedTime = date.toLocaleTimeString(userLocale, options)
    timeElement.textContent = formattedTime
}

// Initial data fetch
navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    fetchWeatherData(latitude, longitude)
    fetchBitcoinData()
})

// Periodically update data (every hour)
setInterval(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        fetchWeatherData(latitude, longitude)
        fetchBitcoinData()
    })
}, refreshInterval)

// Fetch Unsplash background image
fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${unsplashAccessKey}`)
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`;
    })
    .catch(err => {
        document.body.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/0/0e/Nesso_lago_di_como.jpg")`
    })

// Periodically update the time (every second)
setInterval(updateTime, 1000)

