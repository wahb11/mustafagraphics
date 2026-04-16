import { Review, supabase, supabaseReady } from './supabase'

type SubmitReviewInput = {
  name: string
  role?: string
  message: string
  rating: number
}

function clampRating(rating: number) {
  if (Number.isNaN(rating)) return 5
  return Math.max(1, Math.min(5, Math.round(rating)))
}

export async function getApprovedReviews(limit = 6): Promise<Review[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching approved reviews:', error)
    return []
  }

  return data || []
}

export async function getAllReviews(): Promise<Review[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all reviews:', error)
    return []
  }

  return data || []
}

export async function submitReview(input: SubmitReviewInput): Promise<{ success: boolean; error?: string }> {
  if (!supabaseReady) {
    return { success: false, error: 'Supabase is not configured. Please set your credentials in .env.local' }
  }

  const payload = {
    name: input.name.trim(),
    role: input.role?.trim() || null,
    message: input.message.trim(),
    rating: clampRating(input.rating),
    status: 'pending',
  }

  const { error } = await supabase.from('reviews').insert(payload)
  if (error) return { success: false, error: error.message }

  return { success: true }
}

export async function approveReview(id: string): Promise<boolean> {
  if (!supabaseReady) return false

  const { error } = await supabase
    .from('reviews')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error approving review:', error)
    return false
  }

  return true
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!supabaseReady) return false

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting review:', error)
    return false
  }

  return true
}
