import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles-decorator'
import { PayloadUser } from '../strategies/jwt.strategy'
import { Role } from '../roles'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    console.log(requiredRoles)

    if (!requiredRoles) {
      return true
    }

    const user = req.user as PayloadUser

    const matchRoles = this.matchRoles(requiredRoles, user.role as Role)

    return matchRoles
  }

  private matchRoles(requiredRoles: Role[], userRole: Role) {
    return requiredRoles.includes(userRole)
  }
}
