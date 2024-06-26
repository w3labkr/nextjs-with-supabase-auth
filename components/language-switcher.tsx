'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'
import { languageItems } from '@/i18next.config'
import { ResolvedLanguage, LanguageItem } from '@/types/i18next'

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface LanguageSwitcherProps {
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

const LanguageSwitcher = ({
  className,
  triggerClassName,
  contentClassName,
}: LanguageSwitcherProps) => {
  const dispatch = useAppDispatch()
  const resolvedLanguage = useAppSelector(
    (state) => state?.i18n?.resolvedLanguage
  )
  const [open, setOpen] = React.useState<boolean>(false)
  const { t, i18n } = useTranslation()

  const onSelect = (currentValue: string) => {
    if (currentValue === resolvedLanguage) return false
    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    dispatch(setResolvedLanguage(currentValue))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-50 justify-between', className, triggerClassName)}
        >
          {resolvedLanguage
            ? languageItems.find((l) => l.value === resolvedLanguage)?.label
            : t('search_language')}
          <LucideIcon
            name="ChevronsUpDown"
            size={16}
            className="ml-2 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-50 p-0', className, contentClassName)}>
        <Command>
          <CommandInput placeholder={t('search_language')} />
          <CommandEmpty>{t('no_language_found')}</CommandEmpty>
          <CommandGroup>
            {languageItems.map((item) => (
              <LanguageSwitcherItem
                key={item?.value}
                item={item}
                resolvedLanguage={resolvedLanguage}
                onSelect={onSelect}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const LanguageSwitcherItem = ({
  item,
  resolvedLanguage,
  onSelect,
}: {
  item: LanguageItem
  resolvedLanguage: ResolvedLanguage
  onSelect: (value: string) => void
}) => {
  return (
    <CommandItem
      value={item?.value}
      onSelect={onSelect}
      className="cursor-pointer"
    >
      <LucideIcon
        name="Check"
        size={16}
        className={cn(
          'mr-2',
          item?.value === resolvedLanguage ? 'opacity-100' : 'opacity-0'
        )}
      />
      {item.label}
    </CommandItem>
  )
}

export { LanguageSwitcher, type LanguageSwitcherProps }
