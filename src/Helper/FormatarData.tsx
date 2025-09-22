export const formatarData = (dataISO?: string): string => {
    if (!dataISO) return "";
    return new Date(dataISO).toISOString().split("T")[0];
};