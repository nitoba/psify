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

const signUpSchema = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    phone: z.string().regex(/^\(\d{2}\) 9\d{8}$/, {
      message: 'The phone number must be in the format (xx) 9xxxxxxxx',
    }),
    crp: z
      .string()
      .min(7, { message: 'The CRP must be 7 characters' })
      .optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    type: z.enum(['patient', 'psychologist']).default('patient').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .superRefine((data, context) => {
    if (data.type === 'psychologist' && !data.crp) {
      context.addIssue({
        code: 'custom',
        message: 'The CRP is required for psychologists',
        path: ['crp'],
      })
    }
    return data.type !== 'psychologist' || !!data.crp
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      type: 'patient',
    },
  })

  function onSubmit(values: SignUpFormValues) {
    console.log(values)
  }

  const type = form.watch('type')

  return (
    <Card>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter with your information create to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(xx) 9xxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'psychologist' && (
              <FormField
                control={form.control}
                name="crp"
                render={({ field }) => (
                  <FormItem className="animate-in fade-in-0">
                    <FormLabel>CRP</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
            <Button className="w-full" type="submit">
              Sign up
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-sm">
                Already have a account?
              </span>
              <Button variant="link" className="px-0" type="button" asChild>
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
