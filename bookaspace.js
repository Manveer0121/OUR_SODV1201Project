const form =  document.getElementById("bookingForm");
const workspaceField=document.getElementById("workspace");
 const dateField = document.getElementById("date");
const timeField = document.getElementById("time");
  const durationField = document.getElementById("duration");

const workspaceRates = {
  "Private office":  25,
   "Shared desk":10,
  "Meeting room": 15
};


const priceDisplay = document.createElement("p");
priceDisplay.style.marginTop = "10px";
priceDisplay.style.fontWeight =  "bold";
form.appendChild(priceDisplay);


function updatePrice() {
  const workspace = workspaceField.value;
const duration = parseInt(durationField.value) || 0;

  if (workspace &&duration >  0) {
    const total =  workspaceRates[workspace] * duration;
      priceDisplay.textContent = `Estimated Price: $${total}`;
  } 
  else {
    priceDisplay.textContent = "";
  }
}

workspaceField.addEventListener("change", updatePrice);
durationField.addEventListener("input", updatePrice);

dateField.addEventListener("change",() => {
  const selectedDate  = new Date(dateField.value);
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
  const date  =dateField.value;
  const  time = timeField.value;
  const duration=durationField.value;

  if(workspace && date && time && duration) {
    const bookingData = {
       workspace,
      date,
      time,
   duration,
      price: workspaceRates[workspace] * duration
    };

    const confirmBooking = confirm(
      `Confirm your booking:\n\nWorkspace: ${workspace}\nDate: ${date}\nTime: ${time}\nDuration: ${duration}h\nTotal Price: $${bookingData.price}`
    );

    if (!confirmBooking) return;


    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(bookingData);

    localStorage.setItem("bookings", JSON.stringify(bookings));


      alert("Booking confirmed!");
  form.reset();
    priceDisplay.textContent = "";
  } 
  else {
    alert("Please fill in all fields.");
  }
});

const deleteBtn =document.createElement("button");
deleteBtn.textContent =  "Delete Last Booking";
deleteBtn.type =  "button";
deleteBtn.style.marginTop= "10px";
form.appendChild(deleteBtn);

deleteBtn.addEventListener("click", () => {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  if (bookings.length > 0) {
    bookings.pop();
    localStorage.setItem("bookings", JSON.stringify(bookings));
    alert("Last booking deleted.");
  } else
     {
    alert("No bookings to delete.");
  }
});
