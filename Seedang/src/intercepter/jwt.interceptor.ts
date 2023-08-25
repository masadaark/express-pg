import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secretKey = 'lubsudyord1234';

export function jwtSign(userId: number): string {
  const atClaims: JwtPayload = {};
  atClaims['id'] = userId;
  atClaims['exp'] = Math.floor(Date.now() / 1000) + 1000000;
  const token = jwt.sign(atClaims, secretKey);
  return token;
}

export function jwtVerify(req: Request, res: Response, next: NextFunction) {
  const tokenString = req.headers.authorization?.split(' ')[1] || '';
  jwt.verify(tokenString, secretKey, (err, decoded) => {
    if (err) return res.status(200).json({ result: 'nok', error: err.message });
    const claims = decoded as JwtPayload;
    if (claims) {
      req['userId'] = Number(claims['id']);
      next()
    } else return res.status(200).json({ result: 'nok', error: 'invalid token' });
  });
}