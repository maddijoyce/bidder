import { sign, verify } from 'jsonwebtoken';

import db from '../../config/mongo';

export function encodeUser({ email }) {
  return sign({ email }, process.env.SECRET, {
    algorithm: 'HS512',
    audience: 'user',
    expiresIn: '2h',
    issuer: process.env.npm_package_version,
  })
}

export async function decodeUser(token) {
  const { email } = verify(token, process.env.SECRET, {
    algorithms: ['HS512'],
    audience: 'user',
    issuer: process.env.npm_package_version,
    maxAge: '1d',
  });
  const user = await db.Users.findOne({ email });
  if (!user) throw 'User Does Not Exist';
  return user;
}

export default async function authorization(ctx, next) {
  let user;

  const token = (ctx.headers.authorization || '').split(' ');
  if (token[0] === 'Bearer' && token[1]) {
    try {
      user = await decodeUser(token[1]);
      const newToken = encodeUser(user);
      ctx.response.set('Authorization', `Bearer ${newToken}`);
      ctx.user = user;
    } catch (e) {
      if (e.message != 'jwt audience invalid. expected: user') {
        ctx.response.set('Authorization', `Error ${e}`);
      }
    }
  }

  ctx.response.set('access-control-expose-headers', 'etag, content-encoding, content-length, location, Authorization');
  await next();
}
