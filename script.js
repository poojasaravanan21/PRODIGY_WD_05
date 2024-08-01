document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '199437d7d1e98e368021b99af74d71de'; // Your actual API key

    const locationInput = document.getElementById('location-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const useLocationBtn = document.getElementById('use-location-btn');
    const weatherInfo = document.getElementById('weather-info');
    const weatherCondition = document.getElementById('weather-condition');
    const temperature = document.getElementById('temperature');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const weatherIcon = document.getElementById('weather-icon');

    // Fetch weather data based on location input
    getWeatherBtn.addEventListener('click', () => {
        const location = locationInput.value;
        if (location) {
            fetchWeather(location);
        }
    });

    // Use geolocation to get weather data
    useLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(null, lat, lon);
            }, () => {
                alert('Failed to retrieve location. Please enter a location manually.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    // Automatically fetch weather data on page load using geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(null, lat, lon);
        }, () => {
            // Set a default background if geolocation is not available
            document.body.style.backgroundImage = "url('all.jfif')";
        });
    } else {
        // Set a default background if geolocation is not supported
        document.body.style.backgroundImage = "url('all.jfif')";
    }

    async function fetchWeather(location, lat = null, lon = null) {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${apiKey}`;
        if (location) {
            url += `&q=${location}`;
        } else if (lat && lon) {
            url += `&lat=${lat}&lon=${lon}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            alert(error.message);
        }
    }

    function displayWeather(data) {
        const { weather, main, wind } = data;
        const weatherMain = weather[0].main;
        const weatherDescription = weather[0].description;
        const icon = weather[0].icon;

        weatherCondition.textContent = `${weatherMain} (${weatherDescription})`;
        temperature.textContent = `Temperature: ${main.temp}°C`;
        humidity.textContent = `Humidity: ${main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${wind.speed} m/s`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherIcon.classList.remove('hidden');

        // Change background image based on weather conditions
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                document.body.style.backgroundImage = "url('clear.jfif')"; // Replace with your clear weather image URL
                break;
            case 'rain':
                document.body.style.backgroundImage = "url('rain.jfif')"; // Replace with your rain weather image URL
                break;
            case 'clouds':
                document.body.style.backgroundImage = "url('cloudy.jfif')"; // Replace with your cloudy weather image URL
                break;
            case 'snow':
                document.body.style.backgroundImage = "url('snow.jfif')"; // Replace with your snow weather image URL
                break;
            default:
                document.body.style.backgroundImage = "url('all.jfif')"; // Replace with your default image URL
                break;
        }
    }
});
