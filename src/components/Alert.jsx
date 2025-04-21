export default function Alert(props) {
  const alertHeight = props.alert ? "40px" : "0px";

  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const alertColors = {
    success: "bg-green-100 text-green-800 border-green-400",
    danger: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div
      style={{ height: alertHeight, transition: "height 0.3s ease" }}
      className="overflow-hidden"
    >
      {props.alert && (
        <div
          className={`flex items-center justify-between px-4 py-2 border rounded-md shadow-sm ${
            alertColors[props.alert.type] || alertColors.info
          }`}
          role="alert"
        >
          <span className="font-medium">
            {capitalize(props.alert.type)}: {props.alert.msg}!
          </span>
        </div>
      )}
    </div>
  );
}
