import diseaseScaleData from '@/static/data/disease_scale.json';

export function getDiseaseScale(typeCode) {
  const item = diseaseScaleData.find(d => d.type_code === typeCode);
  return item ? item.type_content : [];
}