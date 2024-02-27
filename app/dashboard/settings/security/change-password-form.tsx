'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { AuthPostgrestApi } from '@/types/api'
import { fetcher } from '@/lib/utils'

const formSchema = z
  .object({
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    oldPassword: z.string().trim().min(6).max(72),
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function ChangePasswordForm() {
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('oldPassword', values.oldPassword)
      formData.append('newPassword', values.newPassword)

      const { error } = await fetcher<AuthPostgrestApi>(
        '/api/v1/security/change-password',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (error) throw new Error(error?.message)

      toast.success(
        t('FormMessage.your_password_has_been_successfully_changed')
      )

      form.reset()
    } catch (e: unknown) {
      const error = e as Error
      switch (error?.message) {
        case 'Old password does not match.':
          form.setError('oldPassword', {
            message: t('FormMessage.old_password_does_not_match'),
          })
          break
        case 'New password should be different from the old password.':
          form.setError('oldPassword', {
            message: t(
              'FormMessage.new_password_should_be_different_from_the_old_password'
            ),
          })
          break
        default:
          toast.error(error?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title text="ChangePasswordForm.title" translate="yes" />
      <Separator />
      <Description text="ChangePasswordForm.description" translate="yes" />
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>{t('FormLabel.old_password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    placeholder={t('FormLabel.old_password')}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>{t('FormLabel.new_password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    placeholder={t('FormLabel.new_password')}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>{t('FormLabel.confirm_new_password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    placeholder={t('FormLabel.confirm_new_password')}
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            text="ChangePasswordForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}