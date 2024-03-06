export type NodeMailerModuleOptions = {
  options: {
    host: string
    port: number
    auth: {
      user: string
      pass: string
    }
  }
}
