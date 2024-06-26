'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'

import { Brand } from '@/components/brand'
import { Navigation } from '@/components/navigation'
import { MobileNavigation } from '@/components/mobile-navigation'
import { AccountMenu } from '@/components/account-menu'
import { SearchForm } from '@/components/search-form'

import { useAuth } from '@/hooks/use-auth'
import { cn, getArchivePath } from '@/lib/utils'
import { siteConfig } from '@/config/site'

const Header = () => {
  const { user } = useAuth()

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const archivePath = getArchivePath()

  return (
    <Sheet>
      <SheetContent className="bg-white dark:bg-gray-900" side="left">
        <MobileNavigation />
      </SheetContent>
      <header
        className={cn(
          'flex w-full flex-col border-0 border-b border-solid border-input bg-white',
          siteConfig?.fixedHeader ? 'fixed z-10' : ''
        )}
      >
        <div className="container flex h-[60px] items-center">
          <SheetTrigger asChild>
            <Button
              type="button"
              className="lg:hidden"
              size="icon"
              variant="outline"
            >
              <LucideIcon name="Menu" size={24} />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <Brand />
          <Navigation />
          <div className="ml-auto flex gap-2">
            <SearchForm
              pathname={archivePath}
              placeholder="search_text"
              translate="yes"
              values={{
                q: pathname?.startsWith(archivePath)
                  ? (searchParams.get('q') as string) ?? ''
                  : '',
              }}
            />
            {user ? <SignedInNav /> : <SignedOutNav />}
          </div>
        </div>
      </header>
    </Sheet>
  )
}

const SignedInNav = () => {
  return <AccountMenu />
}

const SignedOutNav = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          router.push('/auth/signin', { scroll: !siteConfig?.fixedHeader })
        }
      >
        {t('signin')}
      </Button>
      <Button
        onClick={() =>
          router.push('/auth/signup', { scroll: !siteConfig?.fixedHeader })
        }
      >
        {t('signup')}
      </Button>
    </>
  )
}

export { Header }
