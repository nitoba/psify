import { Inject, Injectable } from '@nestjs/common'
import { NotificationPublisher } from '@/domain/notification/application/notification-publisher/publisher'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { MODULE_OPTIONS_TOKEN } from './node-mailer/node-mailer.module-definition'
import { NodeMailerModuleOptions } from './node-mailer/node-mailer-options'
import nodemailer, { Transporter } from 'nodemailer'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import {
  orderApprovedEmail,
  appointmentApprovedEmail,
  appointmentRejectedEmail,
  appointmentRequestedEmail,
} from '@psyfi/transactional'

@Injectable()
export class NodeMailerNotificationPublisher implements NotificationPublisher {
  private transporter: Transporter
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private config: NodeMailerModuleOptions,
    private readonly authPatientRepository: AuthPatientRepository,
    private readonly authPsychologistRepository: AuthPsychologistRepository,
  ) {
    this.transporter = nodemailer.createTransport({
      ...this.config.options,
    })
  }

  async publish(notification: Notification): Promise<void> {
    switch (notification.subjectType) {
      case 'appointment_requested': {
        const psychologist = await this.authPsychologistRepository.findByEmail(
          notification.to,
        )

        if (!psychologist) return

        const emailHtml = appointmentRequestedEmail({
          username: psychologist.name,
          linkToRedirect: 'https://www.google.com',
        })

        await this.transporter.sendMail({
          from: 'contant@psyfi.com.br',
          to: notification.to,
          subject: notification.subject,
          html: emailHtml,
        })
        break
      }

      case 'appointment_rejected': {
        const patient = await this.authPatientRepository.findByEmail(
          notification.to,
        )

        if (!patient) return

        const emailHtml = appointmentRejectedEmail({
          username: patient.name,
        })

        await this.transporter.sendMail({
          from: 'contant@psyfi.com.br',
          to: notification.to,
          subject: notification.subject,
          html: emailHtml,
        })
        break
      }

      case 'appointment_approved': {
        const patient = await this.authPatientRepository.findByEmail(
          notification.to,
        )

        if (!patient) return

        const emailHtml = appointmentApprovedEmail({
          username: patient.name,
          linkToRedirect: 'https://www.google.com',
        })

        await this.transporter.sendMail({
          from: 'contant@psyfi.com.br',
          to: notification.to,
          subject: notification.subject,
          html: emailHtml,
        })
        break
      }

      case 'order_approved': {
        const patient = await this.authPatientRepository.findByEmail(
          notification.to,
        )

        if (!patient) return

        const emailHtml = orderApprovedEmail({
          username: patient.name,
          linkToRedirect: 'https://google.com',
        })

        await this.transporter.sendMail({
          from: 'contant@psyfi.com.br',
          to: notification.to,
          subject: notification.subject,
          html: emailHtml,
        })
      }
    }
  }
}
