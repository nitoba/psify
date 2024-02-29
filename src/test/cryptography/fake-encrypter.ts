import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async verify(token: string): Promise<boolean> {
    return token.includes('valid-token')
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
