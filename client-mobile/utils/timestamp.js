export const convertTimestamp = (time = { seconds: 0, nanoseconds: 0 }) => {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();
  return `${date} ${atTime}`;
};
