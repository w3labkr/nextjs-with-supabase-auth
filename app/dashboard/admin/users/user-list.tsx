'use client'

import * as React from 'react'
import dayjs from 'dayjs'

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
import { Paging } from './paginate'

import { User } from '@supabase/supabase-js'
import { useAuth } from '@/hooks/use-auth'
import { useUsersAPI } from '@/queries/client/users'

const UserList = () => {
  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(50)

  const { user } = useAuth()
  const { users } = useUsersAPI(user?.id ?? null, { page, perPage })

  return (
    <>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>created_at</TableHead>
            <TableHead>updated_at</TableHead>
            <TableHead>role</TableHead>
            <TableHead>email</TableHead>
            <TableHead>email_confirmed_at</TableHead>
            <TableHead>phone</TableHead>
            <TableHead>last_sign_in_at</TableHead>
            <TableHead>provider</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((item: User) => <ListItem key={item?.id} item={item} />)}
        </TableBody>
      </Table>
      <Paging
        page={page}
        perPage={perPage}
        setPage={setPage}
        total={users?.length ?? 0}
      />
    </>
  )
}

const ListItem = ({ item }: { item: User }) => {
  return (
    <TableRow>
      <TableCell>
        {dayjs(item?.created_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>
        {dayjs(item?.updated_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.role}</TableCell>
      <TableCell>{item?.email}</TableCell>
      <TableCell>
        {dayjs(item?.email_confirmed_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.phone}</TableCell>
      <TableCell>
        {dayjs(item?.last_sign_in_at).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell>{item?.app_metadata?.provider}</TableCell>
    </TableRow>
  )
}

export { UserList }
