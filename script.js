document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "4848a70ff113538c9afb6862da0b3631";
  const cityInput = document.getElementById("forecastCityInput");
  const dateInput = document.getElementById("forecastDateInput");
  const fetchBtn = document.getElementById("getForecastBtn");
  const forecastContainer = document.getElementById("forecastData");

  fetchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    const selectedDate = dateInput.value;

    if (!city || !selectedDate) {
      alert("Please enter both city and date.");
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error("City not found");
        return response.json();
      })
      .then(data => {
        const output = [];
        const hourlyData = data.list.filter(item => item.dt_txt.startsWith(selectedDate));

        if (hourlyData.length === 0) {
          forecastContainer.innerHTML = "<p>No forecast data found for this date.</p>";
          return;
        }

        hourlyData.forEach(item => {
          const baseTime = item.dt_txt.split(" ")[1].slice(0, 5); // e.g., "03:00"
          const baseTemp = item.main.temp;
          const humidity = item.main.humidity;
          const wind = item.wind.speed;
          const rain = item.rain && item.rain["3h"] ? item.rain["3h"] : 0;
          const rainProbability = rain ? `${Math.min(100, Math.round((rain / 3) * 100))}%` : "0%";
          const condition = item.weather[0].main.toLowerCase().includes("rain") ? "Raining" : item.weather[0].main;

          // Simulate two 30-min intervals per 3-hour block
          for (let i = 0; i < 2; i++) {
            const time = new Date(item.dt * 1000 + i * 30 * 60 * 1000)
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            output.push(`
              <div class="forecast-block">
                <h3>${time}</h3>
                <p>🌡 Temp: ${baseTemp} °C</p>
                <p>💧 Humidity: ${humidity}%</p>
                <p>🌬 Wind: ${wind} m/s</p>
                <p>🌧 Rain Probability: ${rainProbability}</p>
                <p>🌤 Condition: ${condition}</p>
              </div>
            `);
          }
        });

        forecastContainer.innerHTML = output.join("");
      })
      .catch(err => {
        console.error(err);
        forecastContainer.innerHTML = "<p>Error fetching forecast data.</p>";
      });
  });
});