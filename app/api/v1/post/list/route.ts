import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ApiError } from '@/lib/utils'
import { authorize } from '@/queries/async'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const uid = searchParams.get('uid') as string
  const page = searchParams.get('page') as string
  const perPage = searchParams.get('perPage') as string
  const status = searchParams.get('status') as string
  const limit = searchParams.get('limit') as string
  const post_type = (searchParams.get('post_type') as string) ?? 'post'

  let match = {}

  if (uid) match = { ...match, user_id: uid }
  if (status) match = { ...match, status }
  if (post_type) match = { ...match, post_type }

  const supabase = createClient()
  const totalQuery = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .match(match)

  if (!status) totalQuery.neq('status', 'trash')

  const total = await totalQuery

  if (total?.error) {
    return NextResponse.json(
      { data: null, count: null, error: total?.error },
      { status: 400 }
    )
  }

  const listQuery = supabase
    .from('posts')
    .select('*, profile:profiles(*)')
    .match(match)

  if (!status) listQuery.neq('status', 'trash')
  if (page && perPage) {
    listQuery.range((+page - 1) * +perPage, +page * +perPage - 1)
  }
  if (limit) listQuery.limit(limit)

  const list = await listQuery.order('created_at', { ascending: false })

  if (list?.error) {
    return NextResponse.json(
      { data: null, count: null, error: list?.error },
      { status: 400 }
    )
  }

  return NextResponse.json({
    data: list?.data,
    count: total?.count ?? 0,
    error: null,
  })
}
