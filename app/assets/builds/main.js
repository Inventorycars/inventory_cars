(() => {
  // app/javascript/main.js
  document.addEventListener("DOMContentLoaded", function() {
    var flashMessage = document.getElementById("flash-message");
    if (flashMessage) {
      setTimeout(function() {
        flashMessage.style.display = "none";
      }, 2e3);
    }
    const switchButton = document.getElementById("switchButton");
    const gridView = document.getElementById("gridView");
    const tableView = document.getElementById("tableView");
    const viewLabel = document.getElementById("viewLabel");
    gridView.classList.remove("hidden");
    switchButton.addEventListener("change", function() {
      if (this.checked) {
        gridView.classList.add("hidden");
        tableView.classList.remove("hidden");
        viewLabel.innerHTML = "Table View";
      } else {
        gridView.classList.remove("hidden");
        tableView.classList.add("hidden");
        viewLabel.innerHTML = "Grid View";
      }
    });
    const stateSelect = document.getElementById("stateSelect");
    const citySelect = document.getElementById("citySelect");
    stateSelect.addEventListener("change", function() {
      const selectedState = stateSelect.value;
      fetch(`/cities?state=${selectedState}`).then((response) => response.json()).then((data) => {
        citySelect.innerHTML = "";
        data.forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
      }).catch((error) => {
        console.error("Error fetching cities:", error);
      });
    });
    citySelect.addEventListener("change", function() {
      const selectedState = stateSelect.value;
      const selectedCity = citySelect.value;
      fetch(`/pincodes?state=${selectedState}&city=${selectedCity}`).then((response) => response.json()).then((data) => {
        pinSelect.innerHTML = "";
        data.forEach((zip_code) => {
          const option = document.createElement("option");
          option.value = zip_code;
          option.textContent = zip_code;
          pinSelect.appendChild(option);
        });
      }).catch((error) => {
        console.error("Error fetching cities:", error);
      });
    });
  });
})();
//# sourceMappingURL=/assets/main.js.map
