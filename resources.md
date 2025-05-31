how to configure webpack: https://webpack.js.org/guides/getting-started/

how to add html bundler w/ webpack: https://dev.to/webdiscus/using-html-bundler-plugin-for-webpack-to-generate-html-files-30gd

sass crash course: https://www.youtube.com/watch?v=Zz6eOVaaelI

custom greeting message: https://stackoverflow.com/questions/58333086/display-greeting-morning-afternoon-evening-using-both-hours-and-minutes

displaying time: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
- ended up using dateFormat library since that's what I ended up using for displaying the date too; see stack overflow article linked somewhere below with comment "display date prettily"

live-updating clock: https://stackoverflow.com/questions/39418405/making-a-live-clock-in-javascript
- that actually won't work, instead u have to call it and then pass the function on the next line

display date prettily: https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript

grid guide on css if I need to reference it later: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

used this tutorial for making a digital clock using CSS & HTML: https://www.youtube.com/watch?v=5tC46h022YE

stack overflow on showing google calendar in a webpage (https://stackoverflow.com/questions/69636242/showing-a-users-google-calendar-in-a-webpage) led me to this documentation: https://developers.google.com/workspace/calendar/api/quickstart/js

ALL google calendar API code from this tutorial: https://developers.google.com/workspace/calendar/api/quickstart/js (the one above--would def recommend following, really great to get smth solid down as a starting point and then go from there so that ur not stuck forever at the low level)

Useful tutorial on fetching events (once I had the boilerplate down from the last tutorial, I wanted to understand how it was working so that I could manipulate it to just show events upcoming that day): https://www.youtube.com/watch?v=KjO1rhm8E3w

Guide specifically on how to filter (google documentation): https://developers.google.com/workspace/calendar/api/v3/reference/events/list

stack overflow on how to check if a prompt is a certain datatype: https://stackoverflow.com/questions/62926510/how-would-i-check-if-a-prompt-is-a-string-number-boolean

how to have a select dropdown in a popup: https://stackoverflow.com/questions/24949285/drop-down-list-inside-a-pop-up-window-comes-up-when-button-is-pressed

another article on the same thing: https://stackoverflow.com/questions/42180532/creating-a-pop-up-window-from-a-drop-down-box

convert a string to a date: https://stackoverflow.com/questions/5619202/parsing-a-string-to-a-date-in-javascript

Guidelines: 
🧠 Must-Have UI Components
1. Current Time + Date
Clean digital clock with large font.

Optionally, show time left in current time block or work session.

2. Current Time Block
Clearly show what you’re supposed to be doing right now.

Pull this from a Google Calendar or local .ics file or text schedule.

Optional: Include your “intention” for the block (e.g., “Write essay draft”).

3. Daily Schedule Overview
Visual timeline (horizontal bar or vertical list).

Color-coded blocks for deep work, breaks, admin, etc.

Maybe 12–14 hours visible at once.

4. Focus Timer / Pomodoro
Optional Pomodoro-style timer or deep work countdown.

Can switch between 25/5, 50/10, or custom intervals.

Subtle visual feedback (e.g., a progress ring or bar).

5. Status Message or Affirmation
Inspirational quote or personal focus mantra.

Examples: “Attention is your most valuable asset.” / “You planned this, now follow through.”

6. Distraction Tally / Accountability
Option to manually log distractions or times you broke focus.

Visualize focus vs. distracted moments today.

Optional: daily/weekly focus score.

🧩 Optional but Useful Additions
Weather: Simple, low-profile widget (to plan breaks/outdoor time).

Ambient Noise Toggle: If connected to speakers, control ambient noise (e.g., white noise, rain).

Wi-Fi/Internet status: Subtle indicator, so you can verify it’s up.

Current Goal: Weekly goal or priority briefly displayed.

QR Code: Link to a planning doc or Notion workspace you use.

🎨 UI Design Tips
Minimalist: Black background, white or soft-colored text.

Calm animations: Smooth transitions, avoid flashing or moving elements.

Dark mode always on: Helps it blend in and stay unobtrusive.

Low interaction: Ideally controlled via keyboard shortcuts, a rotary encoder, or daily sync with your calendar.

🛠 Tech Stack Suggestions (Optional)
UI: Flask or Electron with a local dashboard, or use something like DAKboard or MagicMirror² and customize.

Display: 7"–10" HDMI touchscreen or e-ink display.

Input: Rotary encoder, small wireless keyboard, or automate as read-only.