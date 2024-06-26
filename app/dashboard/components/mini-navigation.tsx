'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAppBar } from './app-bar'

import { LucideIcon } from '@/lib/lucide-icon'
import { siteConfig } from '@/config/site'
import { DashboardMiniNavItem, DashboardMiniNavSubItem } from '@/types/config'

interface MiniNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  nav: DashboardMiniNavItem[]
  userrole?: string
}

const MiniNavigation = ({
  className,
  nav,
  userrole,
  ...props
}: MiniNavigationProps) => {
  const { height } = useAppBar()

  return (
    <div
      className={cn(
        'flex flex-col border-r bg-background px-2',
        'w-14 min-w-14',
        className
      )}
      {...props}
    >
      <div className={cn('flex items-center justify-center border-b', height)}>
        <Link href="/" scroll={!siteConfig?.fixedHeader}>
          <LucideIcon name={siteConfig.symbol} size={20} />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 overflow-auto py-2">
        {nav?.map((item: DashboardMiniNavItem) => {
          const { id, roles } = item
          if (roles && userrole && !roles?.includes(userrole)) return null
          return <NavItem key={id} item={item} userrole={userrole} />
        })}
      </nav>
    </div>
  )
}

interface NavItemProps {
  item: DashboardMiniNavItem
  userrole?: string
}

const NavItem = ({ item, userrole }: NavItemProps) => {
  const { separator, items } = item

  return (
    <React.Fragment>
      {separator && <Separator />}
      {items?.map((sub: DashboardMiniNavSubItem) => {
        const { id, roles } = sub
        if (roles && userrole && !roles?.includes(userrole)) return null
        return <NavSubItem key={id} item={sub} />
      })}
    </React.Fragment>
  )
}

interface NavSubItemProps {
  item: DashboardMiniNavSubItem
}

const NavSubItem = ({ item }: NavSubItemProps) => {
  const { href, iconName, title, translate, disabled, badge } = item
  const { t } = useTranslation()

  const router = useRouter()
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center">
            <button
              className={cn(
                href === '/dashboard' && pathname === href
                  ? null
                  : href !== '/dashboard' && pathname?.startsWith(href)
                    ? null
                    : 'text-muted-foreground'
              )}
              onClick={() =>
                router.push(href, { scroll: !siteConfig?.fixedHeader })
              }
              disabled={disabled}
            >
              {iconName ? (
                <LucideIcon name={iconName} size={20} className="mr-0" />
              ) : null}
              {badge && badge > 0 ? (
                <Badge
                  className="absolute bottom-0 right-0 justify-center px-1 py-0.5"
                  style={{ fontSize: 10, lineHeight: 1 }}
                >
                  {badge}
                </Badge>
              ) : null}
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="end" alignOffset={6}>
          {title && translate === 'yes' ? t(title) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { MiniNavigation, type MiniNavigationProps }
