/* ============================================================
   첫금융 프로토타입 — app.js
   트랙1(이정헌): 온보딩 + 은행매트릭스 (Step1~4)
   트랙2(박소희): 대시보드 + 보험관리 + 카드기반 Q&A (Step5~6)
   ============================================================ */

const steps = [
  { title: "기본 정보", description: "거주 정보 확인" },
  { title: "체류 자격", description: "비자 유형 확인" },
  { title: "금융 준비", description: "보유 서류 확인" },
  { title: "은행 추천", description: "매트릭스 비교 결과" },
  { title: "대시보드", description: "오늘 할 일 확인" },
  { title: "보험관리", description: "출국만기·귀국비용보험" },
  { title: "송금 비교", description: "국가별 송금 채널 비교" },
];

const visas = [
  ["E-9", "비전문취업", "고용허가제로 근무 중이에요"],
  ["H-2", "방문취업", "방문취업 자격으로 체류 중이에요", "2026-02-12부터 신규발급 중단 · 기존 보유자만 유지"],
  ["F-4", "재외동포", "재외동포 자격으로 체류 중이에요", "2026-02-12부터 H-2 통합대상 포함"],
  ["F-6", "결혼이민", "한국인 배우자와 생활하고 있어요"],
  ["D-2", "유학", "대학·대학원에서 공부하고 있어요"],
  ["D-4", "일반연수", "어학당 등에서 연수 중이에요"],
];

/* ---------- 트랙1(이정헌) Day2 리서치 반영: 은행 매트릭스 실데이터 ---------- */
const banks = [
  {
    key: "hana", name: "하나은행", product: "Easy-One Pack 통장",
    benefit: "급여·카드·적금 등 이용실적 기준 전자금융/ATM 수수료 우대",
    idDocs: "외국인등록증·영주증·국내거소신고증 중 1 + 여권",
    channel: "상품 가입은 영업점 우선", langSupport: "하나EZ 16개국 언어",
    nonFace: false, note: "여권번호로 이용 중 등록증을 받으면 하나EZ에서 실명번호 변경 가능",
    priorityVisas: ["E-9", "H-2", "F-4"], sources: ["S01", "S02"],
  },
  {
    key: "shinhan", name: "신한은행", product: "SOLGlobal 통장·적금 · 외국인 전용 대출",
    benefit: "외국어 앱에서 계좌개설·송금·환전, 외국어 상담 10개 언어",
    idDocs: "외국인등록증 등 실명증표 + 여권",
    channel: "SOL Global 또는 영업점", langSupport: "SOL Global 다국어 앱 · 외국어 상담 10개 언어",
    nonFace: true, note: "대출은 예금보다 비자·재직기간·수입 검토 조건이 제한 — 별도 확인 필요",
    priorityVisas: ["F-4", "F-6", "D-2", "D-4"], sources: ["S03", "S04"],
    related: {
      name: "SOL글로벌론", fee: "", note: "외국인 전용 신용대출 — 비자·재직기간·수입 요건은 지점에서 별도 심사",
    },
  },
  {
    key: "kb", name: "KB국민은행", product: "KB Global스타 통장·적금",
    benefit: "외국인 전용 수수료·환율·해외송금 우대",
    idDocs: "외국인등록증·영주증·국내거소신고증 중 1",
    channel: "KB스타앱 또는 영업점", langSupport: "다국어 안내 제공(앱 지원 언어 수는 재확인 필요)",
    nonFace: true, requiresDomesticAccount: true,
    note: "비대면은 만 19세 이상 거주자 · 본인명의 국내 전화번호 + 타행 입출금계좌 필요(여권 단일 불가)",
    priorityVisas: ["F-4", "F-6", "D-2"], sources: ["S05", "S06"],
  },
  {
    key: "woori", name: "우리은행", product: "Woori WON Global",
    benefit: "17개 언어, 비대면 계좌개설, 송금·환전·일상형 서비스",
    idDocs: "외국인등록증 + 여권",
    channel: "WON Global 또는 영업점", langSupport: "17개 언어 앱 지원",
    nonFace: true, note: "앱 가입 가능 여부는 체류기간·전화번호 본인인증 상태에 따라 달라질 수 있음",
    priorityVisas: ["H-2", "F-6", "D-2", "D-4"], sources: ["S07"],
    related: {
      name: "퀵글로벌송금", fee: "5,000원", note: "환율우대 최대 50%(모바일 30%) — 송금 전용 부가상품",
    },
  },
  {
    key: "ibk", name: "IBK기업은행", product: "IBK BUDDY 외국인통장·카드",
    benefit: "이체/ATM 수수료 조건 없이 면제, USD·JPY·EUR 환율 80% 우대",
    idDocs: "외국인등록증 등 실명증표 + 여권",
    channel: "i-ONE Bank Global 또는 영업점", langSupport: "15개 언어(17개국)",
    nonFace: true, note: "여권만 보유한 경우 영업점에서 확인 필요",
    priorityVisas: ["E-9", "H-2"], sources: ["S08", "S09"],
    related: {
      name: "I-VARO 송금", fee: "", note: "IBK 외국인 전용 해외송금 서비스 — 세부 수수료는 앱에서 확인",
    },
  },
  {
    key: "nh", name: "NH농협은행", product: "NHGlobal위드 통장·적금·체크카드 (E8세트 별도)",
    benefit: "조건 완료 시 금리 우대, 전자금융/ATM 수수료 면제, 해외송금 환율·수수료 50% 우대",
    idDocs: "외국인등록증 등 실명증표 + 여권",
    channel: "NHAll-OneGlobal 또는 영업점", langSupport: "앱 13개 언어 · 데스크 AI 통번역 38개 언어",
    nonFace: true, note: "지역 농·축협은 상품·창구가 다를 수 있어 별도 확인 필요",
    priorityVisas: ["E-9"], sources: ["S10", "S11"],
    related: {
      name: "K-외국인신용대출", fee: "", note: "F-2/F-5/F-6/E-7/E-9, 6개월 이상 재직, 최대 3천만원",
      eligibleVisas: ["F-2", "F-5", "F-6", "E-7", "E-9"],
    },
  },
];

const visaDocRules = {
  "E-9": { purpose: "근로계약서·재직증명서·급여명세", address: "임대차계약서·거주시설확인서", summary: "급여·송금형 상품을 우선 비교하고, 대출은 재직기간을 별도 확인해요." },
  "H-2": { purpose: "근로계약서·재직/수입 자료", address: "임대차계약서·거주지 확인 서류", summary: "취업 상태에 따라 근로자형 또는 일반 거주자형 상품으로 나뉘어요." },
  "F-4": { purpose: "재직·사업·재적 등 이용목적 자료", address: "임대차계약서·공공요금 고지서", summary: "일반 거주자형 상품을 비교해요. 여권만으로는 비대면 개설이 제외돼요." },
  "F-6": { purpose: "재직·수입·일상비 목적 자료", address: "주민등록등본·임대차계약서", summary: "예금은 전체 은행을 비교하고, 신용·전세대출은 별도로 검토해요." },
  "D-2": { purpose: "재적증명서·기관신분증·입교확인서", address: "거주시설확인서·임대차계약서", summary: "일상비·송금 편의 위주로 비교하고, 급여형 이점은 대상에서 빠져요." },
  "D-4": { purpose: "연수/재적증명서·입교확인서", address: "거주시설확인서·임대차계약서", summary: "연수생형 일상계좌를 우선 비교하고, 근로수입을 전제한 상품은 빠져요." },
};

const bankSources = {
  S01: "https://www.kebhana.com/cont/mall/mall08/mall0801/mall080103/1431574_115188.jsp",
  S02: "https://kebhana.com/cont/customer/customer04/customer0402/1500439_114300.jsp",
  S03: "https://www.shinhangroup.com/kr/archive/press/detail/521",
  S04: "https://www.shinhangroup.com/kr/archive/press/detail/42",
  S05: "https://kbthink.com/saving-guide/foreigner-account.html",
  S06: "https://obank.kbstar.com/quics?cc=b061761%3Ab061770&isNew=N&page=C020702&prcode=DP01001654",
  S07: "https://svc.wooribank.com/svc/Dream?withyou=SFSBK0014",
  S08: "https://global.ibk.co.kr/en/services/iONEBankGlobal",
  S09: "https://www.newspim.com/news/view/20250421000274",
  S10: "https://www.nongmin.com/article/20250925500342",
  S11: "https://www.newspim.com/news/view/20251124000933",
};

function evaluateBank(bank, visaCode, readiness) {
  const rule = visaDocRules[visaCode] || {};
  if (!readiness.arc) {
    return { level: "hold", label: "영업점 확인 필요", reason: "외국인등록증(또는 거소증)과 여권 확인이 아직 안 됐어요." };
  }
  if (!readiness.employment) {
    return { level: "warn", label: "추가서류 필요", reason: `${rule.purpose || "목적 자료"} 중 준비된 자료가 없으면 추가서류를 요청받을 수 있어요.` };
  }
  if (bank.nonFace && !readiness.phone) {
    return { level: "warn", label: "비대면 어려울 수 있음", reason: "본인명의 국내 전화번호가 없으면 비대면 개설이 어려워 영업점 방문이 필요할 수 있어요." };
  }
  if (bank.requiresDomesticAccount && !readiness.hasDomesticAccount) {
    return { level: "warn", label: "비대면 어려울 수 있음", reason: "이 은행은 비대면 개설 시 본인 명의의 타행 입출금계좌가 있어야 해요. 없으면 영업점 방문이 필요할 수 있어요." };
  }
  if (!readiness.address) {
    return { level: "info", label: "주소자료 준비 권장", reason: `${rule.address || "주소 자료"} 중 하나를 준비하면 진행이 더 수월해요.` };
  }
  return { level: "ok", label: "제안 가능", reason: "현재 준비 상태로 바로 진행할 수 있어요." };
}

function rankBanks(visaCode, readiness) {
  return banks
    .map((bank) => ({ bank, evalResult: evaluateBank(bank, visaCode, readiness), prioritized: bank.priorityVisas.includes(visaCode) }))
    .sort((a, b) => Number(b.prioritized) - Number(a.prioritized));
}

/* ---------- 트랙2(박소희) Day1~3: EPS 보험 D-day 로직 + 보험카드 데이터 ---------- */

function daysUntilDeadline(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  d.setFullYear(d.getFullYear() + 3);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function returnCostAmount(nationality) {
  const tier1 = ["베트남", "중국", "태국", "필리핀", "인도네시아"];
  if (tier1.includes(nationality)) return 400000;
  if (nationality === "몽골") return 500000;
  if (nationality === "스리랑카") return 600000;
  return 500000; // 기타 국가
}

function pillFor(days, kind, s) {
  if (days === null) return { cls: "neutral", txt: kind === "c2" ? s.pillDue : s.pillUnset };
  if (days < 0) return { cls: "critical", txt: s.pillCritical };
  if (days <= 90) return { cls: "warn", txt: s.pillCritical };
  if (kind === "c2") return { cls: "ok", txt: s.pillDue };
  return { cls: "ok", txt: s.pillOk };
}

/* 4개 언어 문구 — 2026-08-31 "보험 동행 카드" 와이어프레임 아티팩트에서 그대로 이식 (한/영은 검토완료 수준). 중/베는 초안이지만, 2026-09-02 팀 결정에 따라 원어민 감수는 최초 제출본에서는 보류하고 이 초안 그대로 제출한다(본선 진출 시 감수 예정). */
const INSURANCE_STR = {
  ko: {
    title: "보험 동행 — 출국만기·귀국비용보험", subtitle: "체류 기간 내내, 모국어로 챙기는 의무보험 청구 안내",
    sum1k: "계좌 개설", sum1v: "완료", sum2k: "출국만기보험", sum3k: "귀국비용보험",
    ctrlDate: "출국 예정일", ctrlCheck: "1년 이상 근무했어요",
    ctrlNote: "날짜를 넣으면 두 카드의 D-day가 실시간으로 계산돼요. (지급사유 발생일+3년 − 오늘)",
    c1Title: "출국만기보험", c1Sub: "사업주가 매달 적립해온, 나의 퇴직금 성격 보험금",
    c1F1k: "적립 기준", c1F2k: "지급 시기", c1F2v: "출국 후 14일 이내", c1F3k: "청구 기한", c1F3v: "지급사유 발생일부터 3년",
    c1DdayLabel: "청구기한까지",
    c1NextB: "다음 행동 —", c1NextOver1y: "1년 이상 근무했으니 본인이 직접 청구해요.", c1NextUnder1y: "1년 미만 근무라 사업주가 대신 청구하는 항목이에요.",
    c1Btn1: "청구 절차 자세히", c1Btn2: "이 카드에 물어보기",
    c1Steps: ["출국 예정일 1개월 전부터 출국예정신고 (고용센터 방문 · FAX · EPS 홈페이지)", "출국예정사실확인서 발급", "외국인보험 전용 상담센터 또는 전용 홈페이지에서 보험금 지급 신청", "출국 후 14일 이내 지급 (1년 미만 근무 시 사업주가 수령)"],
    c2Title: "귀국비용보험", c2Sub: "내가 낸 귀국 비용, 출국할 때 돌려받는 보험금",
    c2F1k: "납부 금액", c2F2k: "신청 기간", c2F2v: "출국 1개월 전 ~ 최소 7일 전", c2F3k: "청구 기한", c2F3v: "지급사유 발생일부터 3년",
    c2DdayLabel: "청구기한까지",
    c2NextB: "다음 행동 —", c2NextV: "본인이 직접 청구 가능해요 (전용 앱 또는 콜센터).",
    c2Btn1: "청구 절차 자세히", c2Btn2: "이 카드에 물어보기",
    c2Steps: ["출국 예정일 1개월 전부터 최소 7일 전까지 신청", "출국예정신고 → 출국예정사실확인서 준비", "삼성화재 콜센터(☎ 02-2261-8400) · FAX · 전용 앱 · 지역 삼성화재 지역단 중 하나로 신청", "공항수령 또는 계좌수령 선택"],
    qaTag: "Q&A 동작 예시 (모크 — 화면 하단 AI 금융도우미에서 실제 LLM 연동 시도)",
    qaDeadline: "지급사유(출국) 발생일로부터 3년 안에 청구해야 해요. 넘기면 한국산업인력공단으로 이전돼요.",
    qaRefuse: "이 카드 정보로는 답변할 수 없어요. 관련 화면이나 삼성화재 콜센터(02-2261-8400)에서 확인해 주세요.",
    qaUnset: "출국 예정일을 아직 입력하지 않아서 청구기한을 계산할 수 없어요. 출국 예정일을 먼저 입력해 주세요.",
    qaLoading: "답변을 준비하는 중이에요. 잠시만 기다려주세요...",
    qaPreset1: "청구 기한이 궁금해요", qaPreset2: "제가 직접 청구할 수 있나요?", qaPreset3: "다른 나라 환율은요?",
    qaPlaceholder: "이 카드에 대해 궁금한 점을 물어보세요", qaSend: "물어보기",
    bannerTitle: "출국 전 챙길 것 3가지",
    stub1t: "출국예정신고", stub1d: "1개월 전부터, EPS 홈페이지·고용센터·FAX",
    stub2t: "두 보험금 청구", stub2d: "출국만기보험 · 귀국비용보험, 3년 안에",
    stub3t: "국민연금 반환일시금", stub3d: "수급권 발생일로부터 5년 안에, ☎ 1355",
    ddayFmt: (n) => (n === null ? "D-미정" : n < 0 ? "기한 만료" : `D-${n}`),
    pillCritical: "소멸임박", pillOk: "청구가능", pillNeutral: "적립중", pillDue: "납부완료", pillUnset: "출국일 미정",
    dashTitle: "오늘 할 일", dashSub: "계좌 개설 상태와 두 보험 청구 기한을 한눈에 확인해요.",
    bannerAccountTitle: "계좌부터 개설하세요", bannerAccountDesc: "아직 계좌 개설 여부를 체크하지 않았어요. 은행 추천 화면에서 준비 서류를 먼저 확인해 보세요.",
    bannerInsuranceTitle: "보험 청구 기한이 다가오고 있어요", bannerInsuranceDesc: "청구기한이 90일 이내로 남았어요. 보험관리 화면에서 청구 절차를 확인하세요.",
    bannerClearTitle: "지금은 특별히 할 일이 없어요", bannerClearDesc: "출국 예정일이 다가오면 보험 청구를 준비하세요. 그 전까지는 계좌와 서류만 잘 관리하면 돼요.",
    goLabel: "바로가기 →", notYet: "미완료", accountCheckLabel: "계좌를 이미 개설했어요",
  },
  en: {
    title: "Insurance Companion — Departure & Return-Cost Insurance", subtitle: "Guidance on mandatory insurance claims, in your language, for your whole stay",
    sum1k: "Bank account", sum1v: "Done", sum2k: "Departure Insurance", sum3k: "Return-Cost Insurance",
    ctrlDate: "Planned departure date", ctrlCheck: "Worked 1+ year",
    ctrlNote: "Enter a date to recalculate both D-day counters live. (payout-trigger date + 3 years − today)",
    c1Title: "Departure Guarantee Insurance", c1Sub: "Your severance-style payout, accrued monthly by your employer",
    c1F1k: "Accrual base", c1F2k: "Payout timing", c1F2v: "Within 14 days of departure", c1F3k: "Claim deadline", c1F3v: "3 years from the payout trigger",
    c1DdayLabel: "until claim deadline",
    c1NextB: "Next step —", c1NextOver1y: "You worked 1+ year, so you claim it yourself.", c1NextUnder1y: "Under 1 year worked — your employer claims this one.",
    c1Btn1: "Claim steps", c1Btn2: "Ask about this card",
    c1Steps: ["File a departure notice from 1 month before leaving (employment center, fax, or EPS site)", "Get your Departure Confirmation issued", "Apply for the payout via the foreign-worker insurance center or its website", "Paid within 14 days of departure (employer receives it if under 1 year worked)"],
    c2Title: "Return-Cost Insurance", c2Sub: "The return-travel cost you paid in, refunded when you leave",
    c2F1k: "Amount paid", c2F2k: "Application window", c2F2v: "1 month to at least 7 days before departure", c2F3k: "Claim deadline", c2F3v: "3 years from the payout trigger",
    c2DdayLabel: "until claim deadline",
    c2NextB: "Next step —", c2NextV: "You can claim it yourself (via the app or the call center).",
    c2Btn1: "Claim steps", c2Btn2: "Ask about this card",
    c2Steps: ["Apply between 1 month and at least 7 days before departure", "Prepare your departure notice and Departure Confirmation", "Apply via Samsung Fire call center (+82-2-2261-8400), fax, the app, or a local branch", "Choose airport pickup or bank transfer"],
    qaTag: "Q&A demo (mock — the AI Financial Helper at bottom right tries a real LLM call)",
    qaDeadline: "You must claim within 3 years of the payout trigger (your departure). After that, funds move to HRD Korea.",
    qaRefuse: "This card's data can't answer that. Please check the relevant screen, or call Samsung Fire (+82-2-2261-8400).",
    qaUnset: "You haven't entered a planned departure date yet, so the claim deadline can't be calculated. Please enter it first.",
    qaLoading: "Preparing an answer, please wait a moment...",
    qaPreset1: "What's the claim deadline?", qaPreset2: "Can I claim it myself?", qaPreset3: "What about exchange rates?",
    qaPlaceholder: "Ask a question about this card", qaSend: "Ask",
    bannerTitle: "3 things to handle before you leave",
    stub1t: "Departure notice", stub1d: "From 1 month before, via EPS site, employment center, or fax",
    stub2t: "Claim both insurance payouts", stub2d: "Departure & return-cost insurance, within 3 years",
    stub3t: "National Pension lump-sum refund", stub3d: "Within 5 years of eligibility, call 1355",
    ddayFmt: (n) => (n === null ? "D-unset" : n < 0 ? "Expired" : `D-${n}`),
    pillCritical: "Expiring soon", pillOk: "Claimable", pillNeutral: "Accruing", pillDue: "Paid", pillUnset: "Date not set",
    dashTitle: "Today's checklist", dashSub: "See your account status and both insurance claim deadlines at a glance.",
    bannerAccountTitle: "Open your account first", bannerAccountDesc: "You haven't marked your account as opened yet. Check the required documents on the bank recommendation screen.",
    bannerInsuranceTitle: "An insurance claim deadline is approaching", bannerInsuranceDesc: "Your claim deadline is within 90 days. Check the claim steps on the insurance screen.",
    bannerClearTitle: "Nothing urgent right now", bannerClearDesc: "Get ready to claim once your departure date is closer. Until then, just keep your account and documents in order.",
    goLabel: "Go →", notYet: "Not yet", accountCheckLabel: "I've already opened an account",
  },
  zh: {
    /* 중국어 초안 — 최초 제출본은 이 초안으로 그대로 제출(원어민 감수는 본선 진출 시로 보류, 2026-09-02 팀 결정) */
    title: "保险同行 — 归国临时保险 · 归国费用保险", subtitle: "整个在韩期间，用您的母语指引强制保险理赔",
    sum1k: "开户", sum1v: "已完成", sum2k: "归国临时保险", sum3k: "归国费用保险",
    ctrlDate: "预计离境日期", ctrlCheck: "已工作满1年",
    ctrlNote: "输入日期后，两张卡片的倒计时会实时计算。（给付事由发生日+3年－今天）",
    c1Title: "归国临时保险", c1Sub: "雇主每月为您积累的、类似离职金性质的保险金",
    c1F1k: "积累标准", c1F2k: "给付时间", c1F2v: "离境后14日内", c1F3k: "申领期限", c1F3v: "自给付事由发生日起3年",
    c1DdayLabel: "距申领期限",
    c1NextB: "下一步 —", c1NextOver1y: "您已工作满1年，可本人直接申领。", c1NextUnder1y: "工作不满1年，需由雇主代为申领。",
    c1Btn1: "查看申领流程", c1Btn2: "向此卡片提问",
    c1Steps: ["离境前1个月起提交离境预定申报（就业中心/传真/EPS网站）", "领取离境预定事实确认书", "通过外国人保险专用咨询中心或官网申请给付", "离境后14日内给付（工作不满1年由雇主领取）"],
    c2Title: "归国费用保险", c2Sub: "您缴纳的归国费用，离境时予以返还的保险金",
    c2F1k: "缴纳金额", c2F2k: "申请期间", c2F2v: "离境前1个月至最少7天前", c2F3k: "申领期限", c2F3v: "自给付事由发生日起3年",
    c2DdayLabel: "距申领期限",
    c2NextB: "下一步 —", c2NextV: "可本人直接申领（专用App或客服中心）。",
    c2Btn1: "查看申领流程", c2Btn2: "向此卡片提问",
    c2Steps: ["离境前1个月至最少7天前申请", "准备离境预定申报及确认书", "通过三星火灾客服中心(+82-2-2261-8400)、传真、专用App或地区分公司申请", "选择机场领取或账户转账"],
    qaTag: "问答演示（模拟 — 右下角AI金融助手会尝试真实LLM调用）",
    qaDeadline: "须在给付事由（离境）发生日起3年内申领，逾期将转入韩国产业人力公团。",
    qaRefuse: "此卡片的数据无法回答该问题，请在相关页面查看，或致电三星火灾客服中心(02-2261-8400)。",
    qaUnset: "您还没有输入预计离境日期，无法计算申领期限。请先输入该日期。",
    qaLoading: "正在准备回答，请稍候...",
    qaPreset1: "申领期限是多久？", qaPreset2: "我可以本人申领吗？", qaPreset3: "其他国家的汇率呢？",
    qaPlaceholder: "请就此卡片提问", qaSend: "提问",
    bannerTitle: "离境前需办理的3件事",
    stub1t: "离境预定申报", stub1d: "离境前1个月起，EPS网站/就业中心/传真",
    stub2t: "申领两项保险金", stub2d: "归国临时保险·归国费用保险，3年内",
    stub3t: "国民年金一次性返还金", stub3d: "受益权发生日起5年内，☎1355",
    ddayFmt: (n) => (n === null ? "D-未定" : n < 0 ? "已过期" : `D-${n}`),
    pillCritical: "即将到期", pillOk: "可申领", pillNeutral: "积累中", pillDue: "已缴纳", pillUnset: "未设定日期",
    dashTitle: "今日待办", dashSub: "一目了然地查看开户状态和两项保险的申领期限。",
    bannerAccountTitle: "请先开户", bannerAccountDesc: "您还没有勾选开户完成。请先在银行推荐页面确认所需材料。",
    bannerInsuranceTitle: "保险申领期限即将到期", bannerInsuranceDesc: "申领期限已不到90天。请在保险管理页面确认申领流程。",
    bannerClearTitle: "目前没有紧急事项", bannerClearDesc: "离境日期临近时再准备保险申领即可，在此之前管理好账户和材料就可以了。",
    goLabel: "前往 →", notYet: "未完成", accountCheckLabel: "我已经开户了",
  },
  vi: {
    /* Bản dịch tiếng Việt sơ bộ — chưa qua kiểm duyệt của người bản ngữ (mục F trong checklist dự án vẫn chưa xử lý) */
    title: "Đồng hành bảo hiểm — BH mãn hạn xuất cảnh & BH chi phí hồi hương", subtitle: "Hướng dẫn yêu cầu bảo hiểm bắt buộc bằng tiếng mẹ đẻ, suốt thời gian lưu trú",
    sum1k: "Mở tài khoản", sum1v: "Hoàn tất", sum2k: "BH mãn hạn xuất cảnh", sum3k: "BH chi phí hồi hương",
    ctrlDate: "Ngày dự kiến xuất cảnh", ctrlCheck: "Đã làm việc trên 1 năm",
    ctrlNote: "Nhập ngày để tính lại D-day cho cả hai thẻ ngay lập tức. (ngày phát sinh lý do chi trả + 3 năm − hôm nay)",
    c1Title: "Bảo hiểm mãn hạn xuất cảnh", c1Sub: "Khoản tiền giống trợ cấp thôi việc, chủ sử dụng lao động tích lũy hàng tháng",
    c1F1k: "Mức tích lũy", c1F2k: "Thời điểm chi trả", c1F2v: "Trong vòng 14 ngày sau khi xuất cảnh", c1F3k: "Hạn yêu cầu", c1F3v: "3 năm kể từ ngày phát sinh lý do chi trả",
    c1DdayLabel: "đến hạn yêu cầu",
    c1NextB: "Việc cần làm —", c1NextOver1y: "Bạn đã làm trên 1 năm nên tự mình yêu cầu chi trả.", c1NextUnder1y: "Làm dưới 1 năm nên chủ sử dụng lao động sẽ là người yêu cầu.",
    c1Btn1: "Xem quy trình yêu cầu", c1Btn2: "Hỏi về thẻ này",
    c1Steps: ["Khai báo dự định xuất cảnh từ 1 tháng trước (Trung tâm việc làm, fax, hoặc trang EPS)", "Nhận Giấy xác nhận dự định xuất cảnh", "Nộp yêu cầu chi trả tại trung tâm tư vấn bảo hiểm lao động nước ngoài hoặc website", "Chi trả trong 14 ngày sau khi xuất cảnh (dưới 1 năm thì chủ sử dụng lao động nhận)"],
    c2Title: "Bảo hiểm chi phí hồi hương", c2Sub: "Khoản phí hồi hương bạn đã đóng, được hoàn lại khi xuất cảnh",
    c2F1k: "Số tiền đã đóng", c2F2k: "Thời gian đăng ký", c2F2v: "Từ 1 tháng đến ít nhất 7 ngày trước khi xuất cảnh", c2F3k: "Hạn yêu cầu", c2F3v: "3 năm kể từ ngày phát sinh lý do chi trả",
    c2DdayLabel: "đến hạn yêu cầu",
    c2NextB: "Việc cần làm —", c2NextV: "Bạn có thể tự yêu cầu (qua ứng dụng hoặc tổng đài).",
    c2Btn1: "Xem quy trình yêu cầu", c2Btn2: "Hỏi về thẻ này",
    c2Steps: ["Đăng ký từ 1 tháng đến ít nhất 7 ngày trước khi xuất cảnh", "Chuẩn bị khai báo dự định xuất cảnh và giấy xác nhận", "Đăng ký qua tổng đài Samsung Fire (+82-2-2261-8400), fax, ứng dụng, hoặc chi nhánh địa phương", "Chọn nhận tại sân bay hoặc chuyển khoản"],
    qaTag: "Ví dụ hỏi đáp (mô phỏng — Trợ lý tài chính AI ở góc dưới sẽ thử gọi LLM thật)",
    qaDeadline: "Phải yêu cầu trong vòng 3 năm kể từ ngày phát sinh lý do (xuất cảnh). Sau đó tiền sẽ chuyển cho HRD Korea.",
    qaRefuse: "Thẻ này không có dữ liệu để trả lời câu hỏi đó. Vui lòng xem ở màn hình liên quan, hoặc gọi tổng đài Samsung Fire (02-2261-8400).",
    qaUnset: "Bạn chưa nhập ngày dự kiến xuất cảnh nên chưa thể tính hạn yêu cầu. Vui lòng nhập ngày trước.",
    qaLoading: "Đang chuẩn bị câu trả lời, vui lòng đợi trong giây lát...",
    qaPreset1: "Hạn yêu cầu là khi nào?", qaPreset2: "Tôi có thể tự yêu cầu không?", qaPreset3: "Tỷ giá nước khác thì sao?",
    qaPlaceholder: "Hỏi điều bạn muốn biết về thẻ này", qaSend: "Hỏi",
    bannerTitle: "3 việc cần làm trước khi xuất cảnh",
    stub1t: "Khai báo dự định xuất cảnh", stub1d: "Từ 1 tháng trước, qua trang EPS, trung tâm việc làm, hoặc fax",
    stub2t: "Yêu cầu cả hai khoản bảo hiểm", stub2d: "BH mãn hạn xuất cảnh · BH chi phí hồi hương, trong 3 năm",
    stub3t: "Hoàn trả một lần lương hưu quốc dân", stub3d: "Trong 5 năm kể từ ngày đủ điều kiện, ☎1355",
    ddayFmt: (n) => (n === null ? "D-chưa đặt" : n < 0 ? "Đã hết hạn" : `D-${n}`),
    pillCritical: "Sắp hết hạn", pillOk: "Có thể yêu cầu", pillNeutral: "Đang tích lũy", pillDue: "Đã đóng", pillUnset: "Chưa đặt ngày",
    dashTitle: "Việc cần làm hôm nay", dashSub: "Xem nhanh trạng thái mở tài khoản và hạn yêu cầu của cả hai bảo hiểm.",
    bannerAccountTitle: "Hãy mở tài khoản trước", bannerAccountDesc: "Bạn chưa đánh dấu đã mở tài khoản. Hãy kiểm tra giấy tờ cần thiết ở màn hình gợi ý ngân hàng.",
    bannerInsuranceTitle: "Hạn yêu cầu bảo hiểm đang đến gần", bannerInsuranceDesc: "Hạn yêu cầu còn dưới 90 ngày. Hãy xem quy trình yêu cầu ở màn hình quản lý bảo hiểm.",
    bannerClearTitle: "Hiện chưa có việc gấp", bannerClearDesc: "Khi gần đến ngày xuất cảnh, hãy chuẩn bị yêu cầu bảo hiểm. Trước đó chỉ cần quản lý tốt tài khoản và giấy tờ.",
    goLabel: "Đi tới →", notYet: "Chưa xong", accountCheckLabel: "Tôi đã mở tài khoản rồi",
  },
};

/* 카드기반 Q&A 시스템 프롬프트 (Day3 초안, 그대로 Day4 LLM 연동에 사용 예정)
   ────────────────────────────────────────────────────────────
   당신은 이주노동자 금융정착 서비스의 "카드 안내 도우미"입니다.
   사용자가 지금 보고 있는 보험 카드 데이터와 아래 용어집만 근거로 답변하세요.
   [규칙]
   1. 카드 데이터와 용어집에 없는 내용은 "이 카드 정보로는 답변할 수 없어요. OO 화면/OO 콜센터에서
      확인해 주세요"라고만 답한다. 절대 추측하거나 지어내지 않는다.
   2. 금액·기한 등 숫자는 카드 데이터에 있는 값을 그대로 인용한다. 절대 새로 계산하지 않는다.
   3. 다른 보험, 다른 화면, 일반 금융 상식 질문은 카드 밖 질문으로 간주해 거절한다.
   4. 사용자가 선택한 언어로 답한다. 3문장 이내로 짧게.
   권장 파라미터: temperature 0.2, max_tokens 250.
   아래 mockCardAnswer()는 이 프롬프트의 few-shot 예시 4개를 키워드 매칭으로 재현한 "모크"입니다.
   실제 서버(server.py, /api/ai-assistant)가 연결되면 화면 하단 "AI 금융도우미"가 이 프롬프트와
   같은 취지의 시스템 프롬프트로 실제 LLM을 호출합니다(백엔드 프록시 필요, API 키 프론트 노출 금지). */
function mockCardAnswer(cardKind, question, ctx) {
  const s = INSURANCE_STR[ctx.lang];
  const q = (question || "").toLowerCase();

  const outOfScope = /환율|송금|다른\s*나라|exchange|remit|rate|汇率|汇款|tỷ giá|chuyển tiền/.test(q);
  if (outOfScope) return { text: s.qaRefuse, refuse: true };

  const isDeadline = /기한|언제|deadline|when|期限|申领期|hạn|khi nào/.test(q);
  if (isDeadline) {
    if (ctx.days === null) return { text: s.qaUnset, refuse: false };
    return { text: `${s.qaDeadline} (${s.ddayFmt(ctx.days)})`, refuse: false };
  }

  const isClaimant = /직접|본인|누가|myself|who claims|申领|自己|谁|tự|ai\b/.test(q);
  if (isClaimant) {
    if (cardKind === "c1") return { text: ctx.oneYearPlus ? s.c1NextOver1y : s.c1NextUnder1y, refuse: false };
    return { text: s.c2NextV, refuse: false };
  }

  return { text: s.qaRefuse, refuse: true };
}

/* Day4: 카드기반 Q&A 실LLM 연동 — 한지원님 server.py의 /api/ai-assistant에 연결.
   서버(Flask)가 index.html도 같이 서빙하므로 상대경로("/api/ai-assistant")로 호출하면
   CORS 문제 없이 바로 동작한다. 서버가 없는 곳(claude.ai 게시 페이지 등)에서는 fetch가
   실패하므로 자동으로 mockCardAnswer로 폴백한다 — 배포 여부와 상관없이 항상 안전하게 동작.
   PROXY_ENDPOINT를 null로 바꾸면 서버 연동을 끄고 강제로 모크만 쓸 수 있다(데모/디버깅용). */
const PROXY_ENDPOINT = "/api/ai-assistant";
async function askCardQA(cardKind, question, ctx) {
  if (!PROXY_ENDPOINT) return mockCardAnswer(cardKind, question, ctx);

  const s = INSURANCE_STR[ctx.lang] || INSURANCE_STR.ko;
  // 요청(2026-09-04): 카드 위젯이 카드 데이터만 답하고 환율 등 일반 질문은 거절하던 기존 좁은 범위를
  // 확장 — 이제 AI 금융도우미와 동일하게 지식베이스(은행·비자·송금·오늘환율) 전체를 같이 보내서
  // 카드 관련 질문뿐 아니라 화면 안의 다른 일반 질문에도 답할 수 있게 한다. 이 카드의 구체적인 사실은
  // 여전히 context.card로 같이 넘겨서, 청구기한 같은 카드 전용 질문은 그대로 정확하게 답한다.
  const baseContext = await buildAiContext();
  const context = {
    ...baseContext,
    scope: "general",
    card: {
      cardKind,
      cardTitle: cardKind === "c1" ? s.c1Title : s.c2Title,
      claimDeadlineDaysRemaining: ctx.days,
      claimDeadlineRule: cardKind === "c1" ? s.c1F3v : s.c2F3v,
      payoutTiming: cardKind === "c1" ? s.c1F2v : undefined,
      applicationWindow: cardKind === "c2" ? s.c2F2v : undefined,
      workedOneYearOrMore: ctx.oneYearPlus,
      whoClaims: cardKind === "c1" ? (ctx.oneYearPlus ? s.c1NextOver1y : s.c1NextUnder1y) : s.c2NextV,
      claimSteps: cardKind === "c1" ? s.c1Steps : s.c2Steps,
    },
  };

  try {
    const res = await fetch(PROXY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context }),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || errBody.error || `server status ${res.status}`);
    }
    const data = await res.json();
    if (!data || typeof data.answer !== "string" || !data.answer.trim()) throw new Error("empty answer");
    return { text: data.answer, refuse: false };
  } catch (err) {
    // 서버 호출이 실패하면 모크로 폴백하되, "지금 보고 있는 답은 실제 LLM이 아니라 참고용 모크"라는
    // 사실을 화면에도 남겨서(요청사항 1) 개발자와 사용자 모두 연동 여부를 바로 알 수 있게 한다.
    console.warn("[askCardQA] 서버 호출 실패, 모크로 폴백:", err);
    const fallback = mockCardAnswer(cardKind, question, ctx);
    const helperText = AI_HELPER_I18N[ctx.lang] || AI_HELPER_I18N.ko;
    return { text: `${fallback.text} ${helperText.offlineNotice}`, refuse: fallback.refuse };
  }
}

/* ---------- 화면 렌더링 ---------- */

/* 온보딩 공용 스키마 — 2026-09-02, 트랙1 답변 문서가 아직 없어 박소희님 확인 하에 트랙2가 확정.
   대시보드·보험관리(Step5·6)에서 쓰던 departureDate/accountOpened/oneYearPlus를 정식 필드로 승격했다.
   트랙1(이정헌)이 이후 이 필드명과 다른 이름으로 온보딩을 만들면, 여기 필드명에 맞춰 달라고 요청하거나
   이 세 필드만 트랙1 스키마 이름으로 리네임하면 된다. */
const state = {
  step: 1,
  language: "한국어",
  nationality: "베트남",
  birthDate: "1997-04-18",
  arrivalDate: "2024-03-02",
  visa: "E-9",
  expiryDate: "2027-02-28",
  readiness: { arc: true, phone: true, employment: true, address: false, salary: true, hasDomesticAccount: false },
  departureDate: "",       // 출국예정일 — 비어있으면 "아직 미정". 보험 D-day 계산의 기준값(입국일과 다름)
  accountOpened: false,    // 계좌개설여부 — boolean으로 확정(은행명까지는 MVP 범위 밖)
  oneYearPlus: true,       // 근무기간 1년 이상 여부 — 출국만기보험 청구권자(본인/사업주) 분기에 사용
  remittanceCountry: "베트남",
  remittanceAmount: 1000000,
  aiOpen: false,
  aiMessages: [],
  showHub: false,      // Step2 완료 후 보여주는 "다음 화면 선택" 허브 화면 표시 여부
  hubUnlocked: false,  // 허브를 한 번이라도 봤으면 true — 사이드바에서 3~7번을 자유롭게 클릭 가능해짐
};

/* ============================================================
   Step7 다국어
   ============================================================ */

const REMITTANCE_I18N = {
  ko: {
    stepTitle: "송금 비교", eyebrow: "해외송금 비교", titleSuffix: "으로 보내는 방법을 비교해요.",
    lead: "참고환율과 송금 채널별 수수료·추가비용·소요시간·수취방법을 한눈에 비교합니다.",
    countryLabel: "받는 국가", amountLabel: "보내는 금액", compareBase: "비교 기준", fromKorea: "대한민국에서", sendTo: "으로 송금",
    rateTitle: "오늘의 참고 기준환율", referenceConversion: "참고환율 환산 시", rateSource: "ExchangeRate-API",
    rateNotice1: "※ 민간 환율정보 제공업체의 참고 환율입니다.", rateNotice2: "※ 실제 은행·송금업체의 적용환율과 최종 수취액은 다를 수 있습니다.",
    loadingRate: "환율 정보를 불러오는 중입니다...", rateError: "환율 정보를 불러오지 못했습니다.", rateRetry: "잠시 후 다시 확인해 주세요.", enterAmount: "송금 금액을 입력해 주세요.",
    rateOffline: "이 미리보기 화면에서는 실시간 환율 API가 연결되어 있지 않아요.", rateOfflineHint: "실제 배포 환경(서버 연동)에서는 이 자리에 실시간 참고환율이 표시됩니다. 지금은 송금 전 각 은행·핀테크 앱에서 최종 환율을 확인해 주세요.",
    fintech: "핀테크 해외송금", bank: "은행 해외송금", fee: "송금 수수료", extraFee: "추가 수수료 / 전신료", transferTime: "예상 소요시간", receiveMethod: "수취방법",
    feeVariable: "송금액별 차등", feeDetails: "수수료 상세보기", source: "출처", checkedAt: "확인일", checkNeeded: "확인 필요",
    finalNotice: "환율·수수료·예상 수취액은 조회 시점과 실제 송금 조건에 따라 달라질 수 있습니다. 실제 송금 전 각 금융기관·송금업체에서 최종 조건을 다시 확인해 주세요.",
    noData: "현재 확인된 송금 데이터가 없습니다.",
    feeDetailKoNotice: "",
    countries: { "베트남": "베트남", "중국": "중국", "태국": "태국", "필리핀": "필리핀", "인도네시아": "인도네시아", "캄보디아": "캄보디아" },
  },
  en: {
    stepTitle: "Remittance Comparison", eyebrow: "Overseas Remittance Comparison", titleSuffix: " – compare ways to send money.",
    lead: "Compare reference exchange rates, transfer fees, additional charges, estimated time, and receiving methods.",
    countryLabel: "Destination", amountLabel: "Amount to Send", compareBase: "Comparison basis", fromKorea: "From South Korea", sendTo: "to",
    rateTitle: "Today's Reference Exchange Rate", referenceConversion: "Reference-rate conversion", rateSource: "ExchangeRate-API",
    rateNotice1: "※ This is a reference rate provided by a private exchange-rate data provider.", rateNotice2: "※ Actual rates and final received amounts may differ by bank or remittance provider.",
    loadingRate: "Loading exchange-rate information...", rateError: "Unable to load exchange-rate information.", rateRetry: "Please try again later.", enterAmount: "Please enter a transfer amount.",
    rateOffline: "The live exchange-rate API isn't connected in this preview.", rateOfflineHint: "In a deployed environment with the backend connected, a live reference rate would appear here. For now, please check the final rate in each bank/fintech app before transferring.",
    fintech: "Fintech Remittance", bank: "Bank Remittance", fee: "Transfer Fee", extraFee: "Additional / Telegraphic Fee", transferTime: "Estimated Time", receiveMethod: "Receiving Method",
    feeVariable: "Varies by transfer amount", feeDetails: "View fee details", source: "Source", checkedAt: "Checked", checkNeeded: "Check required",
    finalNotice: "Exchange rates, fees, and estimated received amounts may vary depending on when you check and the actual transfer conditions. Please confirm the final terms with each financial institution or remittance provider before transferring.",
    noData: "No remittance data is currently available.",
    feeDetailKoNotice: "The figures below are already reflected in the calculation above. They are shown in Korean exactly as published by the bank, to avoid any translation error in official fee amounts.",
    countries: { "베트남": "Vietnam", "중국": "China", "태국": "Thailand", "필리핀": "Philippines", "인도네시아": "Indonesia", "캄보디아": "Cambodia" },
  },
  zh: {
    stepTitle: "汇款比较", eyebrow: "海外汇款比较", titleSuffix: "汇款方式比较", lead: "比较参考汇率、汇款手续费、附加费用、预计到账时间和收款方式。",
    countryLabel: "收款国家", amountLabel: "汇款金额", compareBase: "比较条件", fromKorea: "从韩国", sendTo: "汇往",
    rateTitle: "今日参考汇率", referenceConversion: "按参考汇率换算", rateSource: "ExchangeRate-API",
    rateNotice1: "※ 此汇率为民间汇率数据提供商提供的参考汇率。", rateNotice2: "※ 银行或汇款机构的实际适用汇率及最终到账金额可能不同。",
    loadingRate: "正在加载汇率信息...", rateError: "无法加载汇率信息。", rateRetry: "请稍后再试。", enterAmount: "请输入汇款金额。",
    rateOffline: "此预览页面尚未连接实时汇率API。", rateOfflineHint: "在连接后端的正式部署环境中，这里会显示实时参考汇率。目前请在汇款前于各银行/金融科技App中确认最终汇率。",
    fintech: "金融科技海外汇款", bank: "银行海外汇款", fee: "汇款手续费", extraFee: "附加手续费 / 电报费", transferTime: "预计到账时间", receiveMethod: "收款方式",
    feeVariable: "按汇款金额分级", feeDetails: "查看手续费详情", source: "来源", checkedAt: "确认日期", checkNeeded: "需确认",
    finalNotice: "汇率、手续费及预计到账金额可能因查询时点及实际汇款条件而有所不同。实际汇款前请在各金融机构·汇款公司再次确认最终条件。",
    noData: "目前没有可确认的汇款数据。",
    feeDetailKoNotice: "以下内容已计入上方计算结果。为避免官方手续费金额出现翻译错误，按银行公示原文以韩文显示。",
    countries: { "베트남": "越南", "중국": "中国", "태국": "泰国", "필리핀": "菲律宾", "인도네시아": "印度尼西亚", "캄보디아": "柬埔寨" },
  },
  vi: {
    stepTitle: "So sánh chuyển tiền", eyebrow: "So sánh chuyển tiền quốc tế", titleSuffix: " – so sánh các cách chuyển tiền.",
    lead: "So sánh tỷ giá tham khảo, phí chuyển tiền, chi phí bổ sung, thời gian dự kiến và phương thức nhận tiền.",
    countryLabel: "Quốc gia nhận", amountLabel: "Số tiền gửi", compareBase: "Điều kiện so sánh", fromKorea: "Từ Hàn Quốc", sendTo: "đến",
    rateTitle: "Tỷ giá tham khảo hôm nay", referenceConversion: "Quy đổi theo tỷ giá tham khảo", rateSource: "ExchangeRate-API",
    rateNotice1: "※ Đây là tỷ giá tham khảo từ nhà cung cấp dữ liệu tỷ giá tư nhân.", rateNotice2: "※ Tỷ giá thực tế và số tiền nhận cuối cùng có thể khác tùy ngân hàng hoặc dịch vụ chuyển tiền.",
    loadingRate: "Đang tải thông tin tỷ giá...", rateError: "Không thể tải thông tin tỷ giá.", rateRetry: "Vui lòng thử lại sau.", enterAmount: "Vui lòng nhập số tiền cần chuyển.",
    rateOffline: "Bản xem trước này chưa kết nối API tỷ giá thời gian thực.", rateOfflineHint: "Ở môi trường triển khai thực tế có kết nối backend, tỷ giá tham khảo trực tiếp sẽ hiển thị ở đây. Hiện tại vui lòng kiểm tra tỷ giá cuối cùng trong ứng dụng ngân hàng/fintech trước khi chuyển.",
    fintech: "Chuyển tiền Fintech", bank: "Chuyển tiền ngân hàng", fee: "Phí chuyển tiền", extraFee: "Phí bổ sung / phí điện tín", transferTime: "Thời gian dự kiến", receiveMethod: "Phương thức nhận tiền",
    feeVariable: "Thay đổi theo số tiền gửi", feeDetails: "Xem chi tiết phí", source: "Nguồn", checkedAt: "Ngày kiểm tra", checkNeeded: "Cần xác nhận",
    finalNotice: "Tỷ giá, phí và số tiền dự kiến nhận được có thể thay đổi tùy theo thời điểm tra cứu và điều kiện chuyển tiền thực tế. Vui lòng xác nhận điều kiện cuối cùng tại từng tổ chức tài chính/đơn vị chuyển tiền trước khi chuyển.",
    noData: "Hiện chưa có dữ liệu chuyển tiền được xác nhận.",
    feeDetailKoNotice: "Nội dung bên dưới đã được tính vào kết quả phía trên. Nội dung được hiển thị bằng tiếng Hàn đúng theo nguyên văn ngân hàng công bố, để tránh sai sót khi dịch số tiền phí chính thức.",
    countries: { "베트남": "Việt Nam", "중국": "Trung Quốc", "태국": "Thái Lan", "필리핀": "Philippines", "인도네시아": "Indonesia", "캄보디아": "Campuchia" },
  },
};

function getRemittanceLang() {
  const map = { "한국어": "ko", English: "en", "中文": "zh", "Tiếng Việt": "vi", ko: "ko", en: "en", zh: "zh", vi: "vi" };
  return map[state.language] || "ko";
}

function getRemittanceText() {
  return REMITTANCE_I18N[getRemittanceLang()];
}

function formatKRW(value) {
  const lang = getRemittanceLang();
  const number = Number(String(value).replace(/,/g, "").replace(/원/g, "").trim());
  if (Number.isNaN(number)) return value;
  if (lang === "ko") return `${number.toLocaleString("ko-KR")}원`;
  if (lang === "en") return `KRW ${number.toLocaleString("en-US")}`;
  if (lang === "zh") return `${number.toLocaleString("zh-CN")}韩元`;
  if (lang === "vi") return `${number.toLocaleString("vi-VN")} KRW`;
  return `${number.toLocaleString()} KRW`;
}

/* 요청(2026-09-04): 송금비교 화면의 업체명(하나은행/센트비 등)과 "출처" 줄도 화면 언어에 맞춰 번역.
   은행(하나/신한/KB/우리)은 은행매트릭스(BANK_UI_I18N)와 완전히 같은 이름을 재사용해서 화면 간
   이름이 서로 다르게 보이지 않도록 한다. 핀테크 업체는 실제 해외에서 쓰이는 라틴 표기 브랜드명을 쓴다
   (센트비 → Sentbe, SBI 코스머니 → SBI Cosmoney, 한패스 → Hanpass — 언어가 바뀌어도 브랜드명 자체는
   국제적으로 동일하게 쓰이므로 en/zh/vi 공통). */
const REMIT_PROVIDER_BANK_KEY = { "하나은행": "hana", "신한은행": "shinhan", "KB국민은행": "kb", "우리은행": "woori" };
const REMIT_PROVIDER_I18N = {
  "센트비": { en: "Sentbe", zh: "Sentbe", vi: "Sentbe" },
  "SBI 코스머니": { en: "SBI Cosmoney", zh: "SBI Cosmoney", vi: "SBI Cosmoney" },
  "한패스": { en: "Hanpass", zh: "Hanpass", vi: "Hanpass" },
};

function localizedProviderName(provider) {
  const lang = getRemittanceLang();
  if (lang === "ko") return provider;
  const bankKey = REMIT_PROVIDER_BANK_KEY[provider];
  if (bankKey) {
    const name = BANK_UI_I18N[lang]?.[bankKey]?.name || BANK_UI_I18N.en?.[bankKey]?.name;
    if (name) return name;
  }
  const entry = REMIT_PROVIDER_I18N[provider];
  if (entry) return entry[lang] || entry.en || provider;
  return provider; // GME Remittance 등 원래도 영문 브랜드명인 경우 그대로
}

const REMIT_SOURCE_I18N = {
  "센트비 공식 홈페이지·고객센터": { en: "Sentbe official website · customer center", zh: "Sentbe官方网站·客服中心", vi: "Trang chính thức Sentbe · trung tâm CSKH" },
  "SBI 코스머니 공식 홈페이지": { en: "SBI Cosmoney official website", zh: "SBI Cosmoney官方网站", vi: "Trang chính thức SBI Cosmoney" },
  "GME Remittance 공식 홈페이지": { en: "GME Remittance official website", zh: "GME Remittance官方网站", vi: "Trang chính thức GME Remittance" },
  "한패스 공식 홈페이지 송금 계산기": { en: "Hanpass official website remittance calculator", zh: "Hanpass官方网站汇款计算器", vi: "Công cụ tính phí chuyển tiền trên trang chính thức Hanpass" },
  "전국은행연합회 외환수수료 비교공시": { en: "Korea Federation of Banks — FX fee comparison disclosure", zh: "韩国银行联合会外汇手续费比较公示", vi: "Hiệp hội Ngân hàng Hàn Quốc — công bố so sánh phí ngoại hối" },
};

function localizedProviderSource(source) {
  const lang = getRemittanceLang();
  if (lang === "ko" || !source) return source;
  const entry = REMIT_SOURCE_I18N[source];
  return entry ? (entry[lang] || entry.en || source) : source;
}

/* 요청(2026-09-04): "수수료 상세보기"의 원문 구간표는 금액 자체·통화 단위는 절대 바꾸지 않되(원문 숫자
   그대로), "이하/초과/미화/건당/면제" 같은 한국어 연결어만 선택한 언어로 바꿔서 다른 나라 통화 단위가
   섞여 있어도 그 언어로 읽을 수 있게 한다. 표에서 자주 나오는 패턴만 다루며, 나머지 자유서술 프로모션
   문구 등은 원문 그대로 남는다 — 실제 은행 공시 원문의 금액·조건을 임의로 재작성하지 않기 위함이다. */
function translateFeeDetailText(text, lang) {
  if (!text || lang === "ko") return text;
  const L = {
    en: { under: (a) => `${a} or less`, over: (a) => `over ${a}`, per: "per transaction", free: "Free", discount: "discount", usd: (n) => `USD ${n}`, krw: (n) => `KRW ${n}` },
    zh: { under: (a) => `${a}以下`, over: (a) => `超过${a}`, per: "每笔", free: "免除", discount: "优惠", usd: (n) => `USD ${n}`, krw: (n) => `${n}韩元` },
    vi: { under: (a) => `${a} trở xuống`, over: (a) => `trên ${a}`, per: "mỗi giao dịch", free: "Miễn phí", discount: "ưu đãi", usd: (n) => `USD ${n}`, krw: (n) => `${n} KRW` },
  }[lang];
  if (!L) return text;

  let out = text;

  // 미화 NNN불 (상당액) 이하/초과
  out = out.replace(/미화\s*([\d,]+)\s*불\s*(?:상당액)?\s*이하/g, (_, n) => L.under(L.usd(n)));
  out = out.replace(/미화\s*([\d,]+)\s*불\s*(?:상당액)?\s*초과/g, (_, n) => L.over(L.usd(n)));
  out = out.replace(/미화\s*([\d,]+)\s*불/g, (_, n) => L.usd(n));

  // 한글 복합 단위(천만/백만/십만/만/천/백/억)를 하나의 토큰으로 보고 실제 값으로 환산 — 긴 단위부터 매칭해야
  // "1천만"을 "1천"+"만"으로 잘못 쪼개지 않는다.
  const KNUM = "[\\d,]*(?:억|천만|백만|십만|만|천|백)[\\d,]*";

  // U$1천불이하 / U$5만불초과 처럼 한글 단위가 섞인 표기 — 실제 값으로 환산해 숫자로 표기
  out = out.replace(new RegExp(`U\\$\\s*(${KNUM})\\s*불\\s*이하`, "g"), (m, w) => {
    const num = parseKoreanAmount(w);
    return num !== null ? L.under(L.usd(num.toLocaleString())) : m;
  });
  out = out.replace(new RegExp(`U\\$\\s*(${KNUM})\\s*불\\s*초과`, "g"), (m, w) => {
    const num = parseKoreanAmount(w);
    return num !== null ? L.over(L.usd(num.toLocaleString())) : m;
  });

  // 순수 한글 숫자 + 원 + 이하/초과 (예: "1천만원 이하") — 실제 값으로 환산해 숫자로 표기
  out = out.replace(new RegExp(`(${KNUM})원\\s*이하`, "g"), (m, w) => {
    const num = parseKoreanAmount(w);
    return num !== null ? L.under(L.krw(num.toLocaleString())) : m;
  });
  out = out.replace(new RegExp(`(${KNUM})원\\s*초과`, "g"), (m, w) => {
    const num = parseKoreanAmount(w);
    return num !== null ? L.over(L.krw(num.toLocaleString())) : m;
  });

  // 남은 "NNN원" 금액 표기
  out = out.replace(/([\d,]+)\s*원/g, (_, n) => L.krw(n));

  // 연결어
  out = out.replace(/\(건당\)/g, `(${L.per})`);
  out = out.replace(/건당/g, L.per);
  out = out.replace(/면제/g, L.free);
  out = out.replace(/우대/g, L.discount);

  return out;
}

function localizeRemittanceValue(value) {
  const lang = getRemittanceLang();
  const t = getRemittanceText();
  if (value === null || value === undefined || String(value).trim() === "") return t.checkNeeded;

  const raw = String(value).trim();
  if (/^\d+$/.test(raw) || /^[\d,]+원$/.test(raw)) return formatKRW(raw);

  const perTransferMatch = raw.match(/^\(건당\)\s*([\d,]+)원$/);
  if (perTransferMatch) {
    const money = formatKRW(perTransferMatch[1]);
    if (lang === "ko") return `(건당) ${money}`;
    if (lang === "en") return `${money} per transfer`;
    if (lang === "zh") return `每笔 ${money}`;
    if (lang === "vi") return `${money} mỗi giao dịch`;
  }

  const common = {
    "확인 필요": { ko: "확인 필요", en: "Check required", zh: "需确认", vi: "Cần xác nhận" },
    "확인예정": { ko: "확인 예정", en: "To be confirmed", zh: "待确认", vi: "Sẽ xác nhận" },
    "앱에서 확인": { ko: "앱에서 확인", en: "Check in app", zh: "请在App中确认", vi: "Kiểm tra trong ứng dụng" },
    "로그인 후 확인": { ko: "로그인 후 확인", en: "Check after login", zh: "登录后确认", vi: "Kiểm tra sau khi đăng nhập" },
    "송금 단계에서 확인": { ko: "송금 단계에서 확인", en: "Check during transfer", zh: "汇款时确认", vi: "Kiểm tra khi chuyển tiền" },
    "계좌이체": { ko: "계좌이체", en: "Bank account transfer", zh: "银行账户转账", vi: "Chuyển khoản ngân hàng" },
    "해외 은행계좌": { ko: "해외 은행계좌", en: "Overseas bank account", zh: "海外银行账户", vi: "Tài khoản ngân hàng ở nước ngoài" },
    "현지 은행계좌": { ko: "현지 은행계좌", en: "Local bank account", zh: "当地银行账户", vi: "Tài khoản ngân hàng địa phương" },
    "국가별 상이 / 송금 단계에서 확인": { ko: "국가별 상이 / 송금 단계에서 확인", en: "Varies by country / check during transfer", zh: "因国家而异 / 汇款时确认", vi: "Khác nhau theo quốc gia / kiểm tra khi chuyển tiền" },
    "최소 1분 ~ 최대 1일": { ko: "최소 1분 ~ 최대 1일", en: "1 minute to 1 day", zh: "最短1分钟～最长1天", vi: "Từ 1 phút đến 1 ngày" },
    "약 15분": { ko: "약 15분", en: "About 15 minutes", zh: "约15分钟", vi: "Khoảng 15 phút" },
    "당일": { ko: "당일", en: "Same day", zh: "当天", vi: "Trong ngày" },
    "현지 환경에 따라": { ko: "현지 환경에 따라", en: "Depends on local conditions", zh: "视当地情况而定", vi: "Tùy điều kiện địa phương" },
    "확인필요": { ko: "확인 필요", en: "Check required", zh: "需确认", vi: "Cần xác nhận" },
    "약 1일": { ko: "약 1일", en: "About 1 day", zh: "约1天", vi: "Khoảng 1 ngày" },
    "해외송금 / 세부 수취방식 추가 확인 필요": { ko: "해외송금 / 세부 수취방식 추가 확인 필요", en: "Overseas remittance / check receiving details separately", zh: "海外汇款 / 收款方式需另行确认", vi: "Chuyển tiền quốc tế / cần xác nhận thêm phương thức nhận tiền" },
  };
  if (common[raw]) return common[raw][lang];

  if (raw === "익스프레스: 당일 / 스탠다드: +2~3 영업일") {
    return {
      ko: raw,
      en: "Express: same day / Standard: +2–3 business days",
      zh: "快速：当天 / 标准：+2～3个工作日",
      vi: "Express: trong ngày / Standard: +2–3 ngày làm việc",
    }[lang];
  }
  return raw;
}

/* 화면 UI 상태(펼침/Q&A 대화 내용)만 별도 보관 — 비즈니스 데이터가 아니므로 state와 분리 */
const uiState = {
  openPanels: {},
  qa: { c1: null, c2: null },
};

function currentLang() {
  const map = { "한국어": "ko", English: "en", "中文": "zh", "Tiếng Việt": "vi" };
  return map[state.language] || "ko"; // ไทย 등 미지원 언어는 한국어로 대체
}

/* ============================================================
   Step1~5 + 공통 UI 다국어
   ============================================================ */

const APP_I18N = {
  ko: {
    brandSubtitle: "외국인 금융정착 안내", progress: "진행률", demoNote: "은행 추천·서류 판정과 보험 D-day는 실데이터 기준 로직이지만, 화면 입력값은 데모 확인용입니다.", back: "← 이전", next: "다음 단계 →", restart: "처음부터 다시",
    steps: [["기본 정보", "거주 정보 확인"], ["체류 자격", "비자 유형 확인"], ["금융 준비", "보유 서류 확인"], ["은행 추천", "은행별 비교 결과"], ["내 준비 현황", "오늘 할 일 확인"], ["보험관리", "출국만기·귀국비용보험"], ["송금 비교", "국가별 송금 채널 비교"]],
    countries: { "베트남": "베트남", "중국": "중국", "태국": "태국", "필리핀": "필리핀", "인도네시아": "인도네시아", "캄보디아": "캄보디아", "우즈베키스탄": "우즈베키스탄", "기타": "기타" },
    basic: { eyebrow: "반가워요", title: "한국 생활에 필요한 금융 준비를<br />함께 확인해요.", lead: "입력한 체류 정보와 준비 서류를 바탕으로 은행별 준비 항목을 한눈에 보여드려요.", language: "안내 언어", nationality: "국적", birth: "생년월일", arrival: "한국 입국일", notice: "실제 서비스에서는 개인정보 수집 동의와 입력값 암호화가 필요합니다. 현재 화면은 저장되지 않는 데모예요." },
    visa: { eyebrow: "체류 자격 선택", title: "현재 비자를 선택해주세요.", lead: "비자 유형에 따라 은행에서 확인하는 재직·재학 서류가 달라질 수 있어요.", expiry: "체류기간 만료일", departure: "출국 예정일 (아직 모르면 비워두세요)", notice: "H-2는 2026-02-12부터 신규 발급이 중단되고 F-4로 통합되었습니다. 기존 H-2 보유자는 현재 체류기간이 끝날 때까지 그대로 체류할 수 있어요." },
    readiness: {
      eyebrow: "준비 상태 확인", title: "지금 준비된 항목을 알려주세요.", lead: "모르는 항목은 선택하지 않아도 괜찮아요. 결과 화면에서 추가로 필요한 서류를 안내해드려요.", subEyebrow: "계좌·보험 정보", subTitle: "대시보드·보험관리 화면에서 쓰는 정보예요.", subLead: "아직 모르면 비워둬도 괜찮아요. 나중에 같은 값을 바로 고칠 수 있어요.", departure: "출국 예정일 (아직 모르면 비워두세요)", accountTitle: "계좌를 이미 개설했어요", accountDesc: "은행을 정하고 개설을 마쳤다면 체크하세요.", oneYearTitle: "이 직장에서 1년 이상 근무했거나 근무할 예정이에요", oneYearDesc: "출국만기보험을 본인이 직접 청구할 수 있는지 여부에 영향을 줘요.",
      items: { arc: ["외국인등록증이 있어요", "앞·뒷면의 체류지와 체류기간을 확인할 수 있어요."], phone: ["본인 명의 국내 휴대폰이 있어요", "모바일 본인인증에 사용할 수 있는 번호예요."], employment: ["재직 또는 재학 증빙이 가능해요", "재직증명서, 근로계약서, 재학증명서 등이 있어요."], address: ["국내 주소 확인 서류가 있어요", "임대차계약서, 공공요금 고지서 등을 준비할 수 있어요."], salary: ["급여 수령용 계좌가 필요해요", "회사에서 급여를 받을 계좌를 새로 만들 예정이에요."], hasDomesticAccount: ["이미 다른 은행에 국내 계좌가 있어요", "일부 은행(KB국민은행 등)은 비대면 개설 시 본인 명의의 타행 입출금계좌가 있어야 해요."] },
    },
    results: { eyebrow: "은행 매트릭스 비교 결과", visaCompare: "비자 기준 은행 비교", stayUntil: "체류기간", until: "까지", readyCount: "준비 항목", countUnit: "개", badge: "실데이터 · 2026-09-01 기준 · 매트릭스 판정 로직 2026-09-03 자체 검수 반영", priority: "우선 제안", reference: "참고", related: "관련 상품 (참고용, 계좌개설 판정과 별개)", relatedEligible: "현재 비자로 이용 가능", relatedNotEligible: "현재 비자는 대상 아님", sources: "근거 자료 보기 (은행 공식 페이지·보도자료, Day2 리서치)", notice: "실제 은행 심사 기준과 필요 서류는 지점·상품·체류 상태에 따라 달라질 수 있습니다. 이 화면은 공식 공개자료 기준의 참고 결과이며 최종 확인은 은행 고객확인 절차를 따릅니다.", status: { branch: "영업점 확인 필요", extra: "추가서류 필요", nonFace: "비대면 어려울 수 있음", address: "주소자료 준비 권장", ok: "제안 가능" }, reason: { noArc: "외국인등록증(또는 거소증)과 여권 확인이 아직 안 됐어요.", noEmployment: "이용목적 증빙자료가 없으면 추가서류를 요청받을 수 있어요.", noPhone: "본인명의 국내 전화번호가 없으면 영업점 방문이 필요할 수 있어요.", noDomesticAccount: "이 은행은 비대면 개설 시 본인 명의의 타행 입출금계좌가 있어야 해요. 없으면 영업점 방문이 필요할 수 있어요.", noAddress: "주소 확인 자료를 준비하면 진행이 더 수월해요.", ok: "현재 준비 상태로 진행을 검토할 수 있어요." } },
    dashboardNotice: "계좌개설·출국예정일·근무기간 정보는 금융 준비 화면(Step3)에서 입력해요. 카드를 누르면 바로 수정할 수 있어요.", insuranceNotice: "금액·기한은 공식 자료 기준이며 실제 지급은 EPS·보험사 확인이 최종 기준입니다.",
    stayWarning: "⚠ 체류기간(만료일)보다 출국 예정일이 늦어요. 체류기간을 넘겨서 한국에 머무르면 불법체류가 될 수 있어요. 날짜를 다시 확인해 주세요.",
  },
  en: {
    brandSubtitle: "Financial settlement guide for foreign residents", progress: "Progress", demoNote: "Bank recommendations, document checks, and insurance D-days use rule-based data; entered values are for demo purposes only.", back: "← Back", next: "Next →", restart: "Start over",
    steps: [["Basic Information", "Residence information"], ["Visa Status", "Check visa type"], ["Financial Readiness", "Check documents"], ["Bank Comparison", "Results by bank"], ["My Progress", "Today's tasks"], ["Insurance", "Departure & return-cost insurance"], ["Remittance", "Compare remittance channels"]],
    countries: { "베트남": "Vietnam", "중국": "China", "태국": "Thailand", "필리핀": "Philippines", "인도네시아": "Indonesia", "캄보디아": "Cambodia", "우즈베키스탄": "Uzbekistan", "기타": "Other" },
    basic: { eyebrow: "Welcome", title: "Let's check the financial preparation<br />you need for life in Korea.", lead: "Based on your residence information and available documents, we show what you may need at each bank.", language: "Language", nationality: "Nationality", birth: "Date of birth", arrival: "Date of entry to Korea", notice: "A real service would require consent for personal-data collection and encryption. This demo does not save your entries." },
    visa: { eyebrow: "Visa Status", title: "Select your current visa.", lead: "Employment or enrollment documents required by banks may differ depending on visa type.", expiry: "Visa expiration date", departure: "Planned departure date (leave blank if unknown)", notice: "New H-2 issuance was suspended from 2026-02-12 and integrated into F-4. Existing H-2 holders may remain until their current stay period ends." },
    readiness: {
      eyebrow: "Readiness Check", title: "Tell us what you already have.", lead: "You can leave unfamiliar items unchecked. We will show additional documents on the results screen.", subEyebrow: "Account & Insurance Information", subTitle: "These details are used on the dashboard and insurance screens.", subLead: "If you do not know yet, you can leave them blank and update them later.", departure: "Planned departure date (leave blank if unknown)", accountTitle: "I have already opened a bank account", accountDesc: "Check this if you selected a bank and completed account opening.", oneYearTitle: "I have worked or expect to work here for at least one year", oneYearDesc: "This affects who can directly claim departure-guarantee insurance.",
      items: { arc: ["I have an Alien Registration Card", "My address and period of stay can be checked on the card."], phone: ["I have a Korean mobile number in my name", "It can be used for mobile identity verification."], employment: ["I can provide proof of employment or enrollment", "For example, an employment certificate, labor contract, or enrollment certificate."], address: ["I have proof of my Korean address", "For example, a lease agreement or utility bill."], salary: ["I need an account to receive salary", "I plan to open a new account for salary payments."], hasDomesticAccount: ["I already have an account at another bank in Korea", "Some banks (e.g. KB Kookmin) require a domestic account elsewhere in your name to open online."] },
    },
    results: { eyebrow: "Bank Matrix Results", visaCompare: "visa bank comparison", stayUntil: "Stay valid", until: "until", readyCount: "Prepared items", countUnit: "", badge: "Live researched data · as of 2026-09-01 · matrix logic self-reviewed 2026-09-03", priority: "Priority option", reference: "Note", related: "Related products (reference only, separate from account-opening eligibility)", relatedEligible: "Available for your current visa", relatedNotEligible: "Not available for your current visa", sources: "View sources (official bank pages and press materials)", notice: "Actual review standards and documents may vary by branch, product, and residence status. This screen is for reference; final confirmation follows each bank's verification process.", status: { branch: "Branch confirmation needed", extra: "Additional documents needed", nonFace: "Online opening may be difficult", address: "Address proof recommended", ok: "Potentially available" }, reason: { noArc: "Your ARC/residence card and passport have not yet been confirmed.", noEmployment: "The bank may request additional documents if you cannot prove the account purpose.", noPhone: "Without a Korean mobile number in your name, a branch visit may be required.", noDomesticAccount: "This bank requires a domestic account elsewhere in your name to open online. Without it, a branch visit may be required.", noAddress: "Preparing proof of address can make the process smoother.", ok: "You may proceed based on your current preparation status." } },
    dashboardNotice: "Account-opening status, planned departure date, and work period are entered on Financial Readiness (Step3). Tap a card to update them.", insuranceNotice: "Amounts and deadlines are based on official sources; final payment follows EPS and insurer confirmation.",
    stayWarning: "⚠ Your planned departure date is later than your visa expiration date. Staying in Korea past your visa period may count as illegal overstay. Please double-check the dates.",
  },
  zh: {
    brandSubtitle: "外国人金融安居指南", progress: "进度", demoNote: "银行推荐、材料判断和保险D-day采用规则数据，当前输入仅用于演示。", back: "← 上一步", next: "下一步 →", restart: "重新开始",
    steps: [["基本信息", "确认居住信息"], ["居留资格", "确认签证类型"], ["金融准备", "确认已有材料"], ["银行比较", "各银行比较结果"], ["我的进度", "查看今日任务"], ["保险管理", "出国满期·返乡费用保险"], ["汇款比较", "按国家比较汇款渠道"]],
    countries: { "베트남": "越南", "중국": "中国", "태국": "泰国", "필리핀": "菲律宾", "인도네시아": "印度尼西亚", "캄보디아": "柬埔寨", "우즈베키스탄": "乌兹别克斯坦", "기타": "其他" },
    basic: { eyebrow: "欢迎", title: "一起确认在韩国生活所需的<br />金融准备吧。", lead: "根据您的居留信息和已准备材料，集中显示各银行可能需要的项目。", language: "界面语言", nationality: "国籍", birth: "出生日期", arrival: "入境韩国日期", notice: "正式服务需要个人信息收集同意和加密。当前演示不会保存输入内容。" },
    visa: { eyebrow: "选择居留资格", title: "请选择目前的签证。", lead: "不同签证类型可能需要不同的在职或在学证明材料。", expiry: "居留期限到期日", departure: "预计离境日期（如尚不清楚可留空）", notice: "自2026-02-12起停止新发H-2并整合至F-4。现有H-2持有人可在当前居留期限结束前继续居留。" },
    readiness: {
      eyebrow: "准备情况确认", title: "请告诉我们您目前已经准备好的项目。", lead: "不确定的项目可以不勾选，结果页面会提示可能需要补充的材料。", subEyebrow: "账户·保险信息", subTitle: "这些信息会用于仪表板和保险管理页面。", subLead: "如果暂时不知道，可以留空，之后也可以修改。", departure: "预计出境日期（不确定可留空）", accountTitle: "我已经开立银行账户", accountDesc: "如果已经选择银行并完成开户，请勾选。", oneYearTitle: "我已在或预计在当前单位工作满1年", oneYearDesc: "这会影响出国满期保险是否可由本人直接申请。",
      items: { arc: ["我有外国人登录证", "可确认卡片上的居住地址和居留期限。"], phone: ["我有本人名义的韩国手机号码", "可用于手机本人认证。"], employment: ["我可以提供在职或在学证明", "例如在职证明、劳动合同、在学证明等。"], address: ["我有韩国地址证明材料", "例如租赁合同、水电费账单等。"], salary: ["我需要工资入账账户", "计划新开一个用于领取工资的账户。"], hasDomesticAccount: ["我已经在其他银行开有韩国国内账户", "部分银行（如KB国民银行等）线上开户时需要本人名义的其他银行账户。"] },
    },
    results: { eyebrow: "银行矩阵比较结果", visaCompare: "签证银行比较", stayUntil: "居留期限", until: "至", readyCount: "已准备项目", countUnit: "项", badge: "实地整理数据 · 截至2026-09-01 · 矩阵判定逻辑已于2026-09-03自查", priority: "优先建议", reference: "参考", related: "相关产品（仅供参考，与开户判定无关）", relatedEligible: "当前签证可使用", relatedNotEligible: "当前签证不适用", sources: "查看依据资料（银行官网·新闻资料）", notice: "实际银行审核标准和所需材料可能因网点、产品和居留状态而不同。本页面仅供参考，最终以各银行客户确认流程为准。", status: { branch: "需到网点确认", extra: "需要补充材料", nonFace: "线上开户可能较困难", address: "建议准备地址证明", ok: "可考虑申请" }, reason: { noArc: "尚未确认外国人登录证（或居所证）及护照。", noEmployment: "如果无法证明账户用途，银行可能要求补充材料。", noPhone: "没有本人名义的韩国手机号时，可能需要前往网点。", noDomesticAccount: "该银行线上开户需要本人名义的其他银行账户，没有的话可能需要前往网点。", noAddress: "准备地址证明材料可让流程更顺利。", ok: "根据目前准备情况，可以考虑继续办理。" } },
    dashboardNotice: "开户状态、预计出境日期和工作期限可在金融准备（Step3）中填写。点击卡片即可修改。", insuranceNotice: "金额和期限依据官方资料，最终支付以EPS和保险公司确认为准。",
    stayWarning: "⚠ 预计出境日期晚于居留期限到期日。超过居留期限继续停留在韩国可能构成非法滞留，请重新确认日期。",
  },
  vi: {
    brandSubtitle: "Hướng dẫn ổn định tài chính cho người nước ngoài", progress: "Tiến độ", demoNote: "Gợi ý ngân hàng, kiểm tra giấy tờ và D-day bảo hiểm dùng logic dữ liệu; thông tin nhập chỉ dành cho bản demo.", back: "← Trước", next: "Tiếp theo →", restart: "Bắt đầu lại",
    steps: [["Thông tin cơ bản", "Kiểm tra thông tin cư trú"], ["Tư cách lưu trú", "Kiểm tra loại visa"], ["Chuẩn bị tài chính", "Kiểm tra giấy tờ"], ["So sánh ngân hàng", "Kết quả theo từng ngân hàng"], ["Tiến độ của tôi", "Việc cần làm hôm nay"], ["Quản lý bảo hiểm", "Bảo hiểm mãn hạn·chi phí về nước"], ["So sánh chuyển tiền", "So sánh kênh theo quốc gia"]],
    countries: { "베트남": "Việt Nam", "중국": "Trung Quốc", "태국": "Thái Lan", "필리핀": "Philippines", "인도네시아": "Indonesia", "캄보디아": "Campuchia", "우즈베키스탄": "Uzbekistan", "기타": "Khác" },
    basic: { eyebrow: "Xin chào", title: "Hãy cùng kiểm tra những chuẩn bị tài chính<br />cần thiết cho cuộc sống tại Hàn Quốc.", lead: "Dựa trên thông tin cư trú và giấy tờ bạn có, hệ thống hiển thị các mục cần chuẩn bị theo từng ngân hàng.", language: "Ngôn ngữ hướng dẫn", nationality: "Quốc tịch", birth: "Ngày sinh", arrival: "Ngày nhập cảnh Hàn Quốc", notice: "Dịch vụ thực tế cần đồng ý thu thập dữ liệu cá nhân và mã hóa. Bản demo hiện tại không lưu dữ liệu nhập." },
    visa: { eyebrow: "Chọn tư cách lưu trú", title: "Hãy chọn visa hiện tại của bạn.", lead: "Giấy tờ chứng minh việc làm hoặc học tập có thể khác theo loại visa.", expiry: "Ngày hết hạn lưu trú", departure: "Ngày dự kiến xuất cảnh (bỏ trống nếu chưa biết)", notice: "Từ 2026-02-12, H-2 ngừng cấp mới và được tích hợp vào F-4. Người đang giữ H-2 có thể tiếp tục cư trú đến hết thời hạn hiện tại." },
    readiness: {
      eyebrow: "Kiểm tra mức độ sẵn sàng", title: "Hãy cho biết những gì bạn đã chuẩn bị.", lead: "Bạn có thể bỏ qua mục chưa rõ. Màn hình kết quả sẽ hướng dẫn giấy tờ cần bổ sung.", subEyebrow: "Thông tin tài khoản·bảo hiểm", subTitle: "Thông tin này được dùng ở bảng điều khiển và màn hình bảo hiểm.", subLead: "Nếu chưa biết, bạn có thể để trống và cập nhật sau.", departure: "Ngày dự kiến xuất cảnh (để trống nếu chưa biết)", accountTitle: "Tôi đã mở tài khoản ngân hàng", accountDesc: "Đánh dấu nếu bạn đã chọn ngân hàng và hoàn tất mở tài khoản.", oneYearTitle: "Tôi đã hoặc dự kiến làm việc tại đây từ 1 năm trở lên", oneYearDesc: "Thông tin này ảnh hưởng đến việc yêu cầu bảo hiểm mãn hạn xuất cảnh.",
      items: { arc: ["Tôi có thẻ đăng ký người nước ngoài", "Có thể kiểm tra địa chỉ và thời hạn cư trú trên thẻ."], phone: ["Tôi có số điện thoại Hàn Quốc đứng tên mình", "Có thể dùng để xác minh danh tính."], employment: ["Tôi có thể chứng minh việc làm hoặc việc học", "Ví dụ: giấy xác nhận làm việc, hợp đồng lao động hoặc giấy xác nhận đang học."], address: ["Tôi có giấy tờ chứng minh địa chỉ tại Hàn Quốc", "Ví dụ: hợp đồng thuê nhà hoặc hóa đơn tiện ích."], salary: ["Tôi cần tài khoản để nhận lương", "Tôi dự định mở tài khoản mới để nhận lương."], hasDomesticAccount: ["Tôi đã có tài khoản ở một ngân hàng khác tại Hàn Quốc", "Một số ngân hàng (như KB Kookmin) yêu cầu có tài khoản ngân hàng khác đứng tên bạn để mở trực tuyến."] },
    },
    results: { eyebrow: "Kết quả so sánh ma trận ngân hàng", visaCompare: "so sánh ngân hàng theo visa", stayUntil: "Thời hạn lưu trú", until: "đến", readyCount: "Mục đã chuẩn bị", countUnit: "mục", badge: "Dữ liệu đã nghiên cứu · đến 2026-09-01 · logic ma trận đã tự rà soát 2026-09-03", priority: "Ưu tiên gợi ý", reference: "Lưu ý", related: "Sản phẩm liên quan (chỉ tham khảo, tách biệt với xét mở tài khoản)", relatedEligible: "Có thể dùng với visa hiện tại", relatedNotEligible: "Visa hiện tại không thuộc đối tượng", sources: "Xem nguồn (trang chính thức và tài liệu ngân hàng)", notice: "Tiêu chuẩn xét duyệt và giấy tờ có thể khác theo chi nhánh, sản phẩm và tình trạng cư trú. Màn hình này chỉ mang tính tham khảo; xác nhận cuối cùng theo quy trình của ngân hàng.", status: { branch: "Cần xác nhận tại chi nhánh", extra: "Cần bổ sung giấy tờ", nonFace: "Có thể khó mở trực tuyến", address: "Nên chuẩn bị giấy tờ địa chỉ", ok: "Có thể xem xét" }, reason: { noArc: "Chưa xác nhận thẻ cư trú và hộ chiếu.", noEmployment: "Ngân hàng có thể yêu cầu giấy tờ bổ sung nếu không chứng minh được mục đích tài khoản.", noPhone: "Nếu không có số điện thoại Hàn Quốc đứng tên mình, có thể phải đến chi nhánh.", noDomesticAccount: "Ngân hàng này yêu cầu có tài khoản ngân hàng khác đứng tên bạn để mở trực tuyến. Nếu không có, có thể phải đến chi nhánh.", noAddress: "Chuẩn bị giấy tờ địa chỉ sẽ giúp quy trình thuận lợi hơn.", ok: "Có thể tiếp tục theo tình trạng chuẩn bị hiện tại." } },
    dashboardNotice: "Trạng thái mở tài khoản, ngày xuất cảnh và thời gian làm việc được nhập ở Chuẩn bị tài chính (Step3). Nhấn thẻ để chỉnh sửa.", insuranceNotice: "Số tiền và thời hạn dựa trên nguồn chính thức; việc chi trả cuối cùng theo xác nhận của EPS và công ty bảo hiểm.",
    stayWarning: "⚠ Ngày dự kiến xuất cảnh trễ hơn ngày hết hạn lưu trú. Ở lại Hàn Quốc quá thời hạn lưu trú có thể bị coi là cư trú bất hợp pháp. Vui lòng kiểm tra lại ngày tháng.",
  },
};

function appText() {
  return APP_I18N[currentLang()] || APP_I18N.ko;
}

function localizedCountry(name) {
  return appText().countries[name] || name;
}

/* ============================================================
   AI 금융도우미 다국어
   ============================================================ */

const AI_HELPER_I18N = {
  ko: {
    button: "✦ AI 금융도우미", title: "AI 금융도우미", subtitle: "현재 화면의 정보를 바탕으로 안내해드려요.", placeholder: "궁금한 내용을 입력하세요.", send: "보내기",
    greeting: "궁금한 금융 정보를 물어보세요. 현재 화면과 등록된 데이터 범위 안에서 안내해드릴게요.",
    insuranceSuggestions: ["출국만기보험은 언제 받을 수 있어?", "내가 직접 청구할 수 있어?"],
    remittanceSuggestions: ["베트남으로 70만원 보내려면 어디가 좋아?", "수수료가 가장 적은 곳은 어디야?"],
    disclaimer: "AI 답변은 참고용입니다. 화면에 없는 수수료·보험 조건은 임의로 생성하지 않습니다.", error: "답변을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
    offlineNotice: "(실시간 서버 연동 없이, 화면 데이터로만 답한 참고용 답변이에요)",
    loading: "답변을 준비하는 중이에요. 잠시만 기다려주세요...",
  },
  en: {
    button: "✦ AI Financial Helper", title: "AI Financial Helper", subtitle: "Ask about the information shown on the current screen.", placeholder: "Ask a financial question.", send: "Send",
    greeting: "Ask me about your financial setup. I will answer only from the information and data available in this service.",
    insuranceSuggestions: ["When can I receive departure guarantee insurance?", "Can I claim it myself?"],
    remittanceSuggestions: ["What's a good way to send KRW 700,000 to Vietnam?", "Which option has the lowest fee?"],
    disclaimer: "AI answers are for reference. Fees or insurance conditions not in the service data are not invented.", error: "Unable to load an answer. Please try again later.",
    offlineNotice: "(Answered from on-screen data only, without a live backend connection)",
    loading: "Preparing an answer, please wait a moment...",
  },
  zh: {
    button: "✦ AI金融助手", title: "AI金融助手", subtitle: "可根据当前页面的信息为您提供说明。", placeholder: "请输入您想了解的金融问题。", send: "发送",
    greeting: "欢迎咨询金融相关问题。我只会根据本服务中已有的信息和数据回答。",
    insuranceSuggestions: ["出国满期保险什么时候可以领取？", "我可以自己申请吗？"],
    remittanceSuggestions: ["向越南汇70万韩元的话哪种方式比较好？", "哪种方式手续费最低？"],
    disclaimer: "AI回答仅供参考，不会编造服务数据中不存在的手续费或保险条件。", error: "暂时无法加载回答，请稍后再试。",
    offlineNotice: "（未连接实时后端，仅根据当前页面数据给出的参考回答）",
    loading: "正在准备回答，请稍候...",
  },
  vi: {
    button: "✦ Trợ lý tài chính AI", title: "Trợ lý tài chính AI", subtitle: "Hỏi về thông tin trên màn hình hiện tại.", placeholder: "Nhập câu hỏi tài chính của bạn.", send: "Gửi",
    greeting: "Bạn có thể hỏi về việc chuẩn bị tài chính. Tôi chỉ trả lời dựa trên thông tin và dữ liệu có trong dịch vụ.",
    insuranceSuggestions: ["Khi nào tôi có thể nhận bảo hiểm mãn hạn xuất cảnh?", "Tôi có thể tự yêu cầu chi trả không?"],
    remittanceSuggestions: ["Gửi 700.000 KRW về Việt Nam thì cách nào tốt?", "Kênh nào có phí thấp nhất?"],
    disclaimer: "Câu trả lời AI chỉ mang tính tham khảo và không tự tạo phí hoặc điều kiện bảo hiểm không có trong dữ liệu.", error: "Không thể tải câu trả lời. Vui lòng thử lại sau.",
    offlineNotice: "(Trả lời tham khảo từ dữ liệu trên màn hình, chưa kết nối backend thời gian thực)",
    loading: "Đang chuẩn bị câu trả lời, vui lòng đợi trong giây lát...",
  },
};

function aiHelperText() {
  return AI_HELPER_I18N[currentLang()] || AI_HELPER_I18N.ko;
}

function getAiSuggestedQuestions() {
  const t = aiHelperText();
  if (state.step === 6) return t.insuranceSuggestions;
  if (state.step === 7) return t.remittanceSuggestions;
  return [];
}

/* ============================================================
   요청사항 2·3: AI가 화면에 없는 것도 "우리 데이터로 이미 학습된" 것처럼
   답할 수 있도록, 매 요청마다 은행매트릭스·비자서류규정·보험규정·송금수수료표·
   오늘의 환율을 knowledgeBase로 함께 보낸다. (서버 프롬프트가 이 데이터 밖은
   답하지 말라고 강제하므로 환각 없이도 "학습된 것처럼" 자연스럽게 답할 수 있다.)
   ============================================================ */

function buildKnowledgeBaseBanks() {
  // AI(Gemini)에게 보내는 지식베이스도 화면과 똑같이 현재 언어로 맞춰서 보낸다.
  // 그래야 영어/중국어/베트남어 모드에서도 답변에 한국어 은행명·상품명이 섞여 나오지 않는다.
  return banks.map((bank) => {
    const localized = localizedBank(bank);
    return {
      name: localized.name, product: localized.product, benefit: localized.benefit, idDocs: localized.idDocs,
      channel: localized.channel, langSupport: localized.langSupport, nonFace: Boolean(bank.nonFace),
      requiresDomesticAccount: Boolean(bank.requiresDomesticAccount), note: localized.note || null,
      priorityVisas: bank.priorityVisas,
      related: bank.related ? { name: localizedRelatedName(bank.related.name), fee: bank.related.fee || null, note: bank.related.note, eligibleVisas: bank.related.eligibleVisas || null } : null,
    };
  });
}

function buildKnowledgeBaseRemittance() {
  const allData = window.REMITTANCE_DATA || [];
  const mainBanks = ["하나은행", "신한은행", "KB국민은행", "우리은행"];
  const allowed = allData.filter((item) => {
    const isBank = String(item.type || "").includes("은행");
    return !isBank || mainBanks.includes(item.provider);
  });
  const seen = new Set();
  return allowed.filter((item) => {
    const key = `${item.country}__${item.provider}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((item) => ({
    provider: item.provider, type: item.type, country: item.country, fee: item.fee,
    extra_fee: item.extra_fee, transfer_time: item.transfer_time, receive_method: item.receive_method,
    promotion: item.promotion || null, checked_at: item.checked_at,
  }));
}

function buildKnowledgeBaseInsurance() {
  // 사용자별 날짜 계산은 CONTEXT.insurance에서 별도 제공하므로, 여기는 언어와 무관한 정적 사실만 담는다.
  const s = INSURANCE_STR.ko;
  return {
    departureInsurance: { payoutTiming: s.c1F2v, claimDeadlineRule: s.c1F3v, accrualBasis: "월급여의 8.3% (사업주 납부)" },
    returnCostInsurance: { applicationWindow: s.c2F2v, claimDeadlineRule: s.c2F3v },
    claimDeadlineYears: 3,
  };
}

/* 오늘의 환율표 캐시 — 질문마다 새로 호출하지 않고 5분간 재사용한다. */
let cachedExchangeRates = null;
let exchangeRatesFetchPromise = null;

async function ensureAllExchangeRates() {
  const CACHE_MS = 5 * 60 * 1000;
  if (cachedExchangeRates && Date.now() - cachedExchangeRates.fetchedAt < CACHE_MS) {
    return cachedExchangeRates;
  }
  if (!exchangeRatesFetchPromise) {
    exchangeRatesFetchPromise = fetch("/api/exchange-all")
      .then((res) => { if (!res.ok) throw new Error(`status ${res.status}`); return res.json(); })
      .then((data) => {
        cachedExchangeRates = { rates: data.rates || {}, updatedAt: data.updated_at || null, fetchedAt: Date.now() };
        return cachedExchangeRates;
      })
      .catch((err) => { console.warn("[exchangeRates] 조회 실패:", err); return null; })
      .finally(() => { exchangeRatesFetchPromise = null; });
  }
  return exchangeRatesFetchPromise;
}

async function buildKnowledgeBase() {
  const exchangeRates = await ensureAllExchangeRates();
  return {
    banks: buildKnowledgeBaseBanks(),
    visaDocRules,
    insurance: buildKnowledgeBaseInsurance(),
    remittance: buildKnowledgeBaseRemittance(),
    exchangeRates: exchangeRates ? { base: "KRW", rates: exchangeRates.rates, asOf: exchangeRates.updatedAt } : null,
  };
}

async function buildAiContext() {
  const baseContext = {
    step: state.step,
    language: currentLang(),
    scope: "general",
    knowledgeBase: await buildKnowledgeBase(),
    user: {
      nationality: state.nationality || null,
      visa: state.visa || null,
      expiryDate: state.expiryDate || null,
      departureDate: state.departureDate || null,
      accountOpened: Boolean(state.accountOpened),
      oneYearPlus: Boolean(state.oneYearPlus),
      readiness: state.readiness || {},
    },
  };

  if (state.step === 6) {
    return {
      ...baseContext,
      topic: "insurance",
      insurance: { departureDate: state.departureDate || null, oneYearPlus: Boolean(state.oneYearPlus), visa: state.visa || null },
    };
  }

  if (state.step === 7) {
    const allData = window.REMITTANCE_DATA || [];
    const selectedCountry = state.remittanceCountry;
    const mainBanks = ["하나은행", "신한은행", "KB국민은행", "우리은행"];
    const filtered = allData.filter((item) => {
      if (item.country !== selectedCountry && item.country !== "공통") return false;
      const isBank = String(item.type || "").includes("은행");
      return !isBank || mainBanks.includes(item.provider);
    });
    const seen = new Set();
    const options = filtered.filter((item) => {
      if (seen.has(item.provider)) return false;
      seen.add(item.provider);
      return true;
    }).map((item) => ({
      provider: item.provider, type: item.type, country: item.country, fee: item.fee,
      extra_fee: item.extra_fee, transfer_time: item.transfer_time, receive_method: item.receive_method,
      promotion: item.promotion, source: item.source, checked_at: item.checked_at,
    }));
    return {
      ...baseContext,
      topic: "remittance",
      remittance: { country: selectedCountry, amountKRW: Number(state.remittanceAmount || 0), options },
    };
  }

  return { ...baseContext, topic: "general" };
}

/* 백엔드(server.py, /api/ai-assistant)가 연결되지 않은 환경(예: 정적 미리보기)을 위한 로컬 폴백.
   실제 서버 프롬프트와 같은 원칙(화면 데이터에만 근거, 모르면 모른다고 답, 숫자를 새로 만들지 않음)을
   키워드 매칭으로 재현한다. 절대 서버 호출 실패를 사용자에게 원문 에러로 보여주지 않기 위한 안전장치. */
/* 요청사항 3 (오프라인/모크 대비책): 서버 쪽 가드와 동일한 원칙 — 미래 환율은 절대 만들어내지 않는다. */
const FUTURE_RATE_WORDS = ["내일", "명일", "모레", "다음주", "다음 주", "다음달", "다음 달", "향후", "미래", "tomorrow", "next week", "next month", "明天", "明日", "下周", "下个月", "未来", "ngày mai", "tuần sau", "tháng sau", "tương lai"];
const RATE_WORDS_CLIENT = ["환율", "exchange rate", "rate", "汇率", "tỷ giá"];
const FUTURE_RATE_REFUSAL = {
  ko: "환율은 매일 바뀌어서 미래 환율은 미리 알려드릴 수 없어요. 내일 환율은 내일 다시 물어봐 주세요!",
  en: "Exchange rates change every day, so I can't tell you a future rate in advance. Please ask again on that day!",
  zh: "汇率每天都会变化，所以无法提前告诉您未来的汇率。请到那天再问我吧！",
  vi: "Tỷ giá thay đổi mỗi ngày nên mình không thể cho bạn biết trước tỷ giá trong tương lai. Hãy hỏi lại đúng vào ngày đó nhé!",
};
function isFutureRateQuestion(question) {
  const q = (question || "").toLowerCase();
  return FUTURE_RATE_WORDS.some((w) => q.includes(w.toLowerCase())) && RATE_WORDS_CLIENT.some((w) => q.includes(w.toLowerCase()));
}

function mockAiAnswer(question, context) {
  const t = aiHelperText();
  const q = (question || "").toLowerCase();

  if (isFutureRateQuestion(question)) {
    return FUTURE_RATE_REFUSAL[context.language] || FUTURE_RATE_REFUSAL.ko;
  }

  if (context.topic === "insurance") {
    const s = INSURANCE_STR[context.language] || INSURANCE_STR.ko;
    const isDeadline = /기한|언제|deadline|when|期限|申领期|hạn|khi nào/.test(q);
    const days = daysUntilDeadline(context.insurance.departureDate);
    if (isDeadline) {
      if (days === null) return `${s.qaUnset} ${t.offlineNotice}`;
      return `${s.qaDeadline} (${s.ddayFmt(days)}) ${t.offlineNotice}`;
    }
    const isClaimant = /직접|본인|누가|myself|who claims|申领|自己|谁|tự|ai\b/.test(q);
    if (isClaimant) {
      const text = context.insurance.oneYearPlus ? s.c1NextOver1y : s.c1NextUnder1y;
      return `${text} ${t.offlineNotice}`;
    }
    return `${s.qaRefuse} ${t.offlineNotice}`;
  }

  if (context.topic === "remittance") {
    const options = (context.remittance && context.remittance.options) || [];
    const isCheapest = /가장\s*적|저렴|최저|cheap|lowest|最低|便宜|rẻ nhất|thấp nhất/.test(q);
    const confirmedFee = (item) => {
      const raw = String(item.fee || "").trim();
      return /^\d+$/.test(raw) ? Number(raw) : null;
    };
    if (isCheapest) {
      const withFee = options.map((o) => ({ o, fee: confirmedFee(o) })).filter((x) => x.fee !== null);
      if (!withFee.length) {
        return `현재 화면 데이터로는 확정 금액이 있는 곳이 많지 않아 "가장 저렴한 곳"을 단정하기 어려워요. 목록의 각 업체 앱에서 정확한 수수료를 확인해 주세요. ${t.offlineNotice}`;
      }
      withFee.sort((a, b) => a.fee - b.fee);
      const best = withFee[0];
      return `화면에 확정 수수료가 표시된 항목 중에서는 ${best.o.provider}의 수수료(${best.fee.toLocaleString()}원)가 가장 낮아요. 다만 환율·추가비용까지 더한 최종 수취액은 다를 수 있으니 송금 전 각 사 앱에서 다시 확인해 주세요. ${t.offlineNotice}`;
    }
    return `이 화면에 나온 송금 채널 정보 안에서만 안내해 드릴 수 있어요. 구체적인 업체명이나 "가장 저렴한 곳" 같은 질문을 해보시면 화면 데이터를 바탕으로 답해드릴게요. ${t.offlineNotice}`;
  }

  /* 요청사항 2 (오프라인 대비): 어느 화면에 있든 계좌개설·환율처럼 자주 묻는 질문은
     서버 연동 없이도 우리 데이터(은행매트릭스·캐시된 환율)로 최소한의 답을 준다. */
  const isAccountQuestion = /계좌\s*개설|어떻게\s*해|account|open.*bank|开户|mở tài khoản/.test(q);
  if (isAccountQuestion) {
    const lang = context.language;
    const bankList = banks.map((bank) => localizedBank(bank));
    const summary = bankList.map((b) => `${b.name}(${b.product}) — ${b.idDocs}`).join(" / ");
    const prefix = {
      ko: "은행마다 필요한 서류·조건이 달라요. 은행별로 정리하면:",
      en: "Requirements differ by bank. Here's a per-bank summary:",
      zh: "各银行所需材料和条件不同，各银行汇总如下：",
      vi: "Yêu cầu khác nhau tùy ngân hàng. Tóm tắt theo từng ngân hàng:",
    }[lang] || "은행마다 필요한 서류·조건이 달라요:";
    return `${prefix} ${summary} ${t.offlineNotice}`;
  }

  const isRateQuestion = RATE_WORDS_CLIENT.some((w) => q.includes(w.toLowerCase()));
  if (isRateQuestion) {
    const rates = cachedExchangeRates?.rates;
    if (rates) {
      const lines = Object.entries(rates).filter(([code]) => code !== "USD").map(([code, rate]) => `1 KRW ≈ ${Number(rate).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${code}`).join(", ");
      return `${lines} (${cachedExchangeRates.updatedAt || ""}) ${t.offlineNotice}`;
    }
    return `지금은 환율 정보를 불러오지 못했어요. 송금 비교 화면에서 국가를 선택하면 참고환율을 볼 수 있어요. ${t.offlineNotice}`;
  }

  return `${t.error} ${t.offlineNotice}`;
}

function escapeAiHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function aiMessagesHtml() {
  const messages = state.aiMessages.length ? state.aiMessages : [{ role: "assistant", text: aiHelperText().greeting }];
  return messages.map((message) => `<div class="ai-message ${message.role}${message.loading ? " loading" : ""}">${escapeAiHtml(message.text)}</div>`).join("");
}

function renderAiHelper() {
  const root = document.querySelector("#ai-assistant-root");
  if (!root) return;
  const t = aiHelperText();
  const suggestions = getAiSuggestedQuestions();

  root.innerHTML = `
    <div class="ai-helper ${state.aiOpen ? "open" : ""}">
      <div class="ai-helper-panel">
        <div class="ai-helper-header">
          <div class="ai-helper-title-wrap"><div class="ai-helper-icon">✦</div><div><p class="ai-helper-title">${t.title}</p><p class="ai-helper-subtitle">${t.subtitle}</p></div></div>
          <button type="button" class="ai-helper-close" id="ai-helper-close" aria-label="Close">×</button>
        </div>
        <div class="ai-helper-messages" id="ai-helper-messages">${aiMessagesHtml()}</div>
        <div class="ai-helper-bottom">
          <div class="ai-suggestions">${suggestions.map((question) => `<button type="button" class="ai-suggestion-chip" data-ai-question="${escapeAiHtml(question)}">${escapeAiHtml(question)}</button>`).join("")}</div>
          <div class="ai-helper-input-row">
            <textarea id="ai-helper-input" class="ai-helper-input" rows="1" placeholder="${t.placeholder}"></textarea>
            <button type="button" id="ai-helper-send" class="ai-helper-send">${t.send}</button>
          </div>
          <p class="ai-helper-disclaimer">${t.disclaimer}</p>
        </div>
      </div>
      <button type="button" id="ai-helper-toggle" class="ai-helper-button">${t.button}</button>
    </div>`;

  bindAiHelperEvents();
  const messageBox = document.querySelector("#ai-helper-messages");
  if (messageBox) messageBox.scrollTop = messageBox.scrollHeight;
}

function bindAiHelperEvents() {
  const toggleButton = document.querySelector("#ai-helper-toggle");
  const closeButton = document.querySelector("#ai-helper-close");
  const input = document.querySelector("#ai-helper-input");
  const sendButton = document.querySelector("#ai-helper-send");

  if (toggleButton) toggleButton.onclick = () => { state.aiOpen = !state.aiOpen; renderAiHelper(); };
  if (closeButton) closeButton.onclick = () => { state.aiOpen = false; renderAiHelper(); };
  document.querySelectorAll("[data-ai-question]").forEach((button) => {
    button.onclick = () => sendAiQuestion(button.dataset.aiQuestion);
  });
  if (sendButton && input) {
    sendButton.onclick = () => sendAiQuestion(input.value);
    input.onkeydown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendAiQuestion(input.value);
      }
    };
  }
}

async function sendAiQuestion(question) {
  const cleanQuestion = String(question || "").trim();
  if (!cleanQuestion) return;
  state.aiMessages.push({ role: "user", text: cleanQuestion });
  // 실제 Gemini 호출은 수 초 걸릴 수 있어서, 응답을 기다리는 동안 "답변을 준비하는 중..." 말풍선을
  // 먼저 보여주고 응답이 오면 그 자리를 실제 답변으로 교체한다 (요청: 로딩 상태 표시).
  const loadingMessage = { role: "assistant", text: aiHelperText().loading, loading: true };
  state.aiMessages.push(loadingMessage);
  renderAiHelper();
  const sendButton = document.querySelector("#ai-helper-send");
  if (sendButton) sendButton.disabled = true;

  const context = await buildAiContext();

  const replaceLoading = (text) => {
    const idx = state.aiMessages.indexOf(loadingMessage);
    if (idx !== -1) state.aiMessages[idx] = { role: "assistant", text };
    else state.aiMessages.push({ role: "assistant", text });
  };

  try {
    const response = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: cleanQuestion, context }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || `AI API error: ${response.status}`);
    replaceLoading(data.answer || aiHelperText().error);
  } catch (error) {
    console.error(error);
    // 백엔드(server.py)가 연결되지 않은 환경(정적 미리보기 등)에서는 원문 에러 대신
    // 화면 데이터 기반 로컬 폴백으로 답한다. mockCardAnswer와 같은 안전 원칙을 따른다.
    replaceLoading(mockAiAnswer(cleanQuestion, context));
  }
  renderAiHelper();
}

const VISA_UI_I18N = {
  en: { "E-9": ["Non-professional Employment", "I am working under the Employment Permit System."], "H-2": ["Visiting Employment", "I am staying under visiting-employment status.", "New issuance suspended from 2026-02-12 · existing holders remain valid"], "F-4": ["Overseas Korean", "I am staying under Overseas Korean status.", "Included in the H-2 integration from 2026-02-12"], "F-6": ["Marriage Migrant", "I live in Korea with my Korean spouse."], "D-2": ["Student", "I study at a university or graduate school."], "D-4": ["General Trainee", "I am enrolled in language or other general training."] },
  zh: { "E-9": ["非专业就业", "我通过雇佣许可制工作。"], "H-2": ["访问就业", "我以访问就业资格居留。", "自2026-02-12起停止新发 · 现有持有人继续有效"], "F-4": ["在外同胞", "我以在外同胞资格居留。", "自2026-02-12起包含在H-2整合范围内"], "F-6": ["结婚移民", "我与韩国籍配偶在韩国生活。"], "D-2": ["留学", "我在大学或研究生院学习。"], "D-4": ["一般研修", "我在语学堂等机构研修。"] },
  vi: { "E-9": ["Lao động không chuyên", "Tôi đang làm việc theo Hệ thống cấp phép việc làm."], "H-2": ["Lao động thăm thân", "Tôi đang cư trú theo diện H-2.", "Ngừng cấp mới từ 2026-02-12 · người đang giữ vẫn được duy trì"], "F-4": ["Kiều bào Hàn Quốc", "Tôi đang cư trú theo diện F-4.", "Được đưa vào phạm vi tích hợp H-2 từ 2026-02-12"], "F-6": ["Kết hôn nhập cư", "Tôi đang sống cùng vợ/chồng người Hàn Quốc."], "D-2": ["Du học", "Tôi đang học tại đại học hoặc cao học."], "D-4": ["Đào tạo tổng quát", "Tôi đang học tiếng hoặc tham gia chương trình đào tạo."] },
};

function localizedVisa(code, fallbackName, fallbackNote, fallbackFlag) {
  const lang = currentLang();
  if (lang === "ko") return [fallbackName, fallbackNote, fallbackFlag];
  const item = VISA_UI_I18N[lang]?.[code];
  return item ? [item[0], item[1], item[2] || ""] : [fallbackName, fallbackNote, fallbackFlag];
}

const BANK_UI_I18N = {
  en: {
    hana: { name: "Hana Bank", product: "Easy-One Pack Account", benefit: "Preferential electronic banking/ATM fees based on salary, card, and savings usage.", idDocs: "One of ARC / permanent resident card / domestic residence card + passport", channel: "Branch enrollment is primarily recommended", langSupport: "Hana EZ supports 16 languages", note: "If you first use a passport number and later receive an ARC, the identification number can be updated in Hana EZ." },
    shinhan: { name: "Shinhan Bank", product: "SOL Global Account/Savings · Foreigner-only Loan", benefit: "Account opening, remittance and FX through a multilingual app; foreign-language consultation available.", idDocs: "Valid foreign resident ID + passport", channel: "SOL Global or branch", langSupport: "Multilingual app · consultation in 10 languages", note: "Loans have stricter requirements than deposits, including visa, employment period, and income." },
    kb: { name: "KB Kookmin Bank", product: "KB GlobalStar Account/Savings", benefit: "Preferential fees, FX rates, and overseas remittance services for foreign customers.", idDocs: "One of ARC / permanent resident card / domestic residence card", channel: "KB Star app or branch", langSupport: "Multilingual information available", note: "Online opening requires an eligible resident aged 19+, a Korean phone number in the applicant's name, and another domestic bank account." },
    woori: { name: "Woori Bank", product: "Woori WON Global", benefit: "17-language support, online account opening, remittance, FX, and daily-life services.", idDocs: "ARC + passport", channel: "WON Global or branch", langSupport: "App supports 17 languages", note: "App eligibility may depend on period of stay and mobile identity-verification status." },
    ibk: { name: "IBK Industrial Bank of Korea", product: "IBK BUDDY Foreigner Account/Card", benefit: "Transfer/ATM fee exemptions and preferential FX rates for selected currencies.", idDocs: "Valid foreign resident ID + passport", channel: "i-ONE Bank Global or branch", langSupport: "15 languages (17 countries)", note: "If you only have a passport, branch confirmation may be required." },
    nh: { name: "NH NongHyup Bank", product: "NH Global-With Account/Savings/Check Card", benefit: "Preferential interest, electronic banking/ATM fees, and remittance benefits when conditions are met.", idDocs: "Valid foreign resident ID + passport", channel: "NH All-One Global or branch", langSupport: "App supports 13 languages", note: "Products and services may differ at regional agricultural/livestock cooperatives." },
  },
  zh: {
    hana: { name: "Hana Bank", product: "Easy-One Pack 账户", benefit: "根据工资、银行卡、储蓄等使用情况提供电子金融和ATM手续费优惠。", idDocs: "外国人登录证/永住证/国内居所申报证中1种 + 护照", channel: "原则上优先在网点办理", langSupport: "Hana EZ支持16种语言", note: "取得外国人登录证后可在Hana EZ中更新实名号码。" },
    shinhan: { name: "Shinhan Bank", product: "SOL Global 账户/储蓄 · 外国人专用贷款", benefit: "可通过多语言App办理开户、汇款和换汇，并提供外语咨询。", idDocs: "外国人实名证件 + 护照", channel: "SOL Global或网点", langSupport: "多语言App · 10种语言咨询", note: "贷款对签证、在职期限和收入的要求比存款更严格。" },
    kb: { name: "KB Kookmin Bank", product: "KB GlobalStar 账户/储蓄", benefit: "面向外国客户提供手续费、汇率和海外汇款优惠。", idDocs: "外国人登录证/永住证/国内居所申报证中1种", channel: "KB Star App或网点", langSupport: "提供多语言指南", note: "线上开户通常要求年满19岁、本人名义韩国手机号及其他国内银行账户。" },
    woori: { name: "Woori Bank", product: "Woori WON Global", benefit: "支持17种语言、线上开户、汇款、换汇及生活服务。", idDocs: "外国人登录证 + 护照", channel: "WON Global或网点", langSupport: "App支持17种语言", note: "能否通过App开户可能取决于居留期限和手机本人认证状态。" },
    ibk: { name: "IBK Industrial Bank of Korea", product: "IBK BUDDY 外国人账户/银行卡", benefit: "提供转账/ATM手续费优惠及部分货币汇率优惠。", idDocs: "外国人实名证件 + 护照", channel: "i-ONE Bank Global或网点", langSupport: "15种语言（17个国家）", note: "仅持护照时可能需要到网点确认。" },
    nh: { name: "NH NongHyup Bank", product: "NH Global-With 账户/储蓄/支票卡", benefit: "满足条件时可享利率、电子金融/ATM手续费和海外汇款优惠。", idDocs: "外国人实名证件 + 护照", channel: "NH All-One Global或网点", langSupport: "App支持13种语言", note: "地区农畜协的产品和窗口服务可能不同。" },
  },
  vi: {
    hana: { name: "Hana Bank", product: "Tài khoản Easy-One Pack", benefit: "Ưu đãi phí ngân hàng điện tử/ATM tùy theo mức sử dụng lương, thẻ và tiết kiệm.", idDocs: "Một trong các giấy tờ cư trú hợp lệ + hộ chiếu", channel: "Ưu tiên đăng ký tại chi nhánh", langSupport: "Hana EZ hỗ trợ 16 ngôn ngữ", note: "Sau khi nhận ARC, có thể cập nhật số định danh trong Hana EZ." },
    shinhan: { name: "Shinhan Bank", product: "Tài khoản/Tiết kiệm SOL Global · Khoản vay dành riêng cho người nước ngoài", benefit: "Mở tài khoản, chuyển tiền và đổi ngoại tệ qua ứng dụng đa ngôn ngữ.", idDocs: "Giấy tờ cư trú hợp lệ + hộ chiếu", channel: "SOL Global hoặc chi nhánh", langSupport: "Ứng dụng đa ngôn ngữ · tư vấn 10 ngôn ngữ", note: "Khoản vay có điều kiện chặt hơn tiền gửi về visa, thời gian làm việc và thu nhập." },
    kb: { name: "KB Kookmin Bank", product: "Tài khoản/Tiết kiệm KB GlobalStar", benefit: "Ưu đãi phí, tỷ giá và chuyển tiền quốc tế cho khách hàng nước ngoài.", idDocs: "Một trong các giấy tờ cư trú hợp lệ", channel: "Ứng dụng KB Star hoặc chi nhánh", langSupport: "Có hướng dẫn đa ngôn ngữ", note: "Mở trực tuyến thường yêu cầu từ 19 tuổi, số điện thoại Hàn Quốc đứng tên mình và tài khoản ngân hàng nội địa khác." },
    woori: { name: "Woori Bank", product: "Woori WON Global", benefit: "Hỗ trợ 17 ngôn ngữ, mở tài khoản trực tuyến, chuyển tiền và đổi ngoại tệ.", idDocs: "ARC + hộ chiếu", channel: "WON Global hoặc chi nhánh", langSupport: "Ứng dụng hỗ trợ 17 ngôn ngữ", note: "Khả năng đăng ký có thể phụ thuộc vào thời hạn cư trú và xác minh điện thoại." },
    ibk: { name: "IBK Industrial Bank of Korea", product: "Tài khoản/Thẻ IBK BUDDY dành cho người nước ngoài", benefit: "Ưu đãi phí chuyển khoản/ATM và tỷ giá cho một số ngoại tệ.", idDocs: "Giấy tờ cư trú hợp lệ + hộ chiếu", channel: "i-ONE Bank Global hoặc chi nhánh", langSupport: "15 ngôn ngữ (17 quốc gia)", note: "Nếu chỉ có hộ chiếu, có thể cần xác nhận tại chi nhánh." },
    nh: { name: "NH NongHyup Bank", product: "Tài khoản/Tiết kiệm/Thẻ ghi nợ NH Global-With", benefit: "Ưu đãi lãi suất, phí ngân hàng điện tử/ATM và chuyển tiền quốc tế khi đủ điều kiện.", idDocs: "Giấy tờ cư trú hợp lệ + hộ chiếu", channel: "NH All-One Global hoặc chi nhánh", langSupport: "Ứng dụng hỗ trợ 13 ngôn ngữ", note: "Sản phẩm và dịch vụ có thể khác tại các hợp tác xã địa phương." },
  },
};

/* 요청사항 7: 언어를 바꾸면 상품명도 그 은행이 실제로 그 언어로 표기하는 방식에 맞춰 번역한다.
   해당 언어 번역이 없으면(예: 향후 언어 추가 시) 영어 → 한국어 순으로 대체한다. */
function localizedBank(bank) {
  const lang = currentLang();
  if (lang === "ko") return bank;
  const tr = BANK_UI_I18N[lang]?.[bank.key];
  const enFallback = BANK_UI_I18N.en?.[bank.key];
  if (!tr && !enFallback) return bank;
  const merged = { ...bank, ...(enFallback || {}), ...(tr || {}) };
  merged.product = tr?.product || enFallback?.product || bank.product;
  return merged;
}

/* 은행매트릭스 "관련 상품"(related.name) 이름도 언어별로 번역 — 없으면 영어로 대체 */
const RELATED_PRODUCT_I18N = {
  "SOL글로벌론": { en: "SOL Global Loan", zh: "SOL Global贷款", vi: "Khoản vay SOL Global" },
  "퀵글로벌송금": { en: "Quick Global Remittance", zh: "Quick Global汇款", vi: "Chuyển tiền Quick Global" },
  "I-VARO 송금": { en: "I-VARO Remittance", zh: "I-VARO汇款", vi: "Chuyển tiền I-VARO" },
  "K-외국인신용대출": { en: "K-Foreigner Credit Loan", zh: "K-外国人信用贷款", vi: "Vay tín chấp K dành cho người nước ngoài" },
};

function localizedRelatedName(name) {
  const lang = currentLang();
  if (lang === "ko") return name;
  const entry = RELATED_PRODUCT_I18N[name];
  if (!entry) return name;
  return entry[lang] || entry.en || name;
}

function evaluateBankLocalized(bank, visaCode, readiness) {
  const t = appText();
  if (!readiness.arc) return { level: "hold", label: t.results.status.branch, reason: t.results.reason.noArc };
  if (!readiness.employment) return { level: "warn", label: t.results.status.extra, reason: t.results.reason.noEmployment };
  if (bank.nonFace && !readiness.phone) return { level: "warn", label: t.results.status.nonFace, reason: t.results.reason.noPhone };
  if (bank.requiresDomesticAccount && !readiness.hasDomesticAccount) return { level: "warn", label: t.results.status.nonFace, reason: t.results.reason.noDomesticAccount };
  if (!readiness.address) return { level: "info", label: t.results.status.address, reason: t.results.reason.noAddress };
  return { level: "ok", label: t.results.status.ok, reason: t.results.reason.ok };
}

function rankBanksLocalized(visaCode, readiness) {
  return banks.map((bank) => ({ bank, evalResult: evaluateBankLocalized(bank, visaCode, readiness), prioritized: bank.priorityVisas.includes(visaCode) }))
    .sort((a, b) => Number(b.prioritized) - Number(a.prioritized));
}

/* 태국어는 언어 선택지에는 남겨두되(향후 확장 대비), 고르는 즉시 "MVP 미지원" 배너를 띄운다.
   render() 호출 때마다, 그리고 Step1 언어 선택 즉시(변경 이벤트에서 곧바로) 둘 다 갱신한다. */
function updateLangFallbackBanner() {
  const banner = document.querySelector("#lang-fallback-banner");
  if (!banner) return;
  banner.hidden = state.language !== "ไทย";
}

const screen = document.querySelector("#screen");
const nav = document.querySelector("#step-nav");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");

function notice(text) {
  return `<div class="notice"><span class="notice-mark">i</span><span>${text}</span></div>`;
}

function renderNav() {
  const t = appText();
  const activeStep = state.showHub ? null : state.step; // 허브 화면에서는 특정 스텝을 활성 표시하지 않음
  nav.innerHTML = steps.map((item, index) => {
    const number = index + 1;
    // 요청사항 5: Step2까지는 순서대로만 진행되도록 잠그고, 한 번 허브(3번 이후)에 도달하면
    // 3~7번은 순서와 상관없이 사이드바에서 바로 눌러 이동할 수 있는 "버튼"이 된다.
    const freelyUnlocked = number >= 3 && state.hubUnlocked;
    const locked = !freelyUnlocked && number > state.step;
    const status = number === activeStep ? "active" : number < state.step && !locked ? "complete" : "";
    const symbol = number < state.step && (number < 3 || !state.showHub) ? "✓" : number;
    const meta = t.steps[index] || [item.title, item.description];
    return `<button class="step-link ${status}" data-step="${number}" ${locked ? "disabled" : ""}>
      <span class="step-number">${symbol}</span>
      <span class="step-copy"><strong>${meta[0]}</strong><span>${meta[1]}</span></span>
    </button>`;
  }).join("");

  nav.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      state.step = Number(button.dataset.step);
      state.showHub = false;
      if (state.step >= 3) state.hubUnlocked = true;
      render(true);
    });
  });
}

function renderBasic() {
  const t = appText();
  const nationalities = ["베트남", "중국", "태국", "필리핀", "인도네시아", "캄보디아", "우즈베키스탄", "기타"];
  screen.innerHTML = `
    <p class="eyebrow">${t.basic.eyebrow}</p>
    <h1>${t.basic.title}</h1>
    <p class="lead">${t.basic.lead}</p>
    <div class="form-grid">
      <div class="field"><label for="nationality">${t.basic.nationality}</label><select id="nationality" class="control">${nationalities.map((country) => `<option value="${country}">${t.countries[country] || country}</option>`).join("")}</select></div>
      <div class="field"><label for="birth-date">${t.basic.birth}</label><input id="birth-date" class="control" type="date" value="${state.birthDate}" /></div>
      <div class="field"><label for="arrival-date">${t.basic.arrival}</label><input id="arrival-date" class="control" type="date" value="${state.arrivalDate}" /></div>
    </div>
    ${notice(t.basic.notice)}
  `;

  const nationality = document.querySelector("#nationality");
  nationality.value = state.nationality;
  nationality.addEventListener("change", (event) => { state.nationality = event.target.value; });
  document.querySelector("#birth-date").addEventListener("change", (event) => { state.birthDate = event.target.value; });
  document.querySelector("#arrival-date").addEventListener("change", (event) => { state.arrivalDate = event.target.value; });
}

function renderVisa() {
  const t = appText();
  screen.innerHTML = `
    <p class="eyebrow">${t.visa.eyebrow}</p>
    <h1>${t.visa.title}</h1>
    <p class="lead">${t.visa.lead}</p>
    <div class="visa-grid">
      ${visas.map(([code, name, note, flag]) => {
        const [displayName, displayNote, displayFlag] = localizedVisa(code, name, note, flag);
        return `<button type="button" class="visa-card ${state.visa === code ? "active" : ""}" data-visa="${code}"><span class="visa-code">${code}</span><span class="visa-name">${displayName}</span><span class="visa-note">${displayNote}</span>${displayFlag ? `<span class="visa-flag">${displayFlag}</span>` : ""}<span class="visa-check">✓</span></button>`;
      }).join("")}
    </div>
    <div class="visa-date-grid">
      <div class="field date-field"><label for="expiry-date">${t.visa.expiry}</label><input id="expiry-date" class="control" type="date" value="${state.expiryDate}" /></div>
      <div class="field date-field"><label for="visa-departure-date">${t.visa.departure}</label><input id="visa-departure-date" class="control" type="date" value="${state.departureDate || ""}" /></div>
    </div>
    <p id="stay-warning" class="notice warn-notice" hidden></p>
    ${notice(t.visa.notice)}
  `;
  screen.querySelectorAll("[data-visa]").forEach((button) => button.addEventListener("click", () => { state.visa = button.dataset.visa; renderVisa(); }));
  document.querySelector("#expiry-date").addEventListener("change", (event) => { state.expiryDate = event.target.value; updateStayWarning(); });
  // 요청: 체류기간 만료일과 출국 예정일을 처음(Step2)부터 같이 입력받는다 — 이후 뒷 화면(금융준비·보험관리)의
  // 출국 예정일 입력칸은 그대로 두되, state.departureDate를 공유하므로 여기서 입력하면 자동으로 채워져 있다.
  document.querySelector("#visa-departure-date").addEventListener("change", (event) => { state.departureDate = event.target.value; updateStayWarning(); });
  updateStayWarning();
}

/* 요청사항 6: 체류기간(만료일)보다 출국 예정일이 늦으면 불법체류 위험을 경고 */
function updateStayWarning() {
  const el = document.querySelector("#stay-warning");
  if (!el) return;
  const expiry = state.expiryDate;
  const departure = state.departureDate;
  if (expiry && departure && departure > expiry) {
    el.hidden = false;
    el.textContent = appText().stayWarning;
  } else {
    el.hidden = true;
    el.textContent = "";
  }
}

function renderReadiness() {
  const t = appText();
  const keys = ["arc", "phone", "employment", "address", "salary", "hasDomesticAccount"];
  screen.innerHTML = `
    <p class="eyebrow">${t.readiness.eyebrow}</p>
    <h1>${t.readiness.title}</h1>
    <p class="lead">${t.readiness.lead}</p>
    <div class="check-list">
      ${keys.map((key) => { const [title, description] = t.readiness.items[key]; return `<label class="check-row"><input type="checkbox" data-ready="${key}" ${state.readiness[key] ? "checked" : ""} /><span class="check-copy"><strong>${title}</strong><span>${description}</span></span></label>`; }).join("")}
    </div>

    <p class="eyebrow" style="margin-top:36px">${t.readiness.subEyebrow}</p>
    <h1 style="font-size:22px">${t.readiness.subTitle}</h1>
    <p class="lead">${t.readiness.subLead}</p>
    <div class="form-grid" style="margin-top:20px">
      <div class="field"><label for="ready-departure">${t.readiness.departure}</label><input id="ready-departure" class="control" type="date" value="${state.departureDate}" /></div>
    </div>
    <p id="stay-warning" class="notice warn-notice" hidden></p>
    <div class="check-list" style="margin-top:16px">
      <label class="check-row"><input type="checkbox" id="ready-account" ${state.accountOpened ? "checked" : ""} /><span class="check-copy"><strong>${t.readiness.accountTitle}</strong><span>${t.readiness.accountDesc}</span></span></label>
      <label class="check-row"><input type="checkbox" id="ready-oneyear" ${state.oneYearPlus ? "checked" : ""} /><span class="check-copy"><strong>${t.readiness.oneYearTitle}</strong><span>${t.readiness.oneYearDesc}</span></span></label>
    </div>
  `;
  screen.querySelectorAll("[data-ready]").forEach((input) => input.addEventListener("change", () => { state.readiness[input.dataset.ready] = input.checked; }));
  document.querySelector("#ready-departure").addEventListener("change", (e) => { state.departureDate = e.target.value; updateStayWarning(); });
  document.querySelector("#ready-account").addEventListener("change", (e) => { state.accountOpened = e.target.checked; });
  document.querySelector("#ready-oneyear").addEventListener("change", (e) => { state.oneYearPlus = e.target.checked; });
  updateStayWarning();
}

function renderResults() {
  const t = appText();
  const readyCount = Object.values(state.readiness).filter(Boolean).length;
  const ranked = rankBanksLocalized(state.visa, state.readiness);
  const allSources = [...new Set(ranked.flatMap(({ bank }) => bank.sources))];

  screen.innerHTML = `
    <div class="result-head">
      <div><p class="eyebrow">${t.results.eyebrow}</p><h1>${state.visa} ${t.results.visaCompare}</h1><p class="lead">${localizedCountry(state.nationality)} · ${t.results.stayUntil} ${state.expiryDate} ${t.results.until} · ${t.results.readyCount} ${readyCount}${t.results.countUnit}</p></div>
      <span class="dummy-badge">${t.results.badge}</span>
    </div>
    <div class="bank-list">
      ${ranked.map(({ bank, evalResult, prioritized }, index) => { const displayBank = localizedBank(bank); return `
        <article class="bank-card level-${evalResult.level}">
          <div class="rank">${index + 1}</div>
          <div class="bank-copy">
            <div><strong>${displayBank.name}</strong>${prioritized ? `<span class="bank-tone">${t.results.priority}</span>` : ""}</div>
            <p class="bank-product">${displayBank.product}</p>
            <p>${displayBank.benefit}</p>
            <small>${displayBank.channel} · ${displayBank.langSupport}</small>
            ${displayBank.note ? `<small class="bank-note">${t.results.reference} — ${displayBank.note}</small>` : ""}
            ${bank.related ? relatedProductHtml(bank.related, t) : ""}
          </div>
          <div class="tags">
            <span class="tag">${displayBank.idDocs}</span>
          </div>
          <div class="status status-${evalResult.level}">
            <strong>${evalResult.label}</strong>
            <small>${evalResult.reason}</small>
          </div>
        </article>
      `; }).join("")}
    </div>
    <details class="sources-box">
      <summary>${t.results.sources}</summary>
      <ul>${allSources.map((code) => `<li>${code} — <a href="${bankSources[code]}" target="_blank" rel="noopener">${bankSources[code]}</a></li>`).join("")}</ul>
    </details>
    ${notice(t.results.notice)}
  `;
}

function relatedProductHtml(related, t) {
  let eligibilityBadge = "";
  if (related.eligibleVisas) {
    const eligible = related.eligibleVisas.includes(state.visa);
    eligibilityBadge = `<span class="related-eligibility ${eligible ? "yes" : "no"}">${eligible ? t.results.relatedEligible : t.results.relatedNotEligible}</span>`;
  }
  return `
    <div class="related-product">
      <span class="related-label">${t.results.related}</span>
      <div class="related-body">
        <strong>${localizedRelatedName(related.name)}</strong>${related.fee ? ` · ${related.fee}` : ""}
        ${eligibilityBadge}
        <p>${related.note}</p>
      </div>
    </div>
  `;
}

function amountLine(lang, nationality, amount) {
  const formatted = amount.toLocaleString(lang === "ko" ? "ko-KR" : "en-US");
  const nationalityText = localizedCountry(nationality);
  switch (lang) {
    case "en": return `${formatted} KRW (paid by you — ${nationalityText})`;
    case "zh": return `${formatted} 韩元（本人缴纳 — ${nationalityText}）`;
    case "vi": return `${formatted} KRW (tự đóng — ${nationalityText})`;
    default: return `${formatted}원 (본인 납부 — ${nationalityText} 기준)`;
  }
}

function accrualLine(lang) {
  switch (lang) {
    case "en": return "8.3% of monthly wage (paid by employer)";
    case "zh": return "月薪的8.3%（雇主缴纳）";
    case "vi": return "8,3% lương hàng tháng (do người sử dụng lao động đóng)";
    default: return "월급여의 8.3% (사업주 납부)";
  }
}

function renderDashboard() {
  const lang = currentLang();
  const s = INSURANCE_STR[lang];
  const days = daysUntilDeadline(state.departureDate);
  const accountOpened = state.accountOpened;

  let level = "clear";
  if (!accountOpened) level = "account";
  else if (days !== null && days <= 90) level = "insurance";

  const bannerMap = {
    account: { title: s.bannerAccountTitle, desc: s.bannerAccountDesc, tone: "warn" },
    insurance: { title: s.bannerInsuranceTitle, desc: s.bannerInsuranceDesc, tone: days < 0 ? "critical" : "warn" },
    clear: { title: s.bannerClearTitle, desc: s.bannerClearDesc, tone: "ok" },
  };
  const banner = bannerMap[level];
  const dday = s.ddayFmt(days);

  screen.innerHTML = `
    <p class="eyebrow">${s.dashTitle}</p>
    <h1>${s.dashSub}</h1>
    <div class="dash-banner tone-${banner.tone}">
      <strong>${banner.title}</strong>
      <p>${banner.desc}</p>
    </div>
    <div class="dash-cards">
      <button type="button" class="dash-card" data-goto="3">
        <span class="dash-card-k">${s.sum1k}</span>
        <span class="dash-card-v ${accountOpened ? "ok" : "warn"}">${accountOpened ? s.sum1v : s.notYet}</span>
        <span class="dash-card-go">${s.goLabel}</span>
      </button>
      <button type="button" class="dash-card" data-goto="6">
        <span class="dash-card-k">${s.sum2k}</span>
        <span class="dash-card-v ${days !== null && days <= 90 ? "critical" : "ok"}">${dday}</span>
        <span class="dash-card-go">${s.goLabel}</span>
      </button>
      <button type="button" class="dash-card" data-goto="6">
        <span class="dash-card-k">${s.sum3k}</span>
        <span class="dash-card-v ${days !== null && days <= 90 ? "critical" : "ok"}">${dday}</span>
        <span class="dash-card-go">${s.goLabel}</span>
      </button>
    </div>
    ${notice(appText().dashboardNotice)}
  `;

  document.querySelectorAll("[data-goto]").forEach((btn) => btn.addEventListener("click", () => { state.step = Number(btn.dataset.goto); state.showHub = false; state.hubUnlocked = true; render(true); }));
}

function insuranceCardHtml(kind, s, days, amountText, lang) {
  const isC1 = kind === "c1";
  const pill = pillFor(days, kind, s);
  const title = isC1 ? s.c1Title : s.c2Title;
  const sub = isC1 ? s.c1Sub : s.c2Sub;
  const f1k = isC1 ? s.c1F1k : s.c2F1k;
  const f1v = isC1 ? accrualLine(lang) : amountText;
  const f2k = isC1 ? s.c1F2k : s.c2F2k;
  const f2v = isC1 ? s.c1F2v : s.c2F2v;
  const f3k = isC1 ? s.c1F3k : s.c2F3k;
  const f3v = isC1 ? s.c1F3v : s.c2F3v;
  const ddayLabel = isC1 ? s.c1DdayLabel : s.c2DdayLabel;
  const nextB = isC1 ? s.c1NextB : s.c2NextB;
  const nextV = isC1 ? (state.oneYearPlus ? s.c1NextOver1y : s.c1NextUnder1y) : s.c2NextV;
  const btn1 = isC1 ? s.c1Btn1 : s.c2Btn1;
  const btn2 = isC1 ? s.c1Btn2 : s.c2Btn2;
  const stepsList = isC1 ? s.c1Steps : s.c2Steps;
  const detailOpen = uiState.openPanels[`detail-${kind}`] ? "open" : "";
  const qaOpen = uiState.openPanels[`qa-${kind}`] ? "open" : "";
  const qa = uiState.qa[kind];

  return `
    <article class="ins-card">
      <div class="ins-head">
        <div><h2>${title}</h2><p>${sub}</p></div>
        <span class="pill ${pill.cls}">${pill.txt}</span>
      </div>
      <div class="dday"><span class="num">${s.ddayFmt(days)}</span><span class="label">${ddayLabel}</span></div>
      <div class="facts">
        <div class="fact"><span class="k">${f1k}</span><span class="v mono">${f1v}</span></div>
        <div class="fact"><span class="k">${f2k}</span><span class="v">${f2v}</span></div>
        <div class="fact"><span class="k">${f3k}</span><span class="v">${f3v}</span></div>
      </div>
      <div class="next-action"><b>${nextB}</b> <span>${nextV}</span></div>
      <div class="card-actions">
        <button type="button" class="button button-secondary btn-sm" data-toggle="detail-${kind}">${btn1}</button>
        <button type="button" class="button button-primary btn-sm" data-toggle="qa-${kind}">${btn2}</button>
      </div>
      <div class="detail ${detailOpen}" id="detail-${kind}"><ol>${stepsList.map((li) => `<li>${li}</li>`).join("")}</ol></div>
      <div class="qa ${qaOpen}" id="qa-${kind}">
        <div class="tag">${s.qaTag}</div>
        ${qa ? `<div class="q">Q. ${qa.q}</div><div class="a ${qa.refuse ? "refuse" : ""}">${qa.text}</div>` : ""}
        <div class="presets">
          <button type="button" class="preset-btn" data-card="${kind}" data-preset="1">${s.qaPreset1}</button>
          <button type="button" class="preset-btn" data-card="${kind}" data-preset="2">${s.qaPreset2}</button>
          <button type="button" class="preset-btn" data-card="${kind}" data-preset="3">${s.qaPreset3}</button>
        </div>
        <div class="qa-input-row">
          <input type="text" class="control qa-input" id="${kind}-qa-input" placeholder="${s.qaPlaceholder}" />
          <button type="button" class="button button-secondary btn-sm qa-send" data-card="${kind}">${s.qaSend}</button>
        </div>
      </div>
    </article>
  `;
}

function renderInsurance() {
  const lang = currentLang();
  const s = INSURANCE_STR[lang];
  const days = daysUntilDeadline(state.departureDate);
  const amountText = amountLine(lang, state.nationality, returnCostAmount(state.nationality));

  screen.innerHTML = `
    <p class="eyebrow">${s.title}</p>
    <h1>${s.subtitle}</h1>
    <div class="insurance-controls">
      <div class="field"><label for="ins-departure">${s.ctrlDate}</label><input id="ins-departure" class="control" type="date" value="${state.departureDate}" /></div>
      <label class="check-inline"><input type="checkbox" id="ins-oneyear" ${state.oneYearPlus ? "checked" : ""} /> ${s.ctrlCheck}</label>
    </div>
    <p id="stay-warning" class="notice warn-notice" hidden></p>
    <p class="lead">${s.ctrlNote}</p>
    <div class="insurance-cards">
      ${insuranceCardHtml("c1", s, days, amountText, lang)}
      ${insuranceCardHtml("c2", s, days, amountText, lang)}
    </div>
    <div class="banner-3things">
      <strong>${s.bannerTitle}</strong>
      <div class="stub-grid">
        <div class="stub"><span class="stub-n">01</span><span class="stub-t">${s.stub1t}</span><span class="stub-d">${s.stub1d}</span></div>
        <div class="stub"><span class="stub-n">02</span><span class="stub-t">${s.stub2t}</span><span class="stub-d">${s.stub2d}</span></div>
        <div class="stub"><span class="stub-n">03</span><span class="stub-t">${s.stub3t}</span><span class="stub-d">${s.stub3d}</span></div>
      </div>
    </div>
    ${notice(appText().insuranceNotice)}
  `;

  wireInsuranceEvents(lang, s, days);
  updateStayWarning();
}

function wireInsuranceEvents(lang, s, days) {
  document.querySelector("#ins-departure").addEventListener("change", (e) => { state.departureDate = e.target.value; render(); });
  document.querySelector("#ins-oneyear").addEventListener("change", (e) => { state.oneYearPlus = e.target.checked; render(); });

  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.toggle;
      uiState.openPanels[id] = !uiState.openPanels[id];
      render();
    });
  });

  const presetMap = { 1: (s) => s.qaPreset1, 2: (s) => s.qaPreset2, 3: (s) => s.qaPreset3 };
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const card = btn.dataset.card;
      const question = presetMap[btn.dataset.preset](s);
      uiState.qa[card] = { q: question, text: s.qaLoading || "…", refuse: false };
      uiState.openPanels[`qa-${card}`] = true;
      render();
      const answer = await askCardQA(card, question, { lang, days, oneYearPlus: state.oneYearPlus });
      uiState.qa[card] = { q: question, text: answer.text, refuse: answer.refuse };
      render();
    });
  });

  document.querySelectorAll(".qa-send").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const card = btn.dataset.card;
      const input = document.querySelector(`#${card}-qa-input`);
      const question = input.value.trim();
      if (!question) return;
      uiState.qa[card] = { q: question, text: s.qaLoading || "…", refuse: false };
      uiState.openPanels[`qa-${card}`] = true;
      render();
      const answer = await askCardQA(card, question, { lang, days, oneYearPlus: state.oneYearPlus });
      uiState.qa[card] = { q: question, text: answer.text, refuse: answer.refuse };
      render();
    });
  });
}

/* ============================================================
   Step7 — 송금 비교
   트랙3(한지원)
   ============================================================ */

function renderRemittance() {
  const t = getRemittanceText();
  const data = window.REMITTANCE_DATA || [];
  const countries = ["베트남", "중국", "태국", "필리핀", "인도네시아", "캄보디아"];
  const currencyMap = {
    "베트남": "VND",
    "중국": "CNY",
    "태국": "THB",
    "필리핀": "PHP",
    "인도네시아": "IDR",
    "캄보디아": "KHR",
  };
  const mainBanks = ["하나은행", "신한은행", "KB국민은행", "우리은행"];

  const filtered = data.filter((item) => {
    const countryMatch = item.country === state.remittanceCountry || item.country === "공통";
    if (!countryMatch) return false;
    if (item.type && item.type.includes("핀테크")) return true;
    if (item.type && item.type.includes("은행")) return mainBanks.includes(item.provider);
    return false;
  });

  // 같은 업체가 여러 행일 경우 화면에는 한 번만 표시
  const uniqueFiltered = [];
  const seenProviders = new Set();

  filtered.forEach((item) => {
    if (!seenProviders.has(item.provider)) {
      seenProviders.add(item.provider);
      uniqueFiltered.push(item);
    }
  });

  uniqueFiltered.sort((a, b) => {
    const aFintech = a.type && a.type.includes("핀테크");
    const bFintech = b.type && b.type.includes("핀테크");
    if (aFintech && !bFintech) return -1;
    if (!aFintech && bFintech) return 1;
    return 0;
  });

  const comparisonSummary = getRemittanceLang() === "ko"
    ? `${t.fromKorea} <strong>${formatKRW(state.remittanceAmount)}</strong>을 <strong>${t.countries[state.remittanceCountry]}</strong>으로 송금`
    : `${t.fromKorea} <strong>${formatKRW(state.remittanceAmount)}</strong> ${t.sendTo} <strong>${t.countries[state.remittanceCountry]}</strong>`;

  screen.innerHTML = `
    <p class="eyebrow">${t.eyebrow}</p>
    <h1>${t.countries[state.remittanceCountry]}${t.titleSuffix}</h1>
    <p class="lead">${t.lead}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0;">
      <div class="field">
        <label for="remittance-country">${t.countryLabel}</label>
        <select id="remittance-country" class="control">
          ${countries.map((country) => `<option value="${country}" ${country === state.remittanceCountry ? "selected" : ""}>${t.countries[country]}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label for="remittance-amount">${t.amountLabel}</label>
        <input id="remittance-amount" class="control" type="number" value="${state.remittanceAmount}" min="10000" step="10000" />
      </div>
    </div>

    <div style="padding:14px 16px;margin-bottom:22px;background:#f1f4ed;border-radius:14px;font-size:13px;color:#52665f;">
      ${t.compareBase}: ${comparisonSummary}
    </div>

    <div id="exchange-rate-card" style="margin:22px 0 30px;padding:24px;border-radius:18px;background:#f1f4ed;">
      ${t.loadingRate}
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
      ${filtered.length === 0
        ? `<div class="notice"><span class="notice-mark">i</span><span>${t.noData}</span></div>`
        : uniqueFiltered.map((item, index) => remittanceCardHtml(item, index)).join("")}
    </div>

    ${notice(t.finalNotice)}
  `;

  loadExchangeRate(currencyMap);
  patchComputedFees(uniqueFiltered, Number(state.remittanceAmount || 0));

  document.querySelector("#remittance-country").addEventListener("change", (e) => {
    state.remittanceCountry = e.target.value;
    render();
  });

  document.querySelector("#remittance-amount").addEventListener("change", (e) => {
    state.remittanceAmount = Number(e.target.value) || 1000000;
    render();
  });

}

/* ============================================================
   참고 기준환율 API
   ============================================================ */

async function loadExchangeRate(currencyMap) {
  const t = getRemittanceText();
  const currency = currencyMap[state.remittanceCountry];
  const amount = Number(state.remittanceAmount) || 0;
  const card = document.querySelector("#exchange-rate-card");

  if (!card) return;
  if (amount <= 0) {
    card.innerHTML = t.enterAmount;
    return;
  }

  try {
    card.innerHTML = t.loadingRate;

    const params = new URLSearchParams({ currency, amount: String(amount) });
    const response = await fetch(`/api/exchange?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "환율 API 요청 실패");
    }

    const rate = Number(data.rate);
    const converted = Number(data.converted_amount);

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px;">
        <div>
          <p style="margin:0 0 6px;color:#52665f;font-size:13px;font-weight:700;">${t.rateTitle}</p>
          <h2 style="margin:0 0 18px;font-size:24px;">${t.countries[state.remittanceCountry]} ${currency}</h2>
          <div style="font-size:16px;margin-bottom:18px;">
            1 KRW = <strong>${rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${currency}</strong>
          </div>
          <div style="font-size:14px;color:#52665f;margin-bottom:5px;">${t.referenceConversion}</div>
          <div style="font-size:22px;font-weight:700;">
            ${formatKRW(amount)} ≈ ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}
          </div>
        </div>
        <div style="padding:6px 10px;border-radius:8px;background:white;color:#718078;font-size:11px;white-space:nowrap;">
          ${t.rateSource}
        </div>
      </div>
      <div style="margin-top:20px;padding-top:14px;border-top:1px solid #dfe5df;color:#718078;font-size:11px;line-height:1.6;">
        ${t.rateNotice1}<br>
        ${t.rateNotice2}
      </div>`;
  } catch (error) {
    console.error(error);
    // 백엔드(server.py, /api/exchange)가 연결되지 않은 환경(예: 정적 미리보기)에서는
    // 놀란 느낌의 원문 에러 대신, 실제 배포 환경 안내로 부드럽게 대체한다.
    card.innerHTML = `
      <strong>${t.rateOffline}</strong>
      <div style="margin-top:8px;color:#718078;font-size:12px;line-height:1.6;">${t.rateOfflineHint}</div>`;
  }
}

/* ============================================================
   송금 카드 HTML
   - 4개 비교항목 통일
   - 은행 수수료 긴 문장은 상세보기로 접기
   ============================================================ */

/* ============================================================
   요청사항 4: 송금 금액을 입력하면 은행 수수료 구간표를 읽어서
   "약 OO원"을 자동으로 계산해 보여준다.
   - 구간표는 "미화 500불 상당액 이하 : 2,500원" 처럼 자유 텍스트라,
     정규식 + 한글 단위(만/천/백/억) 파서로 구간을 뽑아낸다.
   - 구간이 미화(USD) 기준이면, 오늘의 참고환율로 입력 금액(KRW)을 USD로
     환산해서 비교한다. 파싱에 실패하면(형식이 다르면) 계산을 시도하지 않고
     기존처럼 "송금액별 차등"만 보여준다 — 틀린 숫자를 보여주는 것보다 안전.
   ============================================================ */

function parseKoreanAmount(rawStr) {
  const str = String(rawStr).replace(/,/g, "").trim();
  const units = [["억", 1e8], ["천만", 1e7], ["백만", 1e6], ["십만", 1e5], ["만", 1e4], ["천", 1e3], ["백", 100]];
  for (const [word, mult] of units) {
    const idx = str.indexOf(word);
    if (idx !== -1) {
      const numPart = str.slice(0, idx) || "1";
      const rest = str.slice(idx + word.length);
      const base = Number(numPart) * mult;
      const restNum = rest ? Number(rest) : 0;
      if (!Number.isFinite(base) || !Number.isFinite(restNum)) return null;
      return base + restNum;
    }
  }
  const n = Number(str);
  return Number.isFinite(n) ? n : null;
}

function parseFeeTiers(rawFee) {
  if (!rawFee) return null;
  const tierRegex = /(미화\s*)?([0-9,]+(?:천만|백만|십만|만|억|천|백)?)\s*(불|원)\s*(?:상당액)?\s*(이하|이내|초과)\s*[:：]?\s*([0-9,]+|면제|무료)\s*원?/g;
  const tiers = [];
  let match;
  while ((match = tierRegex.exec(rawFee)) !== null) {
    const [, usdPrefix, numToken, unit, comparator, feeToken] = match;
    const limit = parseKoreanAmount(numToken);
    if (limit === null) continue;
    const fee = feeToken === "면제" || feeToken === "무료" ? 0 : Number(feeToken.replace(/,/g, ""));
    if (!Number.isFinite(fee)) continue;
    tiers.push({ unit: usdPrefix || unit === "불" ? "USD" : "KRW", limit, open: comparator === "초과", fee });
  }
  return tiers.length ? tiers : null;
}

function calcTierFee(rawFee, amountKRW, usdPerKrw) {
  const tiers = parseFeeTiers(rawFee);
  if (!tiers) return { fee: null, needsUsdRate: false };
  const usdTiers = tiers.filter((t) => t.unit === "USD");
  const krwTiers = tiers.filter((t) => t.unit === "KRW");
  const useUsd = usdTiers.length > 0;
  const use = useUsd ? usdTiers : krwTiers;
  if (!use.length) return { fee: null, needsUsdRate: false };
  if (useUsd && (usdPerKrw === null || usdPerKrw === undefined)) return { fee: null, needsUsdRate: true };

  const compareValue = useUsd ? amountKRW * usdPerKrw : amountKRW;
  const closedTiers = use.filter((t) => !t.open).sort((a, b) => a.limit - b.limit);
  const openTier = use.find((t) => t.open);
  for (const t of closedTiers) { if (compareValue <= t.limit) return { fee: t.fee, needsUsdRate: false }; }
  if (openTier) return { fee: openTier.fee, needsUsdRate: false };
  return { fee: closedTiers.length ? closedTiers[closedTiers.length - 1].fee : null, needsUsdRate: false };
}

function computedFeeLabel(lang, amount) {
  const money = formatKRW(amount);
  if (lang === "ko") return `약 ${money}`;
  if (lang === "en") return `Approx. ${money}`;
  if (lang === "zh") return `约 ${money}`;
  if (lang === "vi") return `Khoảng ${money}`;
  return `~ ${money}`;
}

/* 입력 금액이 바뀔 때마다(또는 최초 환율 조회가 끝나면) 카드의 "예상 수수료" 부분만
   직접 갱신한다 — 화면 전체를 다시 그리지 않아 요청사항 5(스크롤 튐 방지)와도 맞는다. */
function patchComputedFees(items, amountKRW) {
  const lang = getRemittanceLang();
  items.forEach((item, index) => {
    const el = document.querySelector(`#calc-fee-${index}`);
    if (!el) return;
    const rawFee = item.fee && item.fee.trim() !== "" ? item.fee.trim() : "";
    const { fee, needsUsdRate } = calcTierFee(rawFee, amountKRW, cachedExchangeRates?.rates?.USD ?? null);
    if (fee !== null) {
      el.textContent = computedFeeLabel(lang, fee);
      el.classList.remove("calc-fee-pending");
    } else if (needsUsdRate) {
      ensureAllExchangeRates().then((rates) => {
        if (!rates) return;
        const retry = calcTierFee(rawFee, amountKRW, rates.rates?.USD ?? null);
        if (retry.fee !== null) {
          el.textContent = computedFeeLabel(lang, retry.fee);
          el.classList.remove("calc-fee-pending");
        }
      });
    }
  });
}

function remittanceCardHtml(item, index) {
  const t = getRemittanceText();
  const typeText = item.type || "";
  const isFintech = typeText.includes("핀테크");
  const isBank = typeText.includes("은행");

  const rawFee = item.fee && item.fee.trim() !== "" ? item.fee.trim() : "확인 필요";
  const fee = localizeRemittanceValue(rawFee);
  const extraFee = localizeRemittanceValue(item.extra_fee);
  const transferTime = localizeRemittanceValue(item.transfer_time);
  const receiveMethod = localizeRemittanceValue(item.receive_method);

  const hasDetailedFee = isBank && rawFee !== "확인 필요" && (
    rawFee.includes("/") || rawFee.includes("\n") || rawFee.length > 35
  );

  // 요청사항 4: 구간표를 파싱할 수 있으면 입력한 송금 금액 기준 예상 수수료를 계산해서 보여준다.
  const tierCalc = hasDetailedFee ? calcTierFee(rawFee, Number(state.remittanceAmount || 0), cachedExchangeRates?.rates?.USD ?? null) : { fee: null, needsUsdRate: false };
  let feeDisplay = hasDetailedFee ? t.feeVariable : fee;
  let calcFeeHtml = "";
  if (hasDetailedFee && (tierCalc.fee !== null || tierCalc.needsUsdRate)) {
    const pendingLabel = { ko: "계산 중...", en: "Calculating...", zh: "计算中...", vi: "Đang tính..." }[getRemittanceLang()] || "...";
    const value = tierCalc.fee !== null ? computedFeeLabel(getRemittanceLang(), tierCalc.fee) : pendingLabel;
    calcFeeHtml = `<div id="calc-fee-${index}" class="calc-fee ${tierCalc.fee === null ? "calc-fee-pending" : ""}">${value}</div>`;
  }

  return `
    <article style="border:1px solid #dfe5e1;border-radius:16px;padding:20px;background:white;display:flex;flex-direction:column;min-height:100%;">
      <div>
        <span style="display:inline-block;margin-bottom:9px;padding:4px 8px;border-radius:8px;background:#e8efe7;color:#315f50;font-size:11px;font-weight:700;">
          ${isFintech ? t.fintech : t.bank}
        </span>
        <h3 style="margin:0;font-size:20px;">${localizedProviderName(item.provider)}</h3>
      </div>

      <div style="margin-top:20px;display:grid;gap:16px;font-size:13px;">
        <div>
          <div style="margin-bottom:4px;color:#7b8780;font-size:12px;">${t.fee}</div>
          <strong style="line-height:1.5;">${feeDisplay}</strong>
          ${calcFeeHtml}
        </div>
        <div>
          <div style="margin-bottom:4px;color:#7b8780;font-size:12px;">${t.extraFee}</div>
          <strong style="line-height:1.5;">${extraFee}</strong>
        </div>
        <div>
          <div style="margin-bottom:4px;color:#7b8780;font-size:12px;">${t.transferTime}</div>
          <strong style="line-height:1.5;">${transferTime}</strong>
        </div>
        <div>
          <div style="margin-bottom:4px;color:#7b8780;font-size:12px;">${t.receiveMethod}</div>
          <strong style="line-height:1.5;">${receiveMethod}</strong>
        </div>
      </div>

      ${hasDetailedFee ? `
        <details style="margin-top:18px;padding-top:14px;border-top:1px solid #edf0ee;">
          <summary style="cursor:pointer;color:#315f50;font-size:12px;font-weight:700;">${t.feeDetails}</summary>
          ${t.feeDetailKoNotice ? `<p style="margin:10px 0 0;color:#8a958e;font-size:11px;line-height:1.6;font-style:italic;">${t.feeDetailKoNotice}</p>` : ""}
          <div style="margin-top:12px;padding:12px;border-radius:10px;background:#f5f7f4;color:#52665f;font-size:11px;line-height:1.7;white-space:pre-wrap;word-break:keep-all;">${rawFee}</div>
        </details>` : ""}

      ${item.promotion && item.promotion.trim() !== "" ? `
        <div style="margin-top:16px;padding:10px 12px;border-radius:10px;background:#fff7df;color:#806a37;font-size:12px;line-height:1.5;">
          🎁 ${item.promotion}
        </div>` : ""}

      <div style="margin-top:auto;padding-top:18px;color:#8a958e;font-size:10px;line-height:1.6;">
        ${t.source}: ${localizedProviderSource(item.source) || t.checkNeeded}${item.checked_at ? `<br>${t.checkedAt}: ${item.checked_at}` : ""}
      </div>
    </article>`;
}

/* 요청(2026-09-04): <input type="date">의 네이티브 달력 팝업(요일/월 표시, "년/월" 같은 로케일 문구)은
   브라우저가 <html lang="..">를 기준으로 렌더링한다 — 페이지 자체 다국어 상태와 별개라서, html의 lang을
   현재 선택 언어에 맞춰 계속 동기화해줘야 달력도 같은 언어로 보인다. */
const DATE_INPUT_LOCALE = { ko: "ko-KR", en: "en-US", zh: "zh-CN", vi: "vi-VN" };
function syncDocumentLang() {
  document.documentElement.lang = DATE_INPUT_LOCALE[currentLang()] || "ko-KR";
}

function render(scrollTop = false) {
  syncDocumentLang();
  const t = appText();
  const stepMeta = t.steps[state.step - 1] || [steps[state.step - 1].title, steps[state.step - 1].description];
  renderNav();
  const onHub = state.step >= 3 && state.showHub;
  document.querySelector("#step-count").textContent = `${state.step} / ${steps.length}`;
  document.querySelector("#progress-bar").style.width = `${(state.step / steps.length) * 100}%`;
  document.querySelector("#step-label").textContent = onHub ? "STEP 3-7" : `STEP ${state.step}`;
  document.querySelector("#step-title").textContent = onHub ? (HUB_I18N[currentLang()] || HUB_I18N.ko).eyebrow : stepMeta[0];
  const languageSelect = document.querySelector("#language-badge");
  if (languageSelect) {
    languageSelect.value = state.language;
    languageSelect.onchange = (event) => {
      state.language = event.target.value;
      render();
    };
  }
  updateLangFallbackBanner();

  const progressLabel = document.querySelector("#progress-label");
  if (progressLabel) progressLabel.textContent = t.progress;
  const brandSubtitle = document.querySelector("#brand-subtitle");
  if (brandSubtitle) brandSubtitle.textContent = t.brandSubtitle;
  const demoNote = document.querySelector("#demo-note");
  if (demoNote) demoNote.textContent = t.demoNote;

  const h = HUB_I18N[currentLang()] || HUB_I18N.ko;
  backButton.disabled = state.step === 1;
  backButton.textContent = t.back;
  if (state.step >= 3 && state.showHub) {
    // 허브 화면: 카드를 눌러 이동하는 것이 기본 동작이므로 "다음" 버튼은 숨긴다.
    nextButton.textContent = t.next;
    nextButton.style.visibility = "hidden";
  } else if (state.step === 4 || state.step === 5 || state.step === 6) {
    nextButton.textContent = h.hubReturn;
    nextButton.style.visibility = "visible";
  } else {
    nextButton.textContent = state.step === steps.length ? t.restart : t.next;
    nextButton.style.visibility = "visible";
  }

  document.documentElement.lang = { ko: "ko", en: "en", zh: "zh-CN", vi: "vi" }[currentLang()] || "ko";
  if (state.step >= 3 && state.showHub) {
    renderHub();
  } else {
    [renderBasic, renderVisa, renderReadiness, renderResults, renderDashboard, renderInsurance, renderRemittance][state.step - 1]();
  }
  renderAiHelper();
  // 새로고침 없는 SPA라, 실제로 "다음 단계 페이지로 이동"할 때만 맨 위로 스크롤한다.
  // 보험카드 토글·Q&A 전송·입력값 변경처럼 같은 화면 안에서의 상호작용은 스크롤을 건드리지 않는다.
  if (scrollTop) window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ============================================================
   Step2 이후 허브 화면
   요청사항 5: "체류기간(Step2) 입력까지만 순서대로 받고, 나머지는 버튼처럼 선택"
   → Step1·2는 기존처럼 순서대로 진행하고, Step2를 마치면 허브 화면에서
     [계좌·은행 확인 / 대시보드 / 보험관리 / 송금비교] 4개를 자유롭게 선택한다.
   ============================================================ */

const HUB_I18N = {
  ko: { eyebrow: "체류 정보 확인 완료", title: "다음으로 확인하고 싶은 화면을 선택하세요.", lead: "순서와 상관없이 원하는 화면부터 볼 수 있어요. 왼쪽 목록에서도 언제든 다시 이동할 수 있어요.", hubReturn: "허브로 돌아가기",
    items: [
      { key: "bank", step: 3, title: "은행 추천·비교", desc: "보유 서류를 확인하고 은행별 비교 결과를 봐요." },
      { key: "dash", step: 5, title: "내 준비 현황", desc: "계좌 개설 상태와 오늘 할 일을 한눈에 확인해요." },
      { key: "ins", step: 6, title: "보험관리", desc: "출국만기·귀국비용보험 청구기한을 확인해요." },
      { key: "remit", step: 7, title: "송금 비교", desc: "국가별 송금 채널 수수료를 비교해요." },
    ] },
  en: { eyebrow: "Residence info complete", title: "Choose what you'd like to check next.", lead: "You can visit these in any order. You can also switch anytime from the list on the left.", hubReturn: "Back to menu",
    items: [
      { key: "bank", step: 3, title: "Bank Recommendation & Comparison", desc: "Check your documents and compare banks." },
      { key: "dash", step: 5, title: "My Progress", desc: "See your account status and today's tasks at a glance." },
      { key: "ins", step: 6, title: "Insurance", desc: "Check departure & return-cost insurance claim deadlines." },
      { key: "remit", step: 7, title: "Remittance Comparison", desc: "Compare remittance channel fees by country." },
    ] },
  zh: { eyebrow: "居留信息确认完成", title: "请选择接下来想查看的页面。", lead: "无需按顺序，可以先看您想看的页面。也可以随时在左侧列表中切换。", hubReturn: "返回菜单",
    items: [
      { key: "bank", step: 3, title: "银行推荐·比较", desc: "确认已有材料并比较各银行结果。" },
      { key: "dash", step: 5, title: "我的进度", desc: "一目了然地查看开户状态和今日待办。" },
      { key: "ins", step: 6, title: "保险管理", desc: "确认出国满期·归国费用保险的申领期限。" },
      { key: "remit", step: 7, title: "汇款比较", desc: "按国家比较汇款渠道手续费。" },
    ] },
  vi: { eyebrow: "Đã hoàn tất thông tin cư trú", title: "Hãy chọn màn hình bạn muốn xem tiếp theo.", lead: "Bạn có thể xem theo bất kỳ thứ tự nào. Cũng có thể chuyển màn hình bất cứ lúc nào từ danh sách bên trái.", hubReturn: "Quay lại menu",
    items: [
      { key: "bank", step: 3, title: "Gợi ý & so sánh ngân hàng", desc: "Kiểm tra giấy tờ và so sánh kết quả theo ngân hàng." },
      { key: "dash", step: 5, title: "Tiến độ của tôi", desc: "Xem nhanh trạng thái mở tài khoản và việc cần làm hôm nay." },
      { key: "ins", step: 6, title: "Quản lý bảo hiểm", desc: "Kiểm tra hạn yêu cầu bảo hiểm mãn hạn·chi phí hồi hương." },
      { key: "remit", step: 7, title: "So sánh chuyển tiền", desc: "So sánh phí kênh chuyển tiền theo quốc gia." },
    ] },
};

function renderHub() {
  const h = HUB_I18N[currentLang()] || HUB_I18N.ko;
  screen.innerHTML = `
    <p class="eyebrow">${h.eyebrow}</p>
    <h1>${h.title}</h1>
    <p class="lead">${h.lead}</p>
    <div class="hub-grid">
      ${h.items.map((item) => `
        <button type="button" class="hub-card" data-hub-step="${item.step}">
          <span class="hub-card-title">${item.title}</span>
          <span class="hub-card-desc">${item.desc}</span>
          <span class="hub-card-go">${currentLang() === "ko" ? "바로가기 →" : currentLang() === "en" ? "Go →" : currentLang() === "zh" ? "前往 →" : "Đi tới →"}</span>
        </button>
      `).join("")}
    </div>
  `;
  screen.querySelectorAll("[data-hub-step]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.step = Number(btn.dataset.hubStep);
      state.showHub = false;
      render(true);
    });
  });
}

/* Step 번호별로 "이전" 버튼을 눌렀을 때 어디로 돌아갈지 결정.
   허브를 통해 자유롭게 진입하는 3·5·6·7은 허브로 돌아가고, 4(은행결과)는 3(금융준비)으로 돌아간다. */
function goBackFromStep(step) {
  if (step === 2) { state.step = 1; return; }
  if (step === 4) { state.step = 3; state.showHub = false; return; }
  if (step >= 3) { state.step = 3; state.showHub = true; return; }
}

backButton.addEventListener("click", () => {
  if (state.showHub) { state.step = 2; state.showHub = false; render(true); return; }
  if (state.step > 1) { goBackFromStep(state.step); render(true); }
});
nextButton.addEventListener("click", () => {
  if (state.step === 1) {
    state.step = 2; // Step1 → Step2는 기존처럼 순서대로
  } else if (state.step === 2) {
    state.step = 3;
    state.hubUnlocked = true;
    state.showHub = true;
  } else if (state.showHub) {
    // 허브 화면에서는 카드를 눌러 이동하는 것이 기본이지만, 다음 버튼도 안전하게 허브를 유지한다.
    state.showHub = true;
  } else if (state.step === 3) {
    state.step = 4; // 금융준비 → 은행결과는 기존처럼 순서대로
  } else if (state.step === steps.length) {
    state.step = 1;
    state.showHub = false;
    state.hubUnlocked = false;
  } else {
    // 4(은행결과)·5(대시보드)·6(보험관리)에서 "다음"은 허브로 돌아간다(자유 선택 구조이므로).
    state.step = 3;
    state.showHub = true;
  }
  render(true);
});

render();
