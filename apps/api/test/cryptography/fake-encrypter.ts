import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async decrypt<T>(token: string): Promise<T> {
    return JSON.parse(token) as T
  }

  async verify(token: string): Promise<boolean> {
    return token.includes('valid-token')
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
