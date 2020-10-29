import { Request, Response, NextFunction, request } from 'express';
import * as jwt from 'jsonwebtoken';

export const auth = async (request: Request, response: Response, next: NextFunction) => {

    const authHeader = request.headers.authorization

    if(!authHeader){
        return response.status(401).send({ message: 'Token é necessário!' });
    }


    // Bearer 'token'
    const [ , token] = authHeader.split(' ');

    await jwt.verify(token, `${process.env.SECRET}`, function(err: any, decodedToken: any) {
        if(err){
            return response.status(401).send({ message: 'Token inválido!', erro: err })
        } else {
            response.locals.user = decodedToken.id;
            next()
        }
    })
  

}
