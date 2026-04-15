import { notFound } from 'next/navigation'
import ServicePageClient from './ServicePageClient'
import { getWorksByCategory } from '@/lib/works'

export const dynamic = 'force-dynamic'

const SERVICE_DATA: Record<string, {
  icon: string
  name: string
  description: string
  longDesc: string
  included: string[]
  tools: string[]
  category: string
}> = {
  'logo-design': {
    icon: '✦',
    name: 'Logo Design',
    description: 'Professional logos and brand marks that make your business unforgettable.',
    longDesc: 'A great logo is the cornerstone of your brand. I create logos that are not just visually stunning but strategically designed to communicate your brand\'s values, personality, and story at a single glance.',
    category: 'Logo',
    included: [
      'Custom logo concepts',
      'Multiple format delivery (PNG, SVG, PDF)',
      'Transparent background versions',
      'Light & dark variations',
      'Brand color palette',
      'Typography selection',
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva'],
  },
  'social-media': {
    icon: '📱',
    name: 'Social Media Design',
    description: 'Scroll-stopping graphics that grow your audience and boost engagement.',
    longDesc: 'In the crowded social media space, you need visuals that stop the scroll. I design eye-catching posts, stories, reels covers, and profile graphics that reflect your brand and drive real engagement.',
    category: 'Social Media',
    included: [
      'Instagram post designs',
      'Facebook post graphics',
      'Story templates',
      'Profile & cover photos',
      'Consistent brand look',
      'Editable templates (optional)',
    ],
    tools: ['Canva', 'Adobe Photoshop', 'Adobe Illustrator'],
  },
  'banner-design': {
    icon: '🖼',
    name: 'Banner Design',
    description: 'Platform-perfect banners for YouTube, Facebook, LinkedIn, and more.',
    longDesc: 'Your channel art and cover photos are the first thing visitors see. I design platform-optimized banners that create a powerful first impression and reinforce your brand identity across every social platform.',
    category: 'Banner',
    included: [
      'Facebook cover photo',
      'YouTube channel art',
      'LinkedIn banner',
      'Twitter/X header',
      'Correct platform dimensions',
      'Mobile-responsive design',
    ],
    tools: ['Adobe Photoshop', 'Canva', 'Adobe Illustrator'],
  },
  'youtube-thumbnail': {
    icon: '▶',
    name: 'YouTube Thumbnail',
    description: 'High-CTR thumbnails that get more clicks and grow your YouTube channel.',
    longDesc: 'Your thumbnail is your video\'s first impression — it can make or break your click-through rate. I design compelling, high-contrast thumbnails that stand out in search results and suggested videos.',
    category: 'Thumbnail',
    included: [
      'Custom thumbnail design',
      'High-contrast visuals',
      'Bold text overlays',
      '1280×720px resolution',
      'YouTube-optimized format',
      'Multiple style variations',
    ],
    tools: ['Adobe Photoshop', 'Canva'],
  },
  'graphic-design': {
    icon: '🎨',
    name: 'Graphic Design',
    description: 'Posters, flyers, brochures and print materials with professional quality.',
    longDesc: 'From business flyers to event posters to marketing brochures, I create print-ready graphic design that commands attention and communicates your message with clarity and style.',
    category: 'Graphic Design',
    included: [
      'Poster & flyer design',
      'Brochure & leaflet',
      'Business card design',
      'Print-ready files',
      'Web-optimized versions',
      'CMYK color mode',
    ],
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'],
  },
  'branding-package': {
    icon: '💼',
    name: 'Branding Package',
    description: 'Complete brand identity — logo, colors, typography, and brand guidelines.',
    longDesc: 'A cohesive brand identity is what separates memorable businesses from forgettable ones. My complete branding package gives you everything you need to launch or rebrand with confidence — from logo to brand guidelines.',
    category: 'Branding',
    included: [
      'Primary & secondary logos',
      'Brand color palette',
      'Typography system',
      'Business card design',
      'Social media kit',
      'Brand guidelines PDF',
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Canva'],
  },
}

export default async function ServiceSlugPage({ params }: { params: { slug: string } }) {
  const data = SERVICE_DATA[params.slug]
  if (!data) notFound()

  const works = await getWorksByCategory(data.category)

  return <ServicePageClient data={data} works={works} />
}
