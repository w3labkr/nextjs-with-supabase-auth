import * as React from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'

import { getPostUrl } from '@/lib/utils'
import { Post } from '@/types/database'

interface RelatedPostsProps extends React.HTMLAttributes<HTMLDivElement> {
  previousPost: Post | null
  nextPost: Post | null
}

const RelatedPosts = async ({
  previousPost,
  nextPost,
  ...props
}: RelatedPostsProps) => {
  const resolvedLanguage = cookies().get('i18n:resolvedLanguage')?.value
  const translation =
    resolvedLanguage === 'ko'
      ? await import(`@/public/locales/ko/translation.json`)
      : await import(`@/public/locales/en/translation.json`)

  return (
    <div {...props}>
      <h2 className="mb-8 font-serif text-4xl font-bold leading-tight tracking-tighter">
        {translation['related_posts']}
      </h2>
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        {previousPost ? (
          <PreviousPost post={previousPost} />
        ) : (
          <div className="text-center">
            {translation['the_previous_post_does_not_exist']}
          </div>
        )}
        {nextPost ? (
          <NextPost post={nextPost} />
        ) : (
          <div className="text-center">
            {translation['the_next_post_does_not_exist']}
          </div>
        )}
      </div>
    </div>
  )
}

const PreviousPost = ({ post }: { post: Post | null }) => {
  return (
    <div className="grid gap-2">
      <h3 className="line-clamp-2 font-serif text-2xl underline hover:no-underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}

const NextPost = ({ post }: { post: Post | null }) => {
  return (
    <div className="grid gap-2">
      <h3 className="line-clamp-2 font-serif text-2xl underline hover:no-underline">
        <Link href={getPostUrl(post) ?? '#'}>{post?.title}</Link>
      </h3>
      <time dateTime={post?.date ?? undefined}>
        {dayjs(post?.date).format('MMMM D, YYYY')}
      </time>
    </div>
  )
}

export { RelatedPosts, type RelatedPostsProps }