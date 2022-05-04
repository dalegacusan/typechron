export const CurrentTimeInMs = () => new Date().getTime();

// @ref https://stackoverflow.com/a/40304231/12278028
export const AddOneDayFromUnixTimestamp = (timestamp: number): number => {
  const timestampDate = new Date(timestamp);

  return timestampDate.setHours(timestampDate.getHours() + 24);
};
