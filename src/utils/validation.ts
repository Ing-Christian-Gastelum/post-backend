import { ConflictException } from '@nestjs/common';

export function validateUUID(uuid: string): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(uuid);
}

export function ValidationIdUser(id: string) {
  if (!validateUUID(id)) {
    throw new ConflictException({
      message: 'Id invalido.',
    });
  }
}
