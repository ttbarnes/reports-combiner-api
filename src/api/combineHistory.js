// @flow

// todo: learn to use real type definitions for express
type ReqType = { body?: Object };
type ResType = { json: Function, download: Function };

export const get = (
  req: ReqType,
  res: ResType,
): Object => {
  const mock = [
    { exchangeAMock: true }, { exchangeBMock: true }
  ];
  return res.json(mock);
};
