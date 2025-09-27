export const convertToBase64 = (json: object) => {
  const stringJSON = JSON.stringify(json);
  return Buffer.from(stringJSON).toString('base64');
};
