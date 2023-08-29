const convertTimestamp = (time = { seconds: 0, nanoseconds: 0 }) => {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();
  return `${date} ${atTime}`;
};
export default function Message({ message = {}, loginUser = {} }) {
  return (
    <div
      className={`m-2 d-flex ${
        message?.sender == loginUser.id
          ? "justify-content-end"
          : "justify-content-start"
      }`}
    >
      <label
        className="bg-white px-3 pt-3 pb-2"
        style={{
          borderRadius: "15px",
        }}
      >
        {message?.text}
        <span
          style={{
            display: "block",
            fontSize: "0.6rem",
            marginTop: "8px",
            textAlign: "right",
            fontStyle: "italic",
          }}
        >
          {convertTimestamp(message?.timestamp)}
        </span>
      </label>
    </div>
  );
}
