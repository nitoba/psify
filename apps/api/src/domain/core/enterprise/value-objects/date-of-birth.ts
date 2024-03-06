import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type DateOfBirthProps = {
  value: Date
}

export class DateOfBirth extends ValueObject<DateOfBirthProps> {
  get value(): Date {
    return this.props.value
  }

  static create(dateOfBirth: Date): Either<InvalidResource, DateOfBirth> {
    if (!this.validate(dateOfBirth)) {
      return left(new InvalidResource('Invalid date of birth'))
    }
    return right(new DateOfBirth({ value: dateOfBirth }))
  }

  private static validate(dateOfBirth: Date): boolean {
    return !isNaN(dateOfBirth.getTime())
  }
}

// type HealthPlanProps = {
//   value: string
// }

// export class HealthPlan extends ValueObject<HealthPlanProps> {
//   get value(): string {
//     return this.props.value
//   }

//   static create(healthPlan: string): Either<InvalidResource, HealthPlan> {
//     if (!this.validate(healthPlan)) {
//       return left(new InvalidResource('Invalid health plan'))
//     }
//     return right(new HealthPlan({ value: healthPlan }))
//   }

//   private static validate(healthPlan: string): boolean {
//     return healthPlan.length <= 255
//   }
// }

// type DateProps = {
//   value: Date
// }

// export class Date extends ValueObject<DateProps> {
//   get value(): Date {
//     return this.props.value
//   }

//   static create(date: Date): Either<InvalidResource, Date> {
//     if (!this.validate(date)) {
//       return left(new InvalidResource('Invalid date'))
//     }
//     return right(new Date({ value: date }))
//   }

//   private static validate(date: Date): boolean {
//     return !isNaN(date.getTime())
//   }
// }

// type ObservationsProps = {
//   value: string
// }

// export class Observations extends ValueObject<ObservationsProps> {
//   get value(): string {
//     return this.props.value
//   }

//   static create(observations: string): Either<InvalidResource, Observations> {
//     if (!this.validate(observations)) {
//       return left(new InvalidResource('Invalid observations'))
//     }
//     return right(new Observations({ value: observations }))
//   }

//   private static validate(observations: string): boolean {
//     return observations.length <= 1000
//   }
// }
