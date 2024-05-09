'use client'

import * as React from 'react'
import { debounce } from 'lodash'

export function useMounted() {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export function useDebounceMounted(wait: number = 0) {
  const [mounted, setMounted] = React.useState<boolean>(false)
  const debounceCallback = React.useCallback(
    debounce((value: boolean) => setMounted(value), wait),
    []
  )

  React.useEffect(() => {
    debounceCallback(true)
  }, [debounceCallback])

  return mounted
}
