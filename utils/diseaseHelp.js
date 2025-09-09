import diseaseScaleData from '@/static/data/disease_scale.json';
import templateData1 from '@/static/data/1_template.json';
import templateData3 from '@/static/data/3_template.json';
import templateData4 from '@/static/data/4_template.json';
import templateData5 from '@/static/data/5_template.json';
import templateData6 from '@/static/data/6_template.json';
import templateData7 from '@/static/data/7_template.json';
import templateData8 from '@/static/data/8_template.json';
import templateData9 from '@/static/data/9_template.json';
import templateData10 from '@/static/data/10_template.json';
import templateData11 from '@/static/data/11_template.json';
import templateData12 from '@/static/data/12_template.json';
import templateData13 from '@/static/data/13_template.json';
import templateData14 from '@/static/data/14_template.json';
import templateData15 from '@/static/data/15_template.json';
import templateData16 from '@/static/data/16_template.json';
import templateData17 from '@/static/data/17_template.json';

export function getDiseaseScale(typeCode) {
  const item = diseaseScaleData.find(d => d.type_code === typeCode);
  return item ? item.type_content : [];
}

export function getObjectTemplate(templateId){
  switch (templateId) {
    case 1:
      return templateData1;
    case 3:
      return templateData3;
    case 4:
      return templateData4;
    case 5:
      return templateData5;
    case 6:
      return templateData6;
    case 7:
      return templateData7;
    case 8:
      return templateData8;
    case 9:
      return templateData9;
    case 10:
      return templateData10;
    case 11:
      return templateData11;
    case 12:
      return templateData12;
    case 13:
      return templateData13;
    case 14:
      return templateData14;
    case 15:
      return templateData15;
    case 16:
      return templateData16;
    case 17:
      return templateData17;
  }
}