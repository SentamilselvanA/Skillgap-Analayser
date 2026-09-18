const LEVEL_WEIGHT = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function compareSkills(userSkills, roleSkills) {
  const userMap = new Map(
    userSkills.map((s) => [s.name.toLowerCase().trim(), s.level])
  );

  const matchedDetailed = [];
  const missing = [];

  let earned = 0;
  const total = roleSkills.length;

  for (const roleSkill of roleSkills) {
    const key = roleSkill.toLowerCase().trim();
    const level = userMap.get(key);

    if (!level) {
      missing.push(roleSkill);
      continue;
    }

    const lw = LEVEL_WEIGHT[level] ?? 0;
    const credit = lw / 3;
    earned += credit;

    // Bug fix: return objects {skill, level} so callers can use .skill and .level
    matchedDetailed.push({ skill: roleSkill, level });
  }

  const score = total === 0 ? 0 : Math.round((earned / total) * 100);
  const matched = matchedDetailed.map((x) => x.skill);

  return {
    matched,
    matchedDetailed,
    missing,
    score,
    earned: Number(earned.toFixed(2)),
    total,
  };
}
