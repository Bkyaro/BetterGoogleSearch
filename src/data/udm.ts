import type { RegionTier } from './regions'

export type CategoryId =
  | 'web'
  | 'media'
  | 'knowledge'
  | 'news'
  | 'commerce'
  | 'local'
  | 'travel'
  | 'jobs'

export interface Localized {
  en: string
  zh: string
}

export interface UdmMode {
  /** the udm= value */
  id: number
  /** stable key, used in share links and as a React key */
  slug: string
  name: Localized
  blurb: Localized
  category: CategoryId
  /** minimum region tier required for this mode to be offered */
  tier: RegionTier
  /** legacy tbm= alias, where Google historically exposed one */
  tbm?: string
  /** a query that makes this mode obvious */
  demo: string
  featured?: boolean
}

/**
 * The 24 udm values documented in the SerpApi survey.
 * Modes above tier 1 only resolve in the regions listed in ./regions.ts.
 *
 * Note: udm is an undocumented parameter. Treat this file as a snapshot,
 * not as ground truth - MODES_VERIFIED_AT records when it was transcribed.
 */
export const UDM_MODES: readonly UdmMode[] = [
  {
    id: 14,
    slug: 'web',
    name: { en: 'Web', zh: '网页' },
    blurb: {
      en: "The classic ten blue links - no knowledge panel, no AI overview, no shopping rail.",
      zh: "经典十条蓝链接:没有知识面板、没有 AI 摘要、没有商品栏。",
    },
    category: 'web',
    tier: 1,
    demo: 'best mechanical keyboard',
    featured: true,
  },
  {
    id: 2,
    slug: 'images',
    name: { en: 'Images', zh: '图片' },
    blurb: {
      en: "A visual grid instead of a text ranking.",
      zh: "图片网格,替代文本排名。",
    },
    category: 'media',
    tier: 1,
    tbm: 'isch',
    demo: 'brutalist architecture',
  },
  {
    id: 7,
    slug: 'videos',
    name: { en: 'Videos', zh: '视频' },
    blurb: {
      en: "Video results with a scrollable watch rail.",
      zh: "视频结果,可横向滚动浏览。",
    },
    category: 'media',
    tier: 1,
    tbm: 'vid',
    demo: 'how to make sourdough',
  },
  {
    id: 12,
    slug: 'news',
    name: { en: 'News', zh: '新闻' },
    blurb: {
      en: "Articles sorted by recency rather than by rank.",
      zh: "新闻文章,按时间而非排名排序。",
    },
    category: 'news',
    tier: 1,
    tbm: 'nws',
    demo: 'semiconductor export controls',
  },
  {
    id: 18,
    slug: 'forums',
    name: { en: 'Forums', zh: '论坛' },
    blurb: {
      en: "Discussion threads from forums and Q&A sites.",
      zh: "论坛与问答站点里的讨论帖。",
    },
    category: 'news',
    tier: 1,
    demo: 'why is my sourdough flat',
  },
  {
    id: 6,
    slug: 'learn',
    name: { en: 'Learn', zh: '学习' },
    blurb: {
      en: "Study guides and explanations, built around learning a topic.",
      zh: "学习指南与讲解,围绕知识点组织。",
    },
    category: 'knowledge',
    tier: 1,
    demo: 'linear algebra',
  },
  {
    id: 36,
    slug: 'books',
    name: { en: 'Books', zh: '图书' },
    blurb: {
      en: "Books and volumes, with a preview when one exists.",
      zh: "图书与文献,有试读时一并给出。",
    },
    category: 'knowledge',
    tier: 1,
    tbm: 'bks',
    demo: 'thinking fast and slow',
  },
  {
    id: 28,
    slug: 'shopping',
    name: { en: 'Shopping', zh: '购物' },
    blurb: {
      en: "Product listings with prices, merchants and filter chips.",
      zh: "带价格、商家与筛选条件的商品列表。",
    },
    category: 'commerce',
    tier: 1,
    tbm: 'shop',
    demo: 'standing desk',
  },
  {
    id: 37,
    slug: 'products',
    name: { en: 'Products', zh: '商品' },
    blurb: {
      en: "Product detail cards, without the full shopping grid.",
      zh: "商品详情卡片,不含完整购物网格。",
    },
    category: 'commerce',
    tier: 1,
    demo: 'sony wh-1000xm5',
  },
  {
    id: 44,
    slug: 'visual-matches',
    name: { en: 'Visual matches', zh: '视觉匹配' },
    blurb: {
      en: "Visually similar matches - the Lens-style result set.",
      zh: "视觉相似结果,类似 Google Lens 的匹配。",
    },
    category: 'media',
    tier: 1,
    demo: 'mid century floor lamp',
  },
  {
    id: 48,
    slug: 'exact-matches',
    name: { en: 'Exact matches', zh: '精确匹配' },
    blurb: {
      en: "Only pages that contain the terms verbatim.",
      zh: "只返回逐字包含检索词的页面。",
    },
    category: 'web',
    tier: 1,
    demo: 'how to tie a bowline knot',
  },
  {
    id: 15,
    slug: 'attractions',
    name: { en: 'Attractions', zh: '景点' },
    blurb: {
      en: "Things to do, sourced from travel listings.",
      zh: "当地可玩项目,来自旅游类内容。",
    },
    category: 'local',
    tier: 1,
    demo: 'things to do in lisbon',
  },
  {
    id: 9,
    slug: 'product-sites',
    name: { en: 'Product sites', zh: '商品站点' },
    blurb: {
      en: "Shopping results restricted to product sites.",
      zh: "限定在商品站点范围内的购物结果。",
    },
    category: 'commerce',
    tier: 2,
    demo: 'running shoes',
  },
  {
    id: 1,
    slug: 'places',
    name: { en: 'Places', zh: '地点' },
    blurb: {
      en: "A local pack with a map - the classic places layout.",
      zh: "带地图的本地聚合,经典地点版式。",
    },
    category: 'local',
    tier: 3,
    demo: 'ramen near me',
  },
  {
    id: 3,
    slug: 'products-intl',
    name: { en: 'Products', zh: '商品' },
    blurb: {
      en: "The products vertical. Same label as udm=37, different module.",
      zh: "商品垂直结果。与 udm=37 同名,但模块不同。",
    },
    category: 'commerce',
    tier: 3,
    demo: 'espresso machine',
  },
  {
    id: 5,
    slug: 'lodging',
    name: { en: 'Lodging', zh: '住宿' },
    blurb: {
      en: "Hotels, ryokans, guesthouses - the lodging pack.",
      zh: "酒店、旅馆、民宿等住宿聚合。",
    },
    category: 'local',
    tier: 3,
    demo: 'hotels in kyoto',
  },
  {
    id: 8,
    slug: 'jobs',
    name: { en: 'Jobs', zh: '职位' },
    blurb: {
      en: "Job postings, straight from the listings.",
      zh: "直接来自职位列表的招聘信息。",
    },
    category: 'jobs',
    tier: 3,
    demo: 'product designer remote',
  },
  {
    id: 10,
    slug: 'job-sites',
    name: { en: 'Job sites', zh: '招聘站点' },
    blurb: {
      en: "Job board results rather than individual postings.",
      zh: "招聘站点结果,而非单条职位。",
    },
    category: 'jobs',
    tier: 3,
    demo: 'data engineer berlin',
  },
  {
    id: 11,
    slug: 'places-sites',
    name: { en: 'Places sites', zh: '地点站点' },
    blurb: {
      en: "Places results limited to directory sites.",
      zh: "限定在目录与点评站点的地点结果。",
    },
    category: 'local',
    tier: 3,
    demo: 'dentist',
  },
  {
    id: 13,
    slug: 'airline-options',
    name: { en: 'Airline options', zh: '航司选项' },
    blurb: {
      en: "Which airlines actually fly a route.",
      zh: "执飞某条航线的航空公司。",
    },
    category: 'travel',
    tier: 3,
    demo: 'flights to tokyo',
  },
  {
    id: 31,
    slug: 'flight-sites',
    name: { en: 'Flight sites', zh: '机票站点' },
    blurb: {
      en: "Flight booking sites for a route.",
      zh: "某条航线的机票预订站点。",
    },
    category: 'travel',
    tier: 3,
    demo: 'cheap flights to lisbon',
  },
  {
    id: 32,
    slug: 'trains',
    name: { en: 'Trains', zh: '火车' },
    blurb: {
      en: "Train options between two places.",
      zh: "两地之间的火车班次。",
    },
    category: 'travel',
    tier: 3,
    demo: 'trains from berlin to prague',
  },
  {
    id: 33,
    slug: 'buses',
    name: { en: 'Buses', zh: '巴士' },
    blurb: {
      en: "Long-distance bus options.",
      zh: "长途巴士班次。",
    },
    category: 'travel',
    tier: 3,
    demo: 'bus amsterdam to paris',
  },
  {
    id: 34,
    slug: 'transport-sites',
    name: { en: 'Transport sites', zh: '交通站点' },
    blurb: {
      en: "Transport ticketing sites.",
      zh: "交通票务站点。",
    },
    category: 'travel',
    tier: 3,
    demo: 'train tickets europe',
  },
]

/** Date the udm list was transcribed from the source survey. */
export const MODES_VERIFIED_AT = '2024-06-13'

const byId = new Map(UDM_MODES.map((mode) => [mode.id, mode]))

export function modeById(id: number): UdmMode | undefined {
  return byId.get(id)
}

export function modeBySlug(slug: string): UdmMode | undefined {
  return UDM_MODES.find((mode) => mode.slug === slug)
}

export function isAvailable(mode: UdmMode, tier: RegionTier): boolean {
  return mode.tier <= tier
}

export function modesForTier(tier: RegionTier): readonly UdmMode[] {
  return UDM_MODES.filter((mode) => isAvailable(mode, tier))
}

export const CATEGORY_LABELS: Record<CategoryId, Localized> = {
  web: { en: 'Web', zh: '网页' },
  media: { en: 'Media', zh: '视觉' },
  knowledge: { en: 'Knowledge', zh: '知识' },
  news: { en: 'Discussion', zh: '资讯' },
  commerce: { en: 'Commerce', zh: '购物' },
  local: { en: 'Local', zh: '本地' },
  travel: { en: 'Travel', zh: '出行' },
  jobs: { en: 'Jobs', zh: '招聘' },
}

export const TIER_LABELS: Record<RegionTier, Localized> = {
  1: { en: 'Worldwide', zh: '全球通用' },
  2: { en: 'Select territories', zh: '部分属地' },
  3: { en: 'Europe and territories', zh: '欧洲及属地' },
}
