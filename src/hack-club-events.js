document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.getElementById("hack-club-events")

  fetch("https://events.hackclub.com/api/events/upcoming")
    .then(res => res.json())
    .then(events => {
      htmlElement.innerHTML = `
        <h2>Upcoming Hack Club Events</h2>
        <ul>
          ${events.map(event => `
            <li>
              <strong>${event.title}</strong><br>
              ${new Date(event.start).toLocaleString()}<br>
              ${event.desc}
            </li>
          `).join('')}
        </ul>
      `
    })
    .catch(err => {
      console.error("Fetch error:", err)
      htmlElement.innerHTML = `<p>Error fetching events: ${err.message}</p>`
    })
})