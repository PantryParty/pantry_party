export const isNSDictionary = (x: any): x is NSDictionary<any, any> => {
  return x && x.objectForKey !== undefined;
};
