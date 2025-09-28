export const mapperGeneric = <T, U>(data: T, mapFn: (data: T) => U): U => {
  return mapFn(data);
};
