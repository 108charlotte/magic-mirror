document.addEventListener("DOMContentLoaded", () => {
  console.log("Hack Club Events script loaded")
  const htmlElement = document.getElementById("hack-club-events")

  fetch("https://api.codetabs.com/v1/proxy?quest=https://events.hackclub.com/api/events/upcoming")
    .then(res => res.text())
    .then(raw => {
      console.log("Raw response:", raw)
      let events
      try {
        events = JSON.parse(raw)
      } catch (err) {
        console.error("JSON parse error:", raw)
        throw err
      }

      htmlElement.innerHTML = `
        <h2>Upcoming Hack Club Events</h2>
        <div class="events-list">
          ${events.length === 0 ? "<p>No upcoming events found.</p>" : ""}
          ${events.map(event => `
            <div class="event">
              <div class="event-title">${event.title}</div>
              <div class="event-time">${new Date(event.start).toLocaleString()}</div>
              <div class="event-desc">${event.desc}</div>
            </div>
          `).join('')}
          <br>
      `
    })
    .catch(err => {
      console.error("Fetch error:", err)
      htmlElement.innerHTML = `<p>Error fetching events: ${err.message}</p>`
    })
})