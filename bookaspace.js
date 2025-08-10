const form = document.getElementById("bookingForm");
  const workspaceField = document.getElementById("workspace");
  const dateField = document.getElementById("date");
  const timeField = document.getElementById("time");
  const durationField = document.getElementById("duration");

  const workspaceRates = {
    "Private office": 25,
    "Shared desk": 10,
    "Meeting room": 15
  };

  const priceDisplay = document.createElement("p");
  priceDisplay.style.marginTop = "10px";
  priceDisplay.style.fontWeight = "bold";
  form.appendChild(priceDisplay);

  function updatePrice() {
    const workspace = workspaceField.value;
    const duration = parseInt(durationField.value) || 0;
    if (workspace && duration > 0) {
      const total = workspaceRates[workspace] * duration;
      priceDisplay.textContent = `Estimated Price: $${total}`;
    } else {
      priceDisplay.textContent = "";
    }
  }

  workspaceField.addEventListener("change", updatePrice);
  durationField.addEventListener("input", updatePrice);

  dateField.addEventListener("change", () => {
    const selectedDate = new Date(dateField.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("You cannot select a past date.");
      dateField.value = "";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const workspace = workspaceField.value;
    const date = dateField.value;
    const time = timeField.value;
    const duration = durationField.value;

    if (workspace && date && time && duration) {
      const price = workspaceRates[workspace] * parseInt(duration);
      const bookingData = { workspace, date, time, duration, price };

      const confirmBooking = confirm(
        `Confirm your booking:\n\nWorkspace: ${workspace}\nDate: ${date}\nTime: ${time}\nDuration: ${duration}h\nTotal Price: $${price}`
      );
      if (!confirmBooking) return;

      
      const userId = parseInt(localStorage.getItem('userId')) || 1;

      fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...bookingData })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Booking confirmed!");
          form.reset();
          priceDisplay.textContent = "";
        } else {
          alert(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
    } else {
      alert("Please fill in all fields.");
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Last Booking";
  deleteBtn.type = "button";
  deleteBtn.style.marginTop = "10px";
  form.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    const userId = parseInt(localStorage.getItem('userId')) || 1;
    fetch(`http://localhost:3000/bookings/${bookings.length}`, { // Assume last ID
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Last booking deleted.");
      } else {
        alert(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  });

