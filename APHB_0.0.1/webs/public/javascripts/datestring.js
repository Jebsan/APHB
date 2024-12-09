/*  datestring.js -- client-side script to convert UNIX times to strings  */
/*      Used in the "today" button in /admin/announce, /admin/events      */

function stringifyDate(unixDate) {
  var monthLUT = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  var weekdayLUT = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  var dateObj = new Date(unixDate * 1000);
  var weekdayStr = `${weekdayLUT[dateObj.getDay()]}`;
  var monthStr = `${monthLUT[dateObj.getMonth()]}`;
  var monthday = dateObj.getDate();
  var monthdayStr = `${monthday}`;
  var yearStr = `${dateObj.getFullYear()}`;

  var dateString = "";
  dateString += `${weekdayStr}, `;
  dateString += `${monthStr} `;
  dateString += `${monthdayStr}`;
  /* Uncomment next line for "12th", "23rd", etc. */
  // dateString += `${getOrd(monthday)}, ${yearStr}`;

  return dateString;
}

function getOrd(num) {
  var ord = "";
  switch (true) {
    case num == 1 || num == 21 || num == 31:
      ord = "st";
      break;
    case num == 2 || num == 22:
      ord = "nd";
      break;
    case num == 3 || num == 23:
      ord = "rd";
      break;
    default:
      ord = "th";
      break;
  }
  return ord;
}

function todayString() {
  let now = new Date();
  return stringifyDate(Math.round(now.getTime() / 1000));
}
