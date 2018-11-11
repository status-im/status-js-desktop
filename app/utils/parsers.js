const CONTACT_CODE_REGEXP = /^(0x)?[0-9a-f]{130}$/i;
export const isContactCode = str => CONTACT_CODE_REGEXP.test(str);
