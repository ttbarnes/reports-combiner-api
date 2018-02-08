// @flow
import type { $Request, $Response } from 'express';

export const get = (
  req: $Request,
  res: $Response,
): $Response => {
  const mock = [
    { exchangeAMock: true }, { exchangeBMock: true }
  ];
  return res.json(mock);
};
