import { HttpException, HttpStatus } from '@nestjs/common';
import { permitUser } from 'src/enums/rols.enums';

export function adminOnly(permission: string) {
  if (permission !== permitUser.ADMIN) {
    throw new HttpException(
      'Requiere Permisos de Admin',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export function onlySeeCreateDelete(permission: string) {
  if (permission === permitUser.ADMIN) {
    return;
  } else if (permission !== permitUser.SEE_CREATE_DELETE) {
    throw new HttpException('No tienes permisos', HttpStatus.UNAUTHORIZED);
  }
}

export function onlyUpdate(permission: string) {
  if (permission === permitUser.ADMIN) {
    return;
  } else if (permission !== permitUser.UPDATE) {
    throw new HttpException(
      'No tienes permisos para actualizar',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export function onlyDelete(permission: string) {
  if (permission === permitUser.ADMIN) {
    return;
  } else if (permission === permitUser.SEE_CREATE_DELETE) {
    return;
  } else if (permission !== permitUser.DELETE) {
    throw new HttpException(
      'No tienes permisos para eliminar',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
