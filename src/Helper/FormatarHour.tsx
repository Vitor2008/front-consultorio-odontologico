export const formatarHora = (dataISO?: string): string => {
  if (!dataISO) return "";
  return dataISO.split("T")[1].substring(0, 5); // Extrai "HH:mm" da parte do tempo
};
