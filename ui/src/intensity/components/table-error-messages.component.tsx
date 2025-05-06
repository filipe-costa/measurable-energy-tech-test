export const ErrorMessages = ({ messages }: { messages: string[] }) => {
  return (
    <div>
      {messages.map((m) => (
        <p>{capitalizeMessage(m)}</p>
      ))}
    </div>
  );
};

function capitalizeMessage(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
