import { supabase, supabaseReady, Work } from './supabase'

const PORTFOLIO_BUCKET = 'portfolio-images'

/** Object path inside the portfolio-images bucket (handles Supabase public URLs). */
export function storagePathFromImageUrl(imageUrl: string): string {
  if (!imageUrl) return ''
  try {
    const u = new URL(imageUrl)
    const marker = `/${PORTFOLIO_BUCKET}/`
    const idx = u.pathname.indexOf(marker)
    if (idx !== -1) {
      return decodeURIComponent(u.pathname.slice(idx + marker.length))
    }
  } catch {
    /* use fallback */
  }
  const tail = imageUrl.split('/').pop() || ''
  return decodeURIComponent(tail.split('?')[0].split('#')[0])
}

export async function getWorks(): Promise<Work[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching works:', error)
    return []
  }
  return (data || []).map(w => ({ ...w, featured: w.featured ?? false }))
}

export async function getWorksByCategory(category: string): Promise<Work[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching works by category:', error)
    return []
  }
  return (data || []).map(w => ({ ...w, featured: w.featured ?? false }))
}

export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured works:', error)
    return []
  }

  const featuredWorks = (data || []).map(w => ({ ...w, featured: w.featured ?? false }))
  if (featuredWorks.length > 0) return featuredWorks

  // Backward-compatible fallback: if nothing is marked featured yet, show latest work.
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (fallbackError) {
    console.error('Error fetching fallback featured works:', fallbackError)
    return []
  }

  return (fallbackData || []).map(w => ({ ...w, featured: w.featured ?? false }))
}

export async function deleteWork(id: string, imageUrlOrPath: string): Promise<boolean> {
  if (!supabaseReady) return false

  const { error: dbError } = await supabase
    .from('works')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('Error deleting work from db:', dbError)
    return false
  }

  const path = imageUrlOrPath.includes('/') ? storagePathFromImageUrl(imageUrlOrPath) : imageUrlOrPath
  if (path) {
    const { error: storageError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .remove([path])

    if (storageError) {
      console.error('Error deleting image from storage:', storageError)
    }
  }

  return true
}

export async function updateWork(
  id: string,
  title: string,
  category: string,
  description: string,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseReady) {
    return { success: false, error: 'Supabase is not configured. Please set your credentials in .env.local' }
  }

  const { error } = await supabase
    .from('works')
    .update({ title, category, description, featured })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function uploadWork(
  title: string,
  category: string,
  description: string,
  file: File,
  featured: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseReady) return { success: false, error: 'Supabase is not configured. Please set your credentials in .env.local' }

  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const filename = `${Date.now()}-${sanitized}`

  const { error: uploadError } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(filename, file)

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data: urlData } = supabase.storage
    .from(PORTFOLIO_BUCKET)
    .getPublicUrl(filename)

  const image_url = urlData.publicUrl

  const { error: insertError } = await supabase
    .from('works')
    .insert({ title, category, description, image_url, featured })

  if (insertError) {
    await supabase.storage.from(PORTFOLIO_BUCKET).remove([filename])
    return { success: false, error: insertError.message }
  }

  return { success: true }
}
