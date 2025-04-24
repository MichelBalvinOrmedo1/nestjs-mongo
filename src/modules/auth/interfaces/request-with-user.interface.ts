import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    tipoUsuario: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}
