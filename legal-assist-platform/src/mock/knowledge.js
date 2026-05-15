export const categoryTree = [
  {
    id: 'law',
    label: '法律法规',
    children: [
      { id: 'law-national', label: '国家法律' },
      { id: 'law-admin', label: '行政法规' },
      { id: 'law-local', label: '地方性法规' },
    ],
  },
  {
    id: 'standard',
    label: '标准规范',
    children: [
      { id: 'std-national', label: '国家标准' },
      { id: 'std-industry', label: '行业标准' },
      { id: 'std-enterprise', label: '企业标准' },
    ],
  },
  {
    id: 'regulation',
    label: '规章条例',
    children: [
      { id: 'reg-dept', label: '部门规章' },
      { id: 'reg-internal', label: '内部制度' },
    ],
  },
  {
    id: 'plan',
    label: '应急预案',
    children: [
      { id: 'plan-general', label: '综合预案' },
      { id: 'plan-special', label: '专项预案' },
      { id: 'plan-onsite', label: '现场处置方案' },
    ],
  },
]

function item(data) {
  return {
    ...data,
    docNumber: data.docNumber,
    docNo: data.docNumber,
    executeDate: data.executeDate,
    effectiveDate: data.executeDate,
  }
}

export const knowledgeList = [
  item({
    id: 'KB-001',
    title: '中华人民共和国安全生产法',
    type: '法律法规',
    categoryId: 'law-national',
    categoryPath: '法律法规 / 国家法律',
    docNumber: '主席令第八十八号',
    publishDate: '2021-06-10',
    executeDate: '2021-09-01',
    department: '全国人民代表大会常务委员会',
    status: '现行有效',
    process: '安全生产管理',
    plan: '生产安全事故综合应急预案',
    keywords: ['安全生产', '主体责任', '隐患排查'],
    summary: '规范生产经营单位安全生产条件与责任，强化政府监管与事故应急救援。',
    content: `第一章 总则

第一条 为了加强安全生产工作，防止和减少生产安全事故，保障人民群众生命和财产安全，促进经济社会持续健康发展，制定本法。

第二条 在中华人民共和国领域内从事生产经营活动的单位的安全生产，适用本法。

第四章 生产经营单位的安全生产保障

生产经营单位应当建立健全全员安全生产责任制，加强安全生产标准化建设，构建安全风险分级管控和隐患排查治理双重预防机制。生产经营单位的主要负责人对本单位安全生产工作全面负责。`,
  }),
  item({
    id: 'KB-002',
    title: '生产经营单位安全培训规定',
    type: '规章条例',
    categoryId: 'reg-dept',
    categoryPath: '规章条例 / 部门规章',
    docNumber: '安监总局令第3号（2015修正）',
    publishDate: '2015-05-29',
    executeDate: '2015-07-01',
    department: '国家安全生产监督管理总局',
    status: '现行有效',
    process: '安全教育培训',
    plan: '—',
    keywords: ['安全培训', '三级教育', '特种作业'],
    summary: '明确主要负责人、管理人员、从业人员及特种作业人员培训要求与学时标准。',
    content: `第一条 为加强和规范生产经营单位安全培训工作，提高从业人员安全素质，防范伤亡事故，减轻职业危害，根据安全生产法和有关法律、行政法规，制定本规定。

第三条 工矿商贸生产经营单位应当进行安全培训，未经安全生产培训合格的从业人员，不得上岗作业。主要负责人和安全生产管理人员应当具备与本单位所从事的生产经营活动相应的安全生产知识和管理能力。`,
  }),
  item({
    id: 'KB-003',
    title: 'GB/T 33000-2016 企业安全生产标准化基本规范',
    type: '标准规范',
    categoryId: 'std-national',
    categoryPath: '标准规范 / 国家标准',
    docNumber: 'GB/T 33000-2016',
    publishDate: '2016-10-13',
    executeDate: '2017-04-01',
    department: '国家质量监督检验检疫总局、国家标准化管理委员会',
    status: '现行有效',
    process: '标准化建设',
    plan: '—',
    keywords: ['标准化', '考评', '持续改进'],
    summary: '规定企业安全生产标准化建设的基本要求、核心要素与考评方法。',
    content: `本标准规定了企业安全生产标准化建设的总体要求、一般要求以及目标职责、制度化管理、教育培训、现场管理、安全风险管控及隐患排查治理、应急管理、事故管理、持续改进等核心要素。

企业应按照本标准开展安全生产标准化建设，形成文件化、体系化、常态化的运行机制，并定期开展自评与外部考评。`,
  }),
  item({
    id: 'KB-004',
    title: '危险化学品重大危险源监督管理暂行规定',
    type: '规章条例',
    categoryId: 'reg-dept',
    categoryPath: '规章条例 / 部门规章',
    docNumber: '安监总局令第40号',
    publishDate: '2011-07-05',
    executeDate: '2011-12-01',
    department: '国家安全生产监督管理总局',
    status: '现行有效',
    process: '重大危险源管理',
    plan: '危险化学品事故专项应急预案',
    keywords: ['重大危险源', '辨识评估', '在线监测'],
    summary: '规范危险化学品重大危险源的辨识、登记、监测预警与应急管理。',
    content: `第三条 本规定适用于从事危险化学品生产、储存、使用和经营的单位（以下简称危险化学品单位）的重大危险源监督管理。

第四条 危险化学品单位应当建立健全重大危险源安全管理规章制度，落实安全生产主体责任，对重大危险源实行登记建档、定期检测、评估、监控和应急措施。`,
  }),
  item({
    id: 'KB-005',
    title: '生产安全事故综合应急预案（范本）',
    type: '应急预案',
    categoryId: 'plan-general',
    categoryPath: '应急预案 / 综合预案',
    docNumber: 'Q/内部-EP-001',
    publishDate: '2024-03-15',
    executeDate: '2024-03-15',
    department: '企业安全生产委员会',
    status: '现行有效',
    process: '应急响应',
    plan: '综合应急预案',
    keywords: ['应急组织', '响应分级', '信息报告'],
    summary: '明确事故风险描述、应急组织机构及职责、预警与信息报告、应急响应程序与保障措施。',
    content: `1 总则
1.1 编制目的
规范本单位生产安全事故应急工作，提高应对事故能力，最大限度减少人员伤亡和财产损失。

2 应急组织机构及职责
应急指挥部由总指挥、副总指挥及各工作组组成，下设抢险救援组、医疗救护组、警戒疏散组、后勤保障组、通讯联络组。

4 应急响应
根据事故危害程度、影响范围和可控性，将应急响应分为Ⅰ级（特别重大）、Ⅱ级（重大）、Ⅲ级（较大）、Ⅳ级（一般）四级。`,
  }),
  item({
    id: 'KB-006',
    title: '特种设备安全监察条例',
    type: '法律法规',
    categoryId: 'law-admin',
    categoryPath: '法律法规 / 行政法规',
    docNumber: '国务院令第549号',
    publishDate: '2009-01-24',
    executeDate: '2009-05-01',
    department: '国务院',
    status: '现行有效',
    process: '特种设备管理',
    plan: '特种设备事故专项应急预案',
    keywords: ['特种设备', '检验检测', '使用登记'],
    summary: '加强特种设备安全监管，规范生产、使用、检验检测及监督管理活动。',
    content: `第一条 为了加强特种设备的安全监察，防止和减少事故，保障人民群众生命和财产安全，促进经济发展，制定本条例。

第二条 本条例所称特种设备是指涉及生命安全、危险性较大的锅炉、压力容器（含气瓶）、压力管道、电梯、起重机械、客运索道、大型游乐设施和场（厂）内专用机动车辆。特种设备使用单位应当建立岗位责任、隐患治理、应急救援等安全管理制度。`,
  }),
]

export const typeOptions = ['全部', '法律法规', '标准规范', '规章条例', '应急预案']
