export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<string>
}
