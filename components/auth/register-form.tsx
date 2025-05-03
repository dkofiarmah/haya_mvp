'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormError, FormSuccess, FormButton } from '@/components/auth/auth-form'
import { Checkbox } from '@/components/ui/checkbox'

// Define the form validation schema
const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  organizationName: z.string().min(1, 'Organization name is required'),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' })
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      agreeToTerms: false
    }
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (formData) => {
    setError(null);
    setSuccess(null);
    setIsPending(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          organizationName: formData.organizationName
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      setSuccess('Account created! Please check your email to verify your account.');
      form.reset();
      
      // Redirect to verification page after short delay
      setTimeout(() => {
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
        <CardDescription>
          Get started with Haya for your travel business
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormError error={error} />
          <FormSuccess message={success} />
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              disabled={isPending}
              {...form.register('fullName')}
              aria-invalid={!!form.formState.errors.fullName}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isPending}
              {...form.register('email')}
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                disabled={isPending}
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">At least 8 characters</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                disabled={isPending}
                {...form.register('confirmPassword')}
                aria-invalid={!!form.formState.errors.confirmPassword}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizationName">Company Name</Label>
            <Input
              id="organizationName"
              placeholder="Your Tour Company"
              disabled={isPending}
              {...form.register('organizationName')}
              aria-invalid={!!form.formState.errors.organizationName}
            />
            {form.formState.errors.organizationName && (
              <p className="text-sm text-destructive">{form.formState.errors.organizationName.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              disabled={isPending}
              checked={form.getValues('agreeToTerms')}
              onCheckedChange={(checked) => {
                form.setValue('agreeToTerms', checked as boolean, { shouldValidate: true });
              }}
            />
            <label
              htmlFor="agreeToTerms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {form.formState.errors.agreeToTerms && (
            <p className="text-sm text-destructive">{form.formState.errors.agreeToTerms.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <FormButton isLoading={isPending} disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </FormButton>
        </CardFooter>
      </form>
      <div className="px-8 pb-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
