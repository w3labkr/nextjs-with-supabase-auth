import * as React from 'react'
import type { Metadata } from 'next'

import { SignInLinkButton } from '@/components/auth/signin-link-button'
import { Logo } from '@/components/auth/logo'
import { Title } from '@/components/auth/title'
import { Description } from '@/components/auth/description'
import { SignUpPolicyLink } from '@/components/auth/signup-policy-link'
import { RelatedLink } from '@/components/auth/related-link'
import { LanguageToggleButton } from '@/components/auth/language-toggle-button'
import { SignUpForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
}

export default function SignUpPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <SignInLinkButton className="absolute right-4 top-4 md:right-8 md:top-8" />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title>Create an account</Title>
          <Description>
            Enter your email below to create your account
          </Description>
        </div>
        <div className="grid gap-6">
          <SignUpForm />
          <SignUpPolicyLink />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink href="/auth/signin">
            Already have an account? Sign In
          </RelatedLink>
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}