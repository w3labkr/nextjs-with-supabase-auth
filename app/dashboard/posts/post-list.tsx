'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { PagingProvider, usePaging } from '@/components/paging/paging-provider'
import { Paging } from '@/components/paging'

import { Post } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { usePosts } from '@/hooks/api/use-posts'
import { useCountPosts } from '@/hooks/api/use-count-posts'

import { EditPostButton } from './edit-post-button'
import { ViewPostButton } from './view-post-button'
import { TrashPostButton } from './trash-post-button'
import { RestorePostButton } from './restore-post-button'
import { DeletePostButton } from './delete-post-button'

export function PostList() {
  return (
    <PagingProvider>
      <Header />
      <Body />
      <Footer />
    </PagingProvider>
  )
}

function Header() {
  const { t } = useTranslation()

  const { status, setStatus } = usePaging()
  const { user } = useAuth()
  const { data } = useCountPosts(user?.id ?? null)

  return (
    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
      {data?.map((obj) => {
        return obj.count > 0 ? (
          <React.Fragment key={obj.status}>
            {obj.status !== 'all' && <span>|</span>}
            <Button
              variant="link"
              className={cn(
                'h-auto p-0',
                status === obj.status
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
              onClick={() => setStatus(obj.status)}
            >
              {t(`PostStatus.${obj.status}`)}({obj.count})
            </Button>
          </React.Fragment>
        ) : null
      })}
    </div>
  )
}

function Footer() {
  const { user } = useAuth()
  const { page, perPage, status } = usePaging()
  const { total } = usePosts(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  if (total === null) return null

  return <Paging total={total} />
}

function Body() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { page, perPage, status } = usePaging()
  const { posts } = usePosts(user?.id ?? null, {
    page,
    perPage,
    status,
  })

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox />
          </TableHead>
          <TableHead className="w-[70px]">{t('TableHead.num')}</TableHead>
          <TableHead>{t('TableHead.title')}</TableHead>
          <TableHead className="w-[100px]">{t('TableHead.author')}</TableHead>
          <TableHead className="w-[200px]">
            {t('TableHead.updated_at')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts === null ? (
          <LoadingItem />
        ) : posts?.length > 0 ? (
          posts?.map((post) => <ListItem key={post?.id} post={post} />)
        ) : (
          <EmptyItem />
        )}
      </TableBody>
    </Table>
  )
}

function ListItem({ post }: { post: Post }) {
  const { t } = useTranslation()
  const { status } = usePaging()

  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>{post?.id}</TableCell>
      <TableCell>
        <div>{post?.title}</div>
        <div className="flex items-center space-x-1">
          {status === 'trash' ? (
            <>
              <RestorePostButton post={post} />
              <span>|</span>
              <DeletePostButton post={post} />
            </>
          ) : (
            <>
              <EditPostButton post={post} />
              <span>|</span>
              <TrashPostButton post={post} />
            </>
          )}
          <span>|</span>
          <ViewPostButton post={post} />
        </div>
      </TableCell>
      <TableCell>{post?.user?.username}</TableCell>
      <TableCell>
        {dayjs(post?.updated_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
    </TableRow>
  )
}

function EmptyItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={6} align="center">
        {t('TableCell.empty_post')}
      </TableCell>
    </TableRow>
  )
}

function LoadingItem() {
  const { t } = useTranslation()

  return (
    <TableRow className="hover:bg-inherit">
      <TableCell colSpan={5} align="center">
        {t('TableCell.is_loading')}
      </TableCell>
    </TableRow>
  )
}