export const generateKey = (): string => {
  return crypto.randomUUID().slice(0, 6);
};
