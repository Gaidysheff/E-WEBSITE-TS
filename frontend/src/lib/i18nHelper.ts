export const getZodTranslation = (errorKey: string, LL: any): string => {
  if (!errorKey || !errorKey.includes(".")) return errorKey;
  try {
    return errorKey.split(".").reduce((obj, key) => obj?.[key], LL) instanceof
      Function
      ? (errorKey.split(".").reduce((obj, key) => obj?.[key], LL) as Function)()
      : errorKey;
  } catch {
    return errorKey;
  }
};
