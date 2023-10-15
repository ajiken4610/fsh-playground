import createDomPurify from "dompurify";
const sanitize = createDomPurify().sanitize;
export default (dirty: string) => sanitize(dirty);
