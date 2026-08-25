import { redirect } from 'next/navigation'

/** Legacy URL kept only for old bookmarks. Authentication is handled by Better Auth. */
export default function LoginPage() {
  redirect('/sign-in')
}
