import { describe, expect, it } from '@jest/globals';

//************* helpers *********************************//
import { createToken, decodeToken, verifyToken } from './jwt';

let tokenTest =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InRva2VuIjoidG9rZW4ifSwiaWF0IjoxNjY5MDU5MzEyfQ.88PLnvoLPNkcmZJ9v9RTCLi3vzhDC3njTjXT8ABfdg8';

describe('jwt methods token', () => {
  it('response success create token', () => {
    let info = {
      token: 'token',
    };

    let token = createToken(info);
    expect(token).toBeDefined();
  });

  it('response success verify token', () => {
    let data = verifyToken(tokenTest);
    expect(data.user.token).toEqual('token');
  });

  it('response success decode token', () => {
    let data = decodeToken(tokenTest);
    expect(data.user.token).toEqual('token');
  });
});
