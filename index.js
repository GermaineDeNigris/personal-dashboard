fetch("https://api.unsplash.com/photos/random?orientation=landscape&query=water&client_id=54aIZJPJRr2XLQw_72nDFVYvfa2lrplGNyslGHfYRqw")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
    })

    .catch(err => {
       document.body.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/0/0e/Nesso_lago_di_como.jpg"`
    }) 

fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        console.log(res.status)
        return res.json()
    })
    .then(data => {
        document.getElementById("crypto").innerHTML = ` 
        <div id="crypto-top">
            <img src=${data.image.small} />
            <span id="bitcoin-title">${data.name}</span>
        </div>
        <div id="crypto">
            <p>Current price: € ${data.market_data.current_price.eur}</p>
            
        </div>
        `
    })
    .catch(err => console.error(err))
    

    function updateTime(){
        const date = new Date()
        const timeElement = document.getElementsByClassName("time")[0]
        const userLocale = navigator.language
        const options = { hour: "numeric", minute: "numeric" }
        const formattedTime = date.toLocaleTimeString(userLocale, options)
        timeElement.textContent = formattedTime
    }
    setInterval(updateTime, 1000)

// geolocator / weather feature
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <div id="top-weather">
                    <img src=${iconUrl} />
                    <p id="temp">${Math.round(data.main.temp)} ° </p>
                </div>
                <p id="location">${data.name}, ${data.sys.country}</p>
            `
        })
        .catch(err => console.error(err))
});