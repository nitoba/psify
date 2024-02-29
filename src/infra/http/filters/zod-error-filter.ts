import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { ZodError } from 'zod'
@Catch(ZodError)
export class ZodFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = 400
    response.status(status).send({
      errors: exception.flatten().fieldErrors,
      // message: exception.flatten().,
      statusCode: status,
    })
  }
}
