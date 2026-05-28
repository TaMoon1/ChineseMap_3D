export interface HistoricalRegion {
  id: string
  name: string
  aliases: string[]
  era: string
  summary: string
  locationBasis: string
  color: string
  center: [number, number]
  height: number
  points: [number, number][]
  sources: Array<{
    title: string
    url: string
  }>
}

export const historicalRegions: HistoricalRegion[] = [
  {
    id: 'jingzhou',
    name: '荆州',
    aliases: ['荆州范围', '三国荆州', '荆襄'],
    era: '汉末至三国',
    summary: '这里的荆州示意层采用汉末三国语境，突出江陵、襄阳与汉水-长江走廊的核心空间。',
    locationBasis: '历史上的荆州范围多次变化，这里采用汉末三国常见的荆襄-江汉平原核心区示意，不等同于某一朝某一年精确州界。',
    color: '#22c55e',
    center: [112.4, 31.0],
    height: 1500000,
    points: [
      [110.5, 33.4], [112.2, 33.8], [113.8, 33.4], [114.5, 32.4], [114.8, 30.9],
      [114.3, 29.7], [113.0, 29.3], [111.2, 29.4], [110.0, 30.2], [109.8, 31.5],
    ],
    sources: [
      { title: '维基百科：荆州', url: 'https://zh.wikipedia.org/wiki/%E8%8D%86%E5%B7%9E' },
    ],
  },
  {
    id: 'guanzhong',
    name: '关中',
    aliases: ['关中地区', '秦地关中', '八百里秦川'],
    era: '先秦至汉唐',
    summary: '关中示意层强调渭河平原和函谷、西接陇山、南临秦岭的历史核心腹地。',
    locationBasis: '关中并非固定行政区，这里用渭河平原与潼关-宝鸡之间的核心区域做历史地理示意。',
    color: '#f59e0b',
    center: [108.8, 34.5],
    height: 1000000,
    points: [
      [106.4, 34.7], [107.4, 35.2], [109.2, 35.2], [110.6, 34.9], [110.9, 34.2],
      [109.8, 33.9], [108.3, 33.8], [106.9, 34.0], [106.2, 34.3],
    ],
    sources: [
      { title: '维基百科：关中', url: 'https://zh.wikipedia.org/wiki/%E5%85%B3%E4%B8%AD' },
    ],
  },
  {
    id: 'hedong',
    name: '河东',
    aliases: ['河东地区', '山西南部河东', '晋南河东'],
    era: '秦汉至唐宋',
    summary: '河东层以黄河东岸、运城盆地和临汾盆地南段为主，突出山西西南的传统地理单元。',
    locationBasis: '河东概念历代大小不一，这里采用黄河以东、吕梁以西南、临汾运城一线的传统核心范围。',
    color: '#8b5cf6',
    center: [111.2, 36.2],
    height: 1200000,
    points: [
      [109.8, 37.4], [111.0, 37.8], [112.1, 37.4], [112.5, 36.5], [112.3, 35.4],
      [111.4, 34.9], [110.2, 35.0], [109.6, 35.9], [109.5, 36.8],
    ],
    sources: [
      { title: '维基百科：河东', url: 'https://zh.wikipedia.org/wiki/%E6%B2%B3%E4%B8%9C' },
    ],
  },
  {
    id: 'huainan',
    name: '淮南',
    aliases: ['淮南地区', '寿春淮南', '淮河以南'],
    era: '汉至南北朝',
    summary: '淮南层重点表现淮河中游南岸、寿春与合肥之间的战略腹地。',
    locationBasis: '淮南作为历史地理概念长期围绕淮河以南展开，这里采用寿春-合肥-巢湖北岸一带的核心区域。',
    color: '#06b6d4',
    center: [117.0, 32.1],
    height: 1200000,
    points: [
      [115.9, 32.9], [117.2, 33.1], [118.4, 32.8], [118.9, 31.9], [118.3, 31.2],
      [117.0, 31.1], [115.9, 31.6], [115.6, 32.3],
    ],
    sources: [
      { title: '维基百科：淮南', url: 'https://zh.wikipedia.org/wiki/%E6%B7%AE%E5%8D%97' },
    ],
  },
  {
    id: 'bashu',
    name: '巴蜀',
    aliases: ['巴蜀地区', '四川盆地', '蜀地'],
    era: '先秦至三国',
    summary: '巴蜀示意层突出四川盆地与重庆西部、成都平原的历史核心联系。',
    locationBasis: '巴蜀边界在不同历史时期各不相同，这里采用四川盆地和重庆西部的历史文化核心区示意。',
    color: '#f97316',
    center: [106.2, 30.5],
    height: 1800000,
    points: [
      [102.5, 31.8], [104.2, 32.3], [106.6, 32.1], [108.6, 31.4], [108.9, 29.5],
      [107.6, 28.2], [105.4, 28.0], [103.2, 28.6], [102.2, 30.0],
    ],
    sources: [
      { title: '维基百科：巴蜀', url: 'https://zh.wikipedia.org/wiki/%E5%B7%B4%E8%9C%80' },
    ],
  },
]

export const historicalRegionMap = new Map(historicalRegions.map((region) => [region.id, region]))

export function searchHistoricalRegions(keyword: string) {
  const trimmed = keyword.trim().toLowerCase()
  if (!trimmed) return historicalRegions

  return historicalRegions.filter((region) => {
    const haystack = [region.name, region.era, region.locationBasis, ...region.aliases]
      .join(' ')
      .toLowerCase()
    return haystack.includes(trimmed)
  })
}
