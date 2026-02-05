// ===== Theme Toggle =====
const themeBtn = document.getElementById('theme-toggle');
if(themeBtn){
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });
}

// ===== Booking Slots =====
const slots = document.querySelectorAll('.slot');
const bookingList = document.getElementById('booking-list');

// Load bookings from localStorage
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

function renderBookings() {
    bookingList.innerHTML = '';
    if(bookings.length === 0) {
        bookingList.innerHTML = '<li>No sessions booked yet.</li>';
        return;
    }
    bookings.forEach((b, index) => {
        const li = document.createElement('li');
        li.textContent = `${b.day} - ${b.time}`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Cancel';
        removeBtn.style.marginLeft = '10px';
        removeBtn.onclick = () => removeBooking(index);
        li.appendChild(removeBtn);
        bookingList.appendChild(li);
    });
}

function removeBooking(index){
    bookings.splice(index,1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderBookings();
}

// Slot click event
slots.forEach(slot => {
    slot.addEventListener('click', () => {
        const booking = {
            day: slot.dataset.day,
            time: slot.dataset.time
        };
        // Prevent duplicate booking
        if(!bookings.some(b => b.day === booking.day && b.time === booking.time)){
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            renderBookings();
            alert(`Booked: ${booking.day} ${booking.time}`);
        } else {
            alert('You already booked this slot!');
        }
    });
});

// Initial render
renderBookings();
