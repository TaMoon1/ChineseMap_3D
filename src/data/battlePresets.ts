import { extraBattlePresets } from './extraBattlePresets'

export interface BattleForce {
  id: string
  name: string
  color: string
}

export interface BattleArrowPreset {
  id: string
  forceId: string
  phaseId?: string
  path: [number, number, number?][]
  width?: number
  label?: string
  labelCoords?: [number, number, number?]
}

export interface BattlePhase {
  id: string
  name: string
  time: string
  color: string
  description: string
}

export interface BattleLocationPreset {
  id: string
  name: string
  coords: [number, number, number?]
  kind: 'site' | 'city' | 'capital' | 'pass'
}

export interface BattlePreset {
  id: string
  name: string
  aliases: string[]
  era: string
  years: string
  summary: string
  locationBasis: string
  note: string
  view: {
    center: [number, number]
    height: number
    pitch?: number
  }
  forces: BattleForce[]
  phases?: BattlePhase[]
  arrows: BattleArrowPreset[]
  locations: BattleLocationPreset[]
  sources: Array<{
    title: string
    url: string
  }>
}

const coreBattlePresets: BattlePreset[] = [
  {
    id: 'hangu-pass',
    name: '函谷关之战',
    aliases: ['合纵攻秦', '五国攻秦', '函谷关', '秦函谷关', '陕西函谷关'],
    era: '战国',
    years: '前318年为主',
    summary: '赵、楚、魏、韩、燕等国合纵攻秦，联军进攻秦国东部门户函谷关，秦军凭险防守。',
    locationBasis: '古函谷关在今河南省灵宝市函谷关镇一带，处在关中东出与洛阳西入的要道上，西接秦地、东向中原。',
    note: '用户常说“陕西函谷关”，但战国秦函谷关通常定位在今河南灵宝；图中把它作为秦国东部门户标识。',
    view: {
      center: [111.0, 34.65],
      height: 520000,
      pitch: -56,
    },
    forces: [
      { id: 'qin', name: '秦军', color: '#ffb703' },
      { id: 'alliance', name: '合纵联军', color: '#3a86ff' },
    ],
    arrows: [
      {
        id: 'alliance-east',
        forceId: 'alliance',
        path: [
          [112.45, 34.62],
          [111.75, 34.63],
          [110.93, 34.64],
        ],
        label: '联军西攻函谷',
        labelCoords: [111.7, 34.72],
        width: 11,
      },
      {
        id: 'alliance-southeast',
        forceId: 'alliance',
        path: [
          [113.65, 34.76],
          [112.2, 34.55],
          [110.93, 34.64],
        ],
        label: '韩魏方向',
        labelCoords: [112.25, 34.47],
        width: 8,
      },
      {
        id: 'qin-defense',
        forceId: 'qin',
        path: [
          [109.2, 34.37],
          [110.2, 34.52],
          [110.93, 34.64],
        ],
        label: '秦军据关防守',
        labelCoords: [110.15, 34.42],
        width: 10,
      },
    ],
    locations: [
      { id: 'hangu-pass-site', name: '古函谷关', coords: [110.93, 34.64], kind: 'pass' },
      { id: 'xianyang', name: '咸阳', coords: [108.71, 34.34], kind: 'capital' },
      { id: 'luoyang', name: '洛阳', coords: [112.45, 34.62], kind: 'capital' },
    ],
    sources: [
      { title: '河南省政府：灵宝函谷关历史文化旅游区', url: 'https://www.henan.gov.cn/2018/09-18/691739.html' },
      { title: '灵宝市政府：函谷关历史文化旅游区', url: 'https://www.lingbao.gov.cn/16031/616500000/1265843.html' },
      { title: '维基百科：函谷关', url: 'https://zh.wikipedia.org/wiki/%E5%87%BD%E8%B0%B7%E5%85%B3' },
    ],
  },
  {
    id: 'jinyang',
    name: '晋阳之战',
    aliases: ['三家分晋', '晋阳保卫战', '战国晋阳', '山西晋阳之战'],
    era: '春秋末期至战国初期',
    years: '前455年至前453年',
    summary: '智氏联合韩、魏围攻赵氏晋阳，赵襄子坚守晋阳，最终联合韩、魏反击智氏。',
    locationBasis: '晋阳古城遗址位于今山西省太原市晋源区古城营村、晋源街道一带，图中以晋源区晋阳古城区域为核心。',
    note: '箭头突出“围晋阳”与韩、魏倒戈后反击智氏的格局，属于政治军事态势示意。',
    view: {
      center: [112.48, 37.72],
      height: 420000,
      pitch: -55,
    },
    forces: [
      { id: 'zhao', name: '赵氏', color: '#4cc9f0' },
      { id: 'zhi', name: '智氏', color: '#ef476f' },
      { id: 'hanwei', name: '韩、魏', color: '#06d6a0' },
    ],
    arrows: [
      {
        id: 'zhi-siege',
        forceId: 'zhi',
        path: [
          [112.9, 37.95],
          [112.7, 37.84],
          [112.48, 37.72],
        ],
        label: '智氏围晋阳',
        labelCoords: [112.74, 37.88],
        width: 10,
      },
      {
        id: 'hanwei-turn',
        forceId: 'hanwei',
        path: [
          [112.1, 37.48],
          [112.25, 37.62],
          [112.48, 37.72],
        ],
        label: '韩魏转向合击智氏',
        labelCoords: [112.25, 37.58],
        width: 9,
      },
      {
        id: 'zhao-counter',
        forceId: 'zhao',
        path: [
          [112.48, 37.72],
          [112.67, 37.82],
          [112.85, 37.9],
        ],
        label: '赵氏出城反击',
        labelCoords: [112.68, 37.78],
        width: 8,
      },
    ],
    locations: [
      { id: 'jinyang-site', name: '晋阳古城', coords: [112.48, 37.72], kind: 'site' },
      { id: 'taiyuan-basin', name: '太原盆地', coords: [112.55, 37.78], kind: 'city' },
    ],
    sources: [
      { title: '维基百科：晋阳古城遗址', url: 'https://zh.wikipedia.org/wiki/%E6%99%8B%E9%98%B3%E5%8F%A4%E5%9F%8E%E9%81%97%E5%9D%80' },
      { title: '中新网：探访晋阳古城考古遗址公园', url: 'https://www.chinanews.com.cn/cul/2025/05-15/10415725.shtml' },
    ],
  },
  {
    id: 'chengpu',
    name: '城濮之战',
    aliases: ['春秋城濮之战', '晋楚城濮之战', '城濮'],
    era: '春秋',
    years: '前632年',
    summary: '晋楚争霸中的关键会战，晋军在城濮击败楚军，奠定晋文公霸业。',
    locationBasis: '城濮多定位为今山东省菏泽市鄄城县西南临濮集一带，图中以临濮镇附近为战场核心。',
    note: '晋军、楚军箭头分别从西北与南向汇入城濮，只表达会战方向与大致地理关系。',
    view: {
      center: [115.47, 35.55],
      height: 650000,
      pitch: -55,
    },
    forces: [
      { id: 'jin', name: '晋军', color: '#4cc9f0' },
      { id: 'chu', name: '楚军', color: '#ef476f' },
    ],
    arrows: [
      {
        id: 'jin-main',
        forceId: 'jin',
        path: [
          [112.55, 37.87],
          [114.1, 36.45],
          [115.47, 35.55],
        ],
        label: '晋军南下会战',
        labelCoords: [114.0, 36.25],
        width: 9,
      },
      {
        id: 'chu-main',
        forceId: 'chu',
        path: [
          [112.3, 30.35],
          [114.2, 33.35],
          [115.47, 35.55],
        ],
        label: '楚军北上',
        labelCoords: [114.2, 33.8],
        width: 9,
      },
    ],
    locations: [
      { id: 'battle', name: '城濮/临濮', coords: [115.47, 35.55], kind: 'site' },
      { id: 'jinyang-origin', name: '晋地', coords: [112.55, 37.87], kind: 'city' },
      { id: 'chu-origin', name: '楚地来向', coords: [112.3, 30.35], kind: 'city' },
    ],
    sources: [
      { title: '山东地情资料库：城濮之战', url: 'https://shandong-chorography.org/database/bh/section/22/article/66/' },
      { title: '维基百科：城濮之战', url: 'https://zh.wikipedia.org/wiki/%E5%9F%8E%E6%BF%AE%E4%B9%8B%E6%88%98' },
    ],
  },
  {
    id: 'guiling',
    name: '桂陵之战',
    aliases: ['围魏救赵', '桂陵', '战国桂陵之战'],
    era: '战国',
    years: '前354年至前353年',
    summary: '齐军采取“围魏救赵”策略，迫使魏军回援并在桂陵附近设伏取胜。',
    locationBasis: '桂陵常定位在今河南长垣一带，图中以长垣西北为伏击点，并标出邯郸、大梁、临淄的战略关系。',
    note: '此图把“围魏救赵”的战略路径放在对应城市之间，伏击点落在河南长垣附近。',
    view: {
      center: [115.0, 35.5],
      height: 1050000,
      pitch: -58,
    },
    forces: [
      { id: 'qi', name: '齐军', color: '#3a86ff' },
      { id: 'wei', name: '魏军', color: '#d90429' },
      { id: 'zhao', name: '赵军', color: '#8ecae6' },
    ],
    arrows: [
      {
        id: 'wei-siege',
        forceId: 'wei',
        path: [
          [114.31, 34.79],
          [114.42, 35.65],
          [114.49, 36.61],
        ],
        label: '魏军攻赵',
        labelCoords: [114.42, 35.85],
        width: 8,
      },
      {
        id: 'qi-relief',
        forceId: 'qi',
        path: [
          [118.31, 36.82],
          [116.6, 35.95],
          [114.67, 35.2],
        ],
        label: '齐军直趋大梁',
        labelCoords: [116.55, 35.9],
        width: 10,
      },
      {
        id: 'wei-retreat',
        forceId: 'wei',
        path: [
          [114.49, 36.61],
          [114.65, 35.9],
          [114.67, 35.2],
        ],
        label: '魏军回援中伏',
        labelCoords: [114.7, 35.8],
        width: 8,
      },
    ],
    locations: [
      { id: 'handan', name: '邯郸', coords: [114.49, 36.61], kind: 'capital' },
      { id: 'daliang', name: '大梁', coords: [114.31, 34.79], kind: 'capital' },
      { id: 'linzi', name: '临淄', coords: [118.31, 36.82], kind: 'capital' },
      { id: 'guiling-site', name: '桂陵/长垣', coords: [114.67, 35.2], kind: 'site' },
    ],
    sources: [
      { title: '维基百科：桂陵之战', url: 'https://zh.wikipedia.org/wiki/%E6%A1%82%E9%99%B5%E4%B9%8B%E6%88%B0' },
      { title: '搜狗百科：桂陵之战', url: 'https://baike.sogou.com/v226579.htm' },
    ],
  },
  {
    id: 'changping',
    name: '长平之战',
    aliases: ['战国长平之战', '长平', '山西高平长平之战'],
    era: '战国',
    years: '前262年至前260年',
    summary: '秦赵之间的决定性大会战，秦军最终完成包围并重创赵军。',
    locationBasis: '长平之战遗址位于今山西省晋城市高平市一带，相关遗址集中在高平北城、永录等区域。',
    note: '图中战场核心放在山西高平，箭头表现秦军由西向东压迫、赵军由邯郸方向西进抗秦。',
    view: {
      center: [112.93, 35.8],
      height: 720000,
      pitch: -58,
    },
    forces: [
      { id: 'qin', name: '秦军', color: '#ffb703' },
      { id: 'zhao', name: '赵军', color: '#4cc9f0' },
    ],
    arrows: [
      {
        id: 'qin-main',
        forceId: 'qin',
        path: [
          [108.71, 34.34],
          [111.2, 35.35],
          [112.93, 35.8],
        ],
        label: '秦军东进上党',
        labelCoords: [111.3, 35.48],
        width: 10,
      },
      {
        id: 'qin-encircle',
        forceId: 'qin',
        path: [
          [112.35, 36.22],
          [112.72, 36.0],
          [113.15, 35.75],
        ],
        label: '秦军包围',
        labelCoords: [112.75, 36.03],
        width: 9,
      },
      {
        id: 'zhao-defend',
        forceId: 'zhao',
        path: [
          [114.49, 36.61],
          [113.72, 36.18],
          [112.93, 35.8],
        ],
        label: '赵军西援',
        labelCoords: [113.75, 36.12],
        width: 8,
      },
    ],
    locations: [
      { id: 'xianyang', name: '咸阳', coords: [108.71, 34.34], kind: 'capital' },
      { id: 'handan', name: '邯郸', coords: [114.49, 36.61], kind: 'capital' },
      { id: 'changping-site', name: '长平/高平', coords: [112.93, 35.8], kind: 'site' },
    ],
    sources: [
      { title: '维基百科：长平之战遗址', url: 'https://zh.wikipedia.org/wiki/%E9%95%BF%E5%B9%B3%E4%B9%8B%E6%88%98%E9%81%97%E5%9D%80' },
      { title: '高平市人民政府：高平·长平之战', url: 'https://www.sxgp.gov.cn/zjgp/lsrw_426/202405/t20240510_1980763.shtml' },
    ],
  },
  {
    id: 'julu',
    name: '巨鹿之战',
    aliases: ['项羽破釜沉舟', '巨鹿', '秦汉巨鹿之战', '河北平乡巨鹿'],
    era: '秦汉之际',
    years: '前207年',
    summary: '项羽破釜沉舟北上救赵，在巨鹿一战中扭转反秦战局。',
    locationBasis: '巨鹿之战的巨鹿古城多指今河北邢台平乡县西南一带，图中以平乡附近为会战核心。',
    note: '箭头展示楚军渡河北上、秦军围攻巨鹿与输送粮道的大致方向。',
    view: {
      center: [115.03, 37.06],
      height: 760000,
      pitch: -58,
    },
    forces: [
      { id: 'chu', name: '楚军', color: '#2ec4b6' },
      { id: 'qin', name: '秦军', color: '#e63946' },
    ],
    arrows: [
      {
        id: 'chu-breakthrough',
        forceId: 'chu',
        path: [
          [114.35, 36.5],
          [114.65, 36.8],
          [115.03, 37.06],
        ],
        label: '楚军渡河救赵',
        labelCoords: [114.62, 36.82],
        width: 10,
      },
      {
        id: 'qin-siege',
        forceId: 'qin',
        path: [
          [114.95, 37.55],
          [115.0, 37.3],
          [115.03, 37.06],
        ],
        label: '秦军围巨鹿',
        labelCoords: [115.0, 37.33],
        width: 9,
      },
      {
        id: 'qin-supply',
        forceId: 'qin',
        path: [
          [114.6, 36.2],
          [114.8, 36.62],
          [115.03, 37.06],
        ],
        label: '甬道输粮',
        labelCoords: [114.78, 36.62],
        width: 7,
      },
    ],
    locations: [
      { id: 'julu-site', name: '巨鹿古城/平乡', coords: [115.03, 37.06], kind: 'site' },
      { id: 'zhanghe', name: '漳河方向', coords: [114.35, 36.5], kind: 'city' },
      { id: 'nanji', name: '南棘原方向', coords: [114.6, 36.2], kind: 'city' },
    ],
    sources: [
      { title: '中文百科全书：巨鹿之战', url: 'https://www.newton.com.tw/wiki/%E9%89%85%E9%B9%BF%E4%B9%8B%E6%88%B0' },
      { title: '国学迷：历史上的巨鹿县', url: 'https://www.guoxuemi.com/lishi/8300e/' },
    ],
  },
  {
    id: 'xiangji',
    name: '香积寺之战',
    aliases: ['安史之乱', '唐代安史之乱', '香积寺', '香积寺之战', '长安收复战'],
    era: '唐代',
    years: '757年',
    summary: '安史之乱期间唐军收复长安的重要会战，香积寺之战后局势开始扭转。',
    locationBasis: '香积寺位于今陕西省西安市长安区郭杜街道香积寺村，战役发生在长安城西南郊香积寺一带。',
    note: '输入“安史之乱”会定位到这场与收复长安直接相关的会战。',
    view: {
      center: [108.88, 34.12],
      height: 330000,
      pitch: -52,
    },
    forces: [
      { id: 'tang', name: '唐军', color: '#3a86ff' },
      { id: 'yan', name: '燕军', color: '#ef476f' },
      { id: 'uighur', name: '回纥骑兵', color: '#06d6a0' },
    ],
    arrows: [
      {
        id: 'tang-west',
        forceId: 'tang',
        path: [
          [107.38, 34.52],
          [108.1, 34.3],
          [108.88, 34.1],
        ],
        label: '唐军自西进击',
        labelCoords: [108.12, 34.31],
        width: 10,
      },
      {
        id: 'uighur-flank',
        forceId: 'uighur',
        path: [
          [109.28, 34.42],
          [109.08, 34.26],
          [108.88, 34.1],
        ],
        label: '回纥骑兵侧击',
        labelCoords: [109.08, 34.3],
        width: 8,
      },
      {
        id: 'yan-response',
        forceId: 'yan',
        path: [
          [108.95, 34.32],
          [108.93, 34.2],
          [108.88, 34.1],
        ],
        label: '燕军背长安迎战',
        labelCoords: [108.98, 34.22],
        width: 9,
      },
    ],
    locations: [
      { id: 'chang-an', name: '长安', coords: [108.94, 34.34], kind: 'capital' },
      { id: 'fengxiang', name: '凤翔', coords: [107.38, 34.52], kind: 'city' },
      { id: 'battle-site', name: '香积寺', coords: [108.88, 34.1], kind: 'site' },
    ],
    sources: [
      { title: '维基百科：香积寺之战', url: 'https://zh.wikipedia.org/wiki/%E9%A6%99%E7%A7%AF%E5%AF%BA%E4%B9%8B%E6%88%98' },
      { title: '维基百科：香积寺（西安）', url: 'https://zh.wikipedia.org/wiki/%E9%A6%99%E7%A7%AF%E5%AF%BA_%28%E8%A5%BF%E5%AE%89%29' },
    ],
  },
  {
    id: 'yancheng',
    name: '郾城之战',
    aliases: ['岳飞郾城', '郾城', '宋金郾城之战', '郾城大捷'],
    era: '宋代',
    years: '1140年',
    summary: '岳家军在郾城方向迎击金军，成为南宋抗金的代表性战役之一。',
    locationBasis: '郾城即今河南省漯河市郾城区，岳飞捷奏中也称金军取径至郾城县北二十余里。',
    note: '箭头把金军由开封方向南压、岳家军由中原战线据郾城迎击的关系表现出来。',
    view: {
      center: [114.02, 33.59],
      height: 560000,
      pitch: -56,
    },
    forces: [
      { id: 'song', name: '岳家军', color: '#4cc9f0' },
      { id: 'jin', name: '金军', color: '#d90429' },
    ],
    arrows: [
      {
        id: 'song-defense',
        forceId: 'song',
        path: [
          [113.85, 34.03],
          [113.95, 33.8],
          [114.02, 33.59],
        ],
        label: '岳家军据郾城迎战',
        labelCoords: [113.95, 33.82],
        width: 9,
      },
      {
        id: 'jin-south',
        forceId: 'jin',
        path: [
          [114.31, 34.79],
          [114.16, 34.15],
          [114.02, 33.59],
        ],
        label: '金军南压',
        labelCoords: [114.16, 34.18],
        width: 10,
      },
    ],
    locations: [
      { id: 'yancheng-site', name: '郾城', coords: [114.02, 33.59], kind: 'site' },
      { id: 'yingchang', name: '颍昌', coords: [113.85, 34.03], kind: 'city' },
      { id: 'kaifeng', name: '开封', coords: [114.31, 34.79], kind: 'capital' },
    ],
    sources: [
      { title: '维基百科：郾城之战', url: 'https://zh.wikipedia.org/wiki/%E9%83%BE%E5%9F%8E%E4%B9%8B%E6%88%B0' },
      { title: '郾城区条目：郾城大捷古战场', url: 'https://zh.wikipedia.org/wiki/%E9%83%BE%E5%9F%8E%E5%8C%BA' },
    ],
  },
  {
    id: 'poyanghu',
    name: '鄱阳湖之战',
    aliases: ['明代鄱阳湖之战', '朱元璋陈友谅', '鄱阳湖', '元末鄱阳湖水战'],
    era: '元末明初',
    years: '1363年',
    summary: '朱元璋与陈友谅在鄱阳湖展开水战，胜负深刻影响明朝建立进程。',
    locationBasis: '鄱阳湖位于今江西省北部，战役围绕鄱阳湖、康郎山、南昌救援等水陆节点展开。',
    note: '箭头表示两支水师会合方向和湖区作战范围，湖面战场边界以鄱阳湖核心区近似表达。',
    view: {
      center: [116.15, 29.15],
      height: 820000,
      pitch: -58,
    },
    forces: [
      { id: 'zhu', name: '朱元璋水师', color: '#3a86ff' },
      { id: 'chen', name: '陈友谅水师', color: '#ef476f' },
    ],
    phases: [
      { id: 'phase-1', name: '会师入湖', time: '1363年七月前后', color: '#93c5fd', description: '朱元璋水师自应天方向南下，先进入鄱阳湖外围水域。' },
      { id: 'phase-2', name: '接敌转向', time: '1363年八月上旬', color: '#60a5fa', description: '朱元璋主力沿湖东侧机动，与陈友谅水师在湖口一线接敌。' },
      { id: 'phase-3', name: '主攻决战', time: '1363年八月下旬', color: '#2563eb', description: '朱元璋主力压向鄱阳湖核心区，对陈友谅舰队实施主攻。' },
    ],
    arrows: [
      {
        id: 'zhu-fleet-1',
        forceId: 'zhu',
        phaseId: 'phase-1',
        path: [
          [118.79, 32.06],
          [117.45, 30.9],
          [116.95, 30.1],
        ],
        label: '朱元璋南下',
        labelCoords: [117.45, 30.95],
        width: 9,
      },
      {
        id: 'zhu-fleet-2',
        forceId: 'zhu',
        phaseId: 'phase-2',
        path: [
          [116.95, 30.1],
          [116.55, 29.6],
          [116.2, 29.28],
        ],
        label: '沿湖东侧接敌',
        labelCoords: [116.58, 29.62],
        width: 10,
      },
      {
        id: 'zhu-fleet-3',
        forceId: 'zhu',
        phaseId: 'phase-3',
        path: [
          [116.2, 29.28],
          [116.1, 29.18],
          [115.98, 29.05],
        ],
        label: '朱元璋主攻',
        labelCoords: [116.12, 29.26],
        width: 10,
      },
      {
        id: 'chen-fleet',
        forceId: 'chen',
        path: [
          [114.31, 30.55],
          [115.25, 29.75],
          [116.15, 29.15],
        ],
        label: '陈友谅水师东进',
        labelCoords: [115.25, 29.78],
        width: 10,
      },
    ],
    locations: [
      { id: 'poyang-site', name: '鄱阳湖', coords: [116.15, 29.15], kind: 'site' },
      { id: 'nanchang', name: '南昌', coords: [115.86, 28.68], kind: 'city' },
      { id: 'yingtian', name: '应天', coords: [118.79, 32.06], kind: 'capital' },
      { id: 'wuchang', name: '武昌', coords: [114.31, 30.55], kind: 'capital' },
    ],
    sources: [
      { title: '维基百科：鄱阳湖之战', url: 'https://zh.wikipedia.org/wiki/%E9%84%B1%E9%99%BD%E6%B9%96%E4%B9%8B%E6%88%B0' },
    ],
  },
]

export const battlePresets: BattlePreset[] = [...coreBattlePresets, ...extraBattlePresets]

export const battlePresetMap = new Map(battlePresets.map((battle) => [battle.id, battle]))

export function searchBattlePresets(keyword: string) {
  const trimmed = keyword.trim().toLowerCase()
  if (!trimmed) return battlePresets

  return battlePresets.filter((battle) => {
    const haystack = [battle.name, battle.era, battle.years, battle.locationBasis, ...battle.aliases]
      .join(' ')
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}
