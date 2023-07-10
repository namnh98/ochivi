const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';

export const createRequestTypes = base => ({
  [REQUEST]: `${base}_${REQUEST}`,
  [SUCCESS]: `${base}_${SUCCESS}`,
  [FAIL]: `${base}_${FAIL}`
});
