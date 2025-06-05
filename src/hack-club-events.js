
document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.getElementById('hack-club-events')

    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://events.hackclub.com/api/events/upcoming'))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json();
        })
        .then(data => {
            htmlElement.innerHTML = `<h2>Upcoming Hack Club Events</h2>`
            const hackClubData = JSON.parse(data.contents);
            console.log(hackClubData)
        })
        .catch(error => {
            htmlElement.innerHTML = `<p>Error fetching events: ${error.message}</p>`
        })
})