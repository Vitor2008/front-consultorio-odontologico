export const formatarData = (dataISO?: string): string => {
    console.log("dataISO", dataISO);
    if (!dataISO) return "";
    return new Date(dataISO).toISOString().split("T")[0];
};