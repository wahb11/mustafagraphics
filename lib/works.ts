import { supabase, supabaseReady, Work } from './supabase'

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
  return data || []
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
  return data || []
}

export async function getFeaturedWorks(limit = 6): Promise<Work[]> {
  if (!supabaseReady) return []

  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured works:', error)
    return []
  }
  return data || []
}

export async function deleteWork(id: string, filename: string): Promise<boolean> {
  if (!supabaseReady) return false

  const { error: dbError } = await supabase
    .from('works')
    .delete()
    .eq('id', id)

  if (dbError) {
    console.error('Error deleting work from db:', dbError)
    return false
  }

  if (filename) {
    const { error: storageError } = await supabase.storage
      .from('portfolio-images')
      .remove([filename])

    if (storageError) {
      console.error('Error deleting image from storage:', storageError)
    }
  }

  return true
}

export async function uploadWork(
  title: string,
  category: string,
  description: string,
  file: File
): Promise<{ success: boolean; error?: string }> {
  if (!supabaseReady) return { success: false, error: 'Supabase is not configured. Please set your credentials in .env.local' }

  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const filename = `${Date.now()}-${sanitized}`

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filename, file)

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { data: urlData } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filename)

  const image_url = urlData.publicUrl

  const { error: insertError } = await supabase
    .from('works')
    .insert({ title, category, description, image_url })

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  return { success: true }
}
