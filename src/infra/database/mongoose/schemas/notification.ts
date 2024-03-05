import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

@Schema()
export class Notification {
  @Prop({ type: mongoose.Types.UUID })
  id: string

  @Prop()
  subject: string

  @Prop()
  content: string

  @Prop()
  to: string

  @Prop()
  createdAt: Date
}

export type NotificationDocument = HydratedDocument<Notification>

export const NotificationSchema = SchemaFactory.createForClass(Notification)
