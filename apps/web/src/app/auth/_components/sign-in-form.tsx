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
import { Checkbox } from '@/components/ui/checkbox'
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(['patient', 'psychologist']).default('patient'),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      type: 'patient',
    },
  })

  function onSubmit(values: SignInFormValues) {
    console.log(values)
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
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex items-center gap-1.5 space-y-0">
                  <FormLabel>I'm a psychologist</FormLabel>
                  <FormControl>
                    <Checkbox
                      {...field}
                      onCheckedChange={(checked) => {
                        form.setValue(
                          'type',
                          checked ? 'psychologist' : 'patient',
                        )
                      }}
                    />
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
            >
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </Button>

            <Button className="w-full" type="submit">
              Sign in
            </Button>
            <Button className="w-full" variant="ghost" asChild>
              <Link href="/auth/sign-up">Create an account</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
