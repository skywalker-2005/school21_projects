const dayStart = "07:30";
const dayEnd = "17:45";

const [start_h, start_m] = dayStart.split(":").map(Number);
const start_minutes = start_h * 60 + start_m;
const [end_h, end_m] = dayEnd.split(":").map(Number);
const end_minutes = end_h * 60 + end_m;

function scheduleMeeting(startTime, durationMinutes) {
  const [date_h, date_m] = startTime.split(":").map(Number);
  let date_minutes = date_h * 60 + date_m;

  if (date_minutes < start_minutes || date_minutes > end_minutes) return false;
  else {
    date_minutes += durationMinutes;
    if (date_minutes <= end_minutes) return true;
    else return false;
  }
}

// console.log(scheduleMeeting("07:30", 15));
// console.log(scheduleMeeting("07:15", 30));
// console.log(scheduleMeeting("7:30", 30));
// console.log(scheduleMeeting("11:30", 60));
// console.log(scheduleMeeting("17:00", 45));
// console.log(scheduleMeeting("17:30", 30));
// console.log(scheduleMeeting("18:00", 15));
