export const dateString = (dayAdjustment = 0, baseMs = Date.now()) => {
  const date = new Date(baseMs + dayAdjustment * 24 * 3600 * 1000);

  return [
    date.getFullYear(),
    (date.getMonth() > 8 ? "" : "0") + (date.getMonth() + 1),
    (date.getDate() > 9 ? "" : "0") + date.getDate()
  ].join("-");
};
