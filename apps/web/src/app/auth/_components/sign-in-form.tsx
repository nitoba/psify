'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { InputPassword } from '@/components/ui/input-password'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const { replace } = useRouter()
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit({ email, password }: SignInFormValues) {
    const res = await api.auth.authenticate.mutation({
      body: {
        email,
        password,
      },
    })

    if (res.status !== 200) {
      return toast.error(res.body.message)
    }

    replace('/')
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button
              variant="link"
              size="sm"
              className="text-muted-foreground px-0 ml-auto"
              asChild
              disabled={form.formState.isSubmitting}
            >
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </Button>

            <Button
              className="w-full gap-2"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              Sign in
              {form.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              asChild
              disabled={form.formState.isSubmitting}
            >
              <Link href="/auth/sign-up">Create an account</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
