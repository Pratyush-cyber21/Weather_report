const path = window.location.pathname;

// Handle redirect from homepage to forecast page
if (path.includes("forecast.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "4848a70ff113538c9afb6862da0b3631";
    const cityInput = document.getElementById("forecastCityInput");
    const dateInput = document.getElementById("forecastDateInput");
    const fetchBtn = document.getElementById("getForecastBtn");
    const chartCanvas = document.getElementById("forecastChart");
    const conditionDiv = document.getElementById("currentCondition");

    let forecastChart;
    const ctx = chartCanvas.getContext("2d");

    fetchBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();
      const selectedDate = dateInput.value;

      if (!city || !selectedDate) {
        alert("Please enter both city and date.");
        return;
      }

      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) throw new Error("City not found");
          return response.json();
        })
        .then(data => {
          const labels = [];
          const temps = [];
          const rainChances = [];
          const humidities = [];
          const windSpeeds = [];

          let currentFound = false;

          data.list.forEach(entry => {
            const [date, time] = entry.dt_txt.split(" ");
            if (date === selectedDate) {
              labels.push(time.slice(0, 5)); // HH:MM
              temps.push(entry.main.temp);
              humidities.push(entry.main.humidity);
              windSpeeds.push(entry.wind.speed);
              rainChances.push(entry.pop * 100); // Probability of precipitation

              if (!currentFound) {
                const condition = entry.weather[0].description;
                const isRaining = condition.toLowerCase().includes("rain") ? "🌧️ Yes" : "☀️ No";
                conditionDiv.innerHTML = `
                  <strong>Current Weather Condition:</strong> ${condition}<br>
                  <strong>Is it raining?</strong> ${isRaining}
                `;
                currentFound = true;
              }
            }
          });

          if (labels.length === 0) {
            alert("No forecast data for this date.");
            return;
          }

          if (forecastChart) forecastChart.destroy();

          forecastChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "🌡️ Temp (°C)",
                  data: temps,
                  borderColor: "#00c3ff",
                  backgroundColor: "rgba(0,195,255,0.2)",
                  yAxisID: 'y',
                },
                {
                  label: "🌧️ Rain Probability (%)",
                  data: rainChances,
                  borderColor: "#ffa500",
                  backgroundColor: "rgba(255,165,0,0.2)",
                  yAxisID: 'y1',
                },
                {
                  label: "💧 Humidity (%)",
                  data: humidities,
                  borderColor: "#66bb6a",
                  backgroundColor: "rgba(102,187,106,0.2)",
                  yAxisID: 'y1',
                },
                {
                  label: "🌬️ Wind Speed (m/s)",
                  data: windSpeeds,
                  borderColor: "#ff4081",
                  backgroundColor: "rgba(255,64,129,0.2)",
                  yAxisID: 'y1',
                }
              ]
            },
            options: {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              stacked: false,
              scales: {
                y: {
                  type: 'linear',
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Temperature (°C)',
                    color: "#00c3ff"
                  },
                  ticks: {
                    color: "#00c3ff"
                  }
                },
                y1: {
                  type: 'linear',
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Other Metrics',
                    color: "#ffa500"
                  },
                  ticks: {
                    color: "#ffa500"
                  },
                  grid: {
                    drawOnChartArea: false
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#fff"
                  }
                }
              }
            }
          });
        })
        .catch(error => {
          alert("Error fetching weather data.");
          console.error(error);
        });
    });
  });
}

// Forecast functionality
if (path.includes("forecast.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "4848a70ff113538c9afb6862da0b3631";
    const cityInput = document.getElementById("forecastCityInput");
    const dateInput = document.getElementById("forecastDateInput");
    const fetchBtn = document.getElementById("getForecastBtn");
    const chartCanvas = document.getElementById("forecastChart");

    if (!fetchBtn || !cityInput || !dateInput || !chartCanvas) {
      console.error("Missing one or more forecast elements.");
      return;
    }

    let forecastChart;
    const ctx = chartCanvas.getContext("2d");

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
          const labels = [];
          const temps = [];

          data.list.forEach(entry => {
            const [date, time] = entry.dt_txt.split(" ");
            if (date === selectedDate) {
              labels.push(time.slice(0, 5)); // HH:MM
              temps.push(entry.main.temp);
            }
          });

          if (labels.length === 0) {
            alert("No forecast data for this date.");
            return;
          }

          if (forecastChart) forecastChart.destroy();

          forecastChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [{
                label: `Temperature in ${city} on ${selectedDate}`,
                data: temps,
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                borderColor: "#007bff",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#007bff",
                fill: true
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#000"  // make legend text black
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: "Temperature (°C)",
                    color: "#000"
                  },
                  ticks: {
                    color: "#000"
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: "Time",
                    color: "#000"
                  },
                  ticks: {
                    color: "#000"
                  }
                }
              }
            }
          });
        })
        .catch(error => {
          alert("Error fetching weather data.");
          console.error(error);
        });
    });
  });
}

// Contact form functionality
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // prevent normal form submission
      const formData = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          form.reset();
          successMessage.style.display = "block";
        } else {
          alert("Oops! Something went wrong.");
        }
      });
    });
  }
});