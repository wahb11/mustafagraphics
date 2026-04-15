import { getWorks } from '@/lib/works'
import WorkPageClient from './WorkPageClient'

export const dynamic = 'force-dynamic'

export default async function WorkPage() {
  const works = await getWorks()
  return <WorkPageClient initialWorks={works} />
}
