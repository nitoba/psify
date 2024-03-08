export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<string>

  abstract verify(token: string): Promise<boolean>
  abstract decrypt<T>(token: string): Promise<T>
}
