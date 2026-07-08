import type { CoachResult, Intake, Stage1Profile, Stage2Diagnosis, Stage3Plan } from "./schemas";

export const sampleIntake: Intake = {
  species: "dog",
  breed: "柯基",
  ageText: "8个月",
  sex: "unknown",
  neutered: false,
  freeText: "我家柯基 8 个月，没绝育，我一出门它就在家嚎叫抓门，家具都咬坏了，买了玩具也没用，大概两周了",
  imageDataUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'%3E%3Crect width='640' height='420' fill='%23eee8dc'/%3E%3Crect x='60' y='25' width='180' height='370' rx='8' fill='%23b98b5f'/%3E%3Crect x='95' y='55' width='110' height='310' rx='5' fill='%23dfc3a2'/%3E%3Cg stroke='%235f3f2a' stroke-width='7' stroke-linecap='round'%3E%3Cpath d='M252 245 l42 -38'/%3E%3Cpath d='M258 278 l56 -26'/%3E%3Cpath d='M270 314 l48 -12'/%3E%3C/g%3E%3Ctext x='330' y='194' font-family='Arial,sans-serif' font-size='30' fill='%23315348'%3EDemo door frame marks%3C/text%3E%3C/svg%3E",
  imageName: "doorframe-bite-demo.jpg"
};

export const sampleStage1: Stage1Profile = {
  species: "dog",
  breed: "柯基",
  age_months: 8,
  neutered: false,
  primary_behavior: "分离焦虑",
  symptoms: ["独处时嚎叫", "抓门", "破坏家具"],
  triggers: ["主人出门", "独处超过30分钟"],
  already_tried: ["买了玩具但没用"],
  severity_signals: ["自残倾向: 无", "持续时长: 2周"],
  image_observations: "照片显示门框有抓咬痕迹"
};

export const sampleStage2: Stage2Diagnosis = {
  root_cause: {
    label: "分离焦虑",
    explain: "独处时出现的过度应激反应，不是报复或调皮。"
  },
  secondary_factors: [
    {
      label: "精力未释放",
      explain: "柯基精力旺盛，运动量不足会放大独处焦虑。"
    },
    {
      label: "离家信号过强",
      explain: "拿钥匙、穿外套等固定动作可能已经成为焦虑触发器。"
    }
  ],
  severity: "medium",
  medical_flag: {
    is_flagged: false,
    reason: null
  },
  confidence: "中等，建议补充独处时的录像进一步确认。"
};

export const sampleStage3: Stage3Plan = {
  plan_title: "柯基分离焦虑 6 周脱敏计划",
  goal: "让狗狗独处时保持平静，逐步延长可独处时间。",
  weeks: [
    {
      week: 1,
      theme: "建立安全区",
      daily_tasks: [
        {
          task: "在围栏或固定休息区内喂食，让它把这个区域和好事联系起来。",
          duration: "每天2次，每次10分钟",
          success: "主动进入并能安静吃完。"
        },
        {
          task: "主人在旁边读书或工作，不主动互动，让它练习独立待着。",
          duration: "每天1次，每次15分钟",
          success: "全程不持续嚎叫，不抓门。"
        }
      ],
      tools: ["零食", "狗窝或围栏", "耐咬玩具"]
    },
    {
      week: 2,
      theme: "降低离家信号敏感度",
      daily_tasks: [
        {
          task: "随机拿钥匙、穿外套后不出门，过30秒恢复正常活动。",
          duration: "每天5轮，每轮1分钟",
          success: "看到离家动作后仍能回到休息区。"
        },
        {
          task: "出门前5分钟保持低调，不做夸张告别。",
          duration: "每次离家前执行",
          success: "离家前没有明显跟随、喘气或抓门升级。"
        }
      ],
      tools: ["钥匙", "外套", "零食"]
    },
    {
      week: 3,
      theme: "短时离开练习",
      daily_tasks: [
        {
          task: "走到门外等待10到30秒再回来，回来后安静进屋。",
          duration: "每天6轮",
          success: "至少4轮能保持安静。"
        },
        {
          task: "离开前给一个可舔食玩具，回来后收起。",
          duration: "每天1次，每次5分钟",
          success: "注意力能回到玩具上。"
        }
      ],
      tools: ["漏食玩具", "酸奶或湿粮", "手机计时器"]
    },
    {
      week: 4,
      theme: "延长独处时间",
      daily_tasks: [
        {
          task: "把离开时间从1分钟逐步加到10分钟，只在上一档稳定后增加。",
          duration: "每天4轮",
          success: "连续2天在当前时长内没有抓门和持续嚎叫。"
        },
        {
          task: "离家前安排嗅闻游戏，让它先消耗精力。",
          duration: "每天1次，每次10分钟",
          success: "游戏结束后能主动喝水或休息。"
        }
      ],
      tools: ["零食", "毛巾或嗅闻垫", "计时器"]
    },
    {
      week: 5,
      theme: "接近日常离家",
      daily_tasks: [
        {
          task: "选择一天中真实会出门的时间练习15到30分钟独处。",
          duration: "每天1轮",
          success: "录像中前10分钟能自行安定下来。"
        },
        {
          task: "回家后等它四脚落地、情绪下降再互动。",
          duration: "每次回家执行",
          success: "回家兴奋时长逐步缩短。"
        }
      ],
      tools: ["手机录像", "零食", "耐咬玩具"]
    },
    {
      week: 6,
      theme: "巩固与复盘",
      daily_tasks: [
        {
          task: "每两天做一次30到60分钟独处练习，记录开始吠叫时间和恢复时间。",
          duration: "每两天1次",
          success: "恢复时间比第1周明显缩短。"
        },
        {
          task: "保留固定散步、嗅闻和休息节奏，避免突然大幅加长独处。",
          duration: "每天执行",
          success: "连续一周没有破坏家具升级。"
        }
      ],
      tools: ["记录表", "手机录像", "嗅闻垫"]
    }
  ],
  red_lines: [
    "出现啃咬到出血、撞门受伤等自残行为，立即停止自训并联系兽医或持证训犬师。",
    "出现攻击家人、访客或其他动物的升级行为，不要继续自行加压训练。",
    "连续6周执行仍无任何改善，建议转线下行为咨询。"
  ],
  disclaimer: "本计划为行为训练辅助，不替代兽医诊疗。"
};

export function buildMockCoachResult(input: Intake): CoachResult {
  const image_observations = input.imageDataUrl ? sampleStage1.image_observations : "未上传照片，建议补充门框或破坏痕迹照片辅助判断。";

  return {
    stage1: {
      ...sampleStage1,
      species: input.species,
      breed: input.breed || sampleStage1.breed,
      neutered: input.neutered,
      image_observations
    },
    stage2: sampleStage2,
    stage3: sampleStage3,
    mode: "mock",
    generatedAt: new Date().toISOString()
  };
}
