import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

export type AvailableTimeProps = {
  weekday: number
  time: Time
  psychologistId: UniqueEntityID
}

export class AvailableTime extends Entity<AvailableTimeProps> {
  get weekday(): number {
    return this.props.weekday
  }

  get time(): Time {
    return this.props.time
  }

  changeWeekday(weekday: number) {
    this.props.weekday = weekday
  }

  changeTime(time: Time) {
    this.props.time = time
  }

  static hasHalfHourDifference(
    times: {
      weekday: number
      time: string
    }[],
    weekday: number,
  ): boolean {
    // Filtra os horários disponíveis para o dia da semana especificado
    const weekdayTimes = times.filter((time) => time.weekday === weekday)

    // Se só tem um horário, não tem como ter diferença de 30 minutos
    if (weekdayTimes.length === 1) {
      return true
    }

    // Converte os horários para minutos após a meia-noite
    const minutes = weekdayTimes.map((time) => {
      const [hours, minutes] = time.time.split(':').map(Number)
      return hours * 60 + minutes
    })

    // Ordena os horários em ordem crescente
    minutes.sort((a, b) => a - b)

    // Verifica se existe uma diferença de 30 minutos entre os horários
    for (let i = 1; i < minutes.length; i++) {
      if (minutes[i] - minutes[i - 1] >= 30) {
        return true
      }
    }

    return false
  }

  static create(props: AvailableTimeProps, id?: UniqueEntityID): AvailableTime {
    return new AvailableTime(props, id)
  }
}
