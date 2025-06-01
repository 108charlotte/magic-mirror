import './style.scss'
import dateFormat from 'dateformat'

document.addEventListener('DOMContentLoaded', () => {
  customMessage()
  showDate()
  showTime()
  setInterval(showTime, 1000)

  var addTaskButton = document.getElementById('new-task')
  addTaskButton.style.display = "block"
  addTaskButton.textContent = "New Active Task"

  var goalElement = document.getElementById('goal')
  var savedGoal = localStorage.getItem('currentGoal')
  goalElement.innerHTML = 'Current Task: <span class="task-text">' + (savedGoal && savedGoal.length > 0 ? savedGoal : "No task set") + '</span>'

  addTaskButton.addEventListener('click', function() {
    var newGoal = prompt("Enter your goal:")
    localStorage.setItem('currentGoal', newGoal ? newGoal : "")
    goalElement.innerHTML = 'Current Task: <span class="task-text">' + (newGoal && newGoal.length > 0 ? newGoal : "No task set") + '</span>'
  })

  goalElement.addEventListener('click', function() {
    crossOffTask()
  })
})

function customMessage() {
  var myDate = new Date()
  var hrs = myDate.getHours()
  var mins = myDate.getMinutes()
  var greet

  //   morning |  5:30-11:59
  // afternoon | 12:00-17:59
  //   evening | 18:00-05:29
  if (hrs >= 5 && ((hrs == 5 && mins >= 30) || (hrs > 5 && hrs < 12)))
    greet = 'Good Morning'
  else if (hrs >= 12 && hrs < 18)
    greet = 'Good Afternoon'
  else if ((hrs >= 18 && hrs < 24) || hrs > 0)
    greet = 'Good Evening'
  else
    greet = 'Error'

  document.getElementById('greeting').textContent = greet 
}

function showTime() {
    var date = new Date()
    var formattedTime = dateFormat(date, "h:MM:ss TT")
    document.getElementById('hours').textContent = dateFormat(date, "h")
    document.getElementById('minutes').textContent = dateFormat(date, "MM")
    document.getElementById('seconds').textContent = dateFormat(date, "ss")
    document.getElementById('am-pm').textContent = dateFormat(date, "TT")
}

function showDate() {
    var now = new Date();
    var formattedDate = dateFormat(now, "dddd, mmmm dS, yyyy");
    document.getElementById('date').textContent = "Current Date: " + formattedDate;
}

function crossOffTask() {
  var taskSpan = document.querySelector('#goal .task-text')
  if (!taskSpan) return
  if (taskSpan.style.textDecoration === "line-through") {
    taskSpan.style.textDecoration = "none"
    taskSpan.style.color = "black"
  } else if (taskSpan.textContent !== "No task set") {
    taskSpan.style.textDecoration = "line-through"
    taskSpan.style.color = "gray"
  } else {
    alert("Please set a task first.")
  }
}