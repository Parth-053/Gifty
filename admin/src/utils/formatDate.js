import moment from "moment";

export const formatDate = (date) => {
  if (!date) return "-";
  return moment(date).format("MMM DD, YYYY");
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  return moment(date).format("MMM DD, YYYY h:mm A");
};

export const fromNow = (date) => {
  if (!date) return "-";
  return moment(date).fromNow();
};