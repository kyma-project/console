const TIMEOUT_SECONDS = 240;
console.log(!!process.env);
console.log(process.env);
console.log(`Setting default timeout to ${TIMEOUT_SECONDS} seconds`);

jest.setTimeout(TIMEOUT_SECONDS * 1000);
