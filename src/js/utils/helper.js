export const findStatusButtonColor = (status) => {
  let statusColor;
  switch (status) {
    case "paid":
      statusColor = "green";
      break;
    case "pending":
      statusColor = "orange";
      break;
    default:
      statusColor = "grey";
  }
  return statusColor;
};

export const formatDate = (givenDate) => {
  const d = new Date(givenDate);
  const year = d.getFullYear();
  const date = d.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[d.getMonth()];
  return `${date} ${monthName} ${year}`;
};

export const curencyFormatNumber = (number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "GBP" }).format(
    number
  );

export const getCurrentDate = (myDate) => {
  const today = myDate ? new Date(myDate) : new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return `${year}-${month}-${date}`;
};
