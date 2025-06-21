const path = window.location.pathname;

// Handle redirect from homepage to forecast page
if (path.includes("index.html") || path === "/" || path === "/index.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const forecastBtn = document.getElementById("goToForecast");
    if (forecastBtn) {
      forecastBtn.addEventListener("click", () => {
        window.location.href = "forecast.html";
      });
    }
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