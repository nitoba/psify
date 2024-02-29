import { Injectable, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    this.schema.parse(value)
    return value
  }
}
