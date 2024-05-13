'use client'

import useSWR from 'swr'
import { ProfileAPI } from '@/types/api'

export function useProfileAPI(
  id: string | null,
  params?: { username?: string }
) {
  let url: string | null = null

  if (id) url = `/api/v1/profile?id=${id}`
  if (params?.username) url = `/api/v1/profile?username=${params?.username}`

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR<ProfileAPI, Error>(url)

  return {
    profile: response?.data ?? null,
    error: error ?? response?.error ?? null,
    isLoading,
    isValidating,
    mutate,
  }
}