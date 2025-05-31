document.addEventListener("DOMContentLoaded", () => {
    var alarmButton = document.getElementById("alarm")
    var eventButton = document.getElementById("event")
    var focusButton = document.getElementById("schedule-focus")

    var scheduleTable = document.getElementById("schedule-table").getElementsByTagName("tbody")[0]; 

    alarmButton.addEventListener('click', function() {
        var time = prompt("What time are you waking up? ")
        if (time) {
            var row = scheduleTable.insertRow(); 
            switch (time) {
                case "5": 
                    row.insertCell(0).textContent = "5:00"
                    break; 
                case "4": 
                    row.insertCell(0).textContent = "4:00"
                    break; 
                default: 
                    row.insertCell(0).textContent = time; 
            }
            row.insertCell(1).textContent = "Wake up"
        }
    })

    eventButton.addEventListener('click', function() {
        
    })

    focusButton.addEventListener('click', function() {
        
    })
})