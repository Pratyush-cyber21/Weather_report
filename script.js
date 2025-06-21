document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "4848a70ff113538c9afb6862da0b3631"; // ✅ Replace with your API key if needed
  const cityInput = document.getElementById("forecastCityInput");
  const dateInput = document.getElementById("forecastDateInput");
  const fetchBtn = document.getElementById("getForecastBtn");
  const forecastOutput = document.getElementById("forecastData");

  fetchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    const date = dateInput.value;

    if (!city || !date) {
      alert("Please enter both city and date.");
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("City not found or API error");
        return res.json();
      })
      .then((data) => {
        const forecasts = data.list.filter((entry) =>
          entry.dt_txt.startsWith(date)
        );

        if (forecasts.length === 0) {
          forecastOutput.innerHTML = "<p>No forecast data available for this date.</p>";
          return;
        }

        // Clear previous results
        forecastOutput.innerHTML = "";

        forecasts.forEach((entry) => {
          const time = entry.dt_txt.split(" ")[1].slice(0, 5);
          const temp = entry.main.temp;
          const humidity = entry.main.humidity;
          const windSpeed = entry.wind.speed;
          const rainProb = entry.pop ? Math.round(entry.pop * 100) + "%" : "0%";
          const condition = entry.weather[0].description;

          const forecastCard = `
            <div class="forecast-card">
              <h3>🕓 ${time}</h3>
              <p>🌡️ Temp: ${temp} °C</p>
              <p>💧 Humidity: ${humidity}%</p>
              <p>🌬️ Wind: ${windSpeed} m/s</p>
              <p>🌧️ Rain Chance: ${rainProb}</p>
              <p>🌈 Condition: ${condition}</p>
            </div>
          `;

          forecastOutput.innerHTML += forecastCard;
        });
      })
      .catch((err) => {
        console.error(err);
        forecastOutput.innerHTML = "<p>⚠️ Error fetching weather data.</p>";
      });
  });
});