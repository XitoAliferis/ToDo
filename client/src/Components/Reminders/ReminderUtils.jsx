

export const convertToLocal = (utcDate) => {
  const date = new Date(utcDate);
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  const localISOString = localDate.toISOString().substring(0, 16);
  return localISOString;
};
