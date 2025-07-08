export const serialize = (v: any) => {
    if (v === undefined || v === null || (typeof v === "string" && v === "undefined")) {
        return 'undefined';
    } else {
        return JSON.stringify(v);
    }
}