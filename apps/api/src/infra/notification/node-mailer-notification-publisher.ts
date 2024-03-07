import { Inject, Injectable } from '@nestjs/common'
import { NotificationPublisher } from '@/domain/notification/application/notification-publisher/publisher'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { MODULE_OPTIONS_TOKEN } from './node-mailer/node-mailer.module-definition'
import { NodeMailerModuleOptions } from './node-mailer/node-mailer-options'
import nodemailer, { Transporter } from 'nodemailer'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'

import { DrizzleMailTemplateRepository } from '../database/drizzle/repositories/mail-templates-repository'

@Injectable()
export class NodeMailerNotificationPublisher implements NotificationPublisher {
  private transporter: Transporter
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private config: NodeMailerModuleOptions,
    private readonly authPatientRepository: AuthPatientRepository,
    private readonly authPsychologistRepository: AuthPsychologistRepository,
    private readonly mailTemplateRepository: DrizzleMailTemplateRepository,
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

        const template = await this.mailTemplateRepository.findByTitle(
          notification.subjectType,
        )

        if (!template) break

        const emailHtml = template.content
          .replaceAll('@username', psychologist.name)
          .replaceAll('@linkToRedirect', 'https://www.google.com')

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

        const template = await this.mailTemplateRepository.findByTitle(
          'appointment_rejected',
        )

        if (!template) return
        const emailHtml = template.content.replaceAll('@username', patient.name)

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

        const template = await this.mailTemplateRepository.findByTitle(
          'appointment_approved',
        )

        if (!template) return
        const emailHtml = template.content
          .replaceAll('@username', patient.name)
          .replaceAll('@linkToRedirect', 'https://www.google.com')

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

        const template =
          await this.mailTemplateRepository.findByTitle('order_approved')

        if (!template) return

        const emailHtml = template.content
          .replaceAll('@username', patient.name)
          .replaceAll('@linkToRedirect', 'https://www.google.com')

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
