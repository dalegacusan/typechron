export const CurrentTimeInMs = () => new Date().getTime();

export const AddOneDayFromUnixTimestamp = (timestamp: number): number => {
  const timestampDate = new Date(timestamp);

  return timestampDate.setHours(timestampDate.getHours() + 24);
};
