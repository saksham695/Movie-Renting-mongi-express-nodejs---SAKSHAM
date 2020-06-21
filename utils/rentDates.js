function calculateDays(date1, date2) {
  // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
  console.log(date1, date2);
  date1 = date1.split("-");
  date2 = date2.split("-");

  // Now we convert the array to a Date object, which has several helpful methods
  date1 = new Date(date1[2], date1[1], date1[0]);
  date2 = new Date(date2[2], date2[1], date2[0]);

  // We use the getTime() method and get the unixTime (in milliseconds, but we want seconds, therefore we divide it through 1000)
  const date1_unixTime = parseInt(date1.getTime() / 1000);
  const date2_unixTime = parseInt(date2.getTime() / 1000);

  const timeDifference = date2_unixTime - date1_unixTime;

  // in Hours
  const timeDifferenceInHours = timeDifference / 60 / 60;

  // and finally, in days :)
  const timeDifferenceInDays = timeDifferenceInHours / 24;

  return timeDifferenceInDays;
}

module.exports = calculateDays;
