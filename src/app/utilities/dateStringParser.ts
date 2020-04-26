export const dateStringParser = (str: string): Date => {
  const data = str.split("-").map(Number);
  data[1] -= 1;

  return new Date(data[0], data[1], data[2]);
};
