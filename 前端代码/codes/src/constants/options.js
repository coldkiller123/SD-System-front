// 地区代码表
export const REGION_OPTIONS = [
  { code: 'NE', name: '东北地区', provinces: '辽宁、吉林、黑龙江' },
  { code: 'NC', name: '华北地区', provinces: '北京、天津、河北、山西、内蒙古' },
  { code: 'EC', name: '华东地区', provinces: '上海、江苏、浙江、安徽、山东、福建、江西' },
  { code: 'SC', name: '华南地区', provinces: '广东、广西、海南' },
  { code: 'SW', name: '西南地区', provinces: '四川、重庆、云南、贵州、西藏' },
  { code: 'NW', name: '西北地区', provinces: '陕西、甘肃、青海、宁夏、新疆' },
  { code: 'CN', name: '中南地区', provinces: '河南、湖北、湖南' },
  { code: 'HMT', name: '港澳台地区', provinces: '香港、澳门、台湾' },
  { code: 'OTH', name: '其他区域', provinces: '预留其他情况或临时业务区域使用' },
];

// 行业代码表
export const INDUSTRY_OPTIONS = [
  { code: 'MFG', name: '制造业' },
  { code: 'RET', name: '零售业' },
  { code: 'SERV', name: '服务业' },
  { code: 'ENGY', name: '能源与化工行业' },
  { code: 'AGR', name: '农业相关行业' },
  { code: 'HEAL', name: '医疗与卫生行业' },
  { code: 'GOV', name: '政府与公共事业单位' },
  { code: 'FIN', name: '金融与保险行业' },
  { code: 'OTH', name: '其他行业' },
];

// 通过代码查找对象
export function getRegionLabel(code) {
  const item = REGION_OPTIONS.find(r => r.code === code);
  return item ? `${item.code} ${item.name}` : code || '';
}
export function getIndustryLabel(code) {
  const item = INDUSTRY_OPTIONS.find(i => i.code === code);
  return item ? `${item.code} ${item.name}` : code || '';
}

export const CREDIT_RATING_OPTIONS = [
  { code: 'A', name: '极佳' },
  { code: 'B', name: '良好' },
  { code: 'C', name: '一般' },
  { code: 'D', name: '较差' },
  { code: 'E', name: '黑名单' },
];

export function getCreditRatingLabel(code) {
  const item = CREDIT_RATING_OPTIONS.find(i => i.code === code);
  return item ? `${item.code} ${item.name}` : code || '';
} 