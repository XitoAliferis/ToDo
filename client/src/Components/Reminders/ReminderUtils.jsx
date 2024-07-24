import moment from 'moment-timezone';

export const convertToLocal = (utcDate) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the user's timezone
  return moment.utc(utcDate).add(4, 'hours').tz(timezone).format('YYYY-MM-DDTHH:mm');
};
