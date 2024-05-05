export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()); // Extract last 2 digits of the year

  return `${day}/${month}/${year}`;
};

export const formatDateToUTC = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

  return `${formattedHours}:${minutes} ${ampm}`;
};

export const formatToUrlEncoded = (payload) => {
  const formData = new URLSearchParams();

  for (const key in payload) {
    formData.append(key, payload[key]);
  }

  return formData;
};
