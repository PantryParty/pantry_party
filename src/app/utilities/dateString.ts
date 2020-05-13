export const toDateString = (date: Date) => {
  return [
    date.getFullYear(),
    (date.getMonth() > 8 ? "" : "0") + (date.getMonth() + 1),
    (date.getDate() > 9 ? "" : "0") + date.getDate()
  ].join("-");
};

export const relativeDate =
  (dayAdjustment: number, baseMs = Date.now()) => new Date(baseMs + dayAdjustment * 24 * 3600 * 1000);
