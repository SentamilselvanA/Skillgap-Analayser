const LEVEL_WEIGHT = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

// Weighted scoring:
// - If user has a required skill:
//    credit = levelWeight/3  (Beginner 0.33, Intermediate 0.66, Advanced 1.0)
// - Missing: 0
export function compareSkills(userSkills, roleSkills) {
  const userMap = new Map(
    userSkills.map((s) => [s.name.toLowerCase().trim(), s.level])
  );

  const matchedDetailed = [];
  const missing = [];

  let earned = 0;
  let total = roleSkills.length; // each role skill weight = 1

  for (const roleSkill of roleSkills) {
    const key = roleSkill.toLowerCase().trim();
    const level = userMap.get(key);

    if (!level) {
      missing.push(roleSkill);
      continue;
    }

    const lw = LEVEL_WEIGHT[level] ?? 0;
    const credit = lw / 3; // 0 to 1
    earned += credit;

    matchedDetailed.push(`${roleSkill} (${level})`);
  }

  const score = total === 0 ? 0 : Math.round((earned / total) * 100);

  // Keep old fields too (for compatibility)
  const matched = matchedDetailed.map((x) => x.split(" (")[0]);

  return {
    matched,
    matchedDetailed,
    missing,
    score,
    earned: Number(earned.toFixed(2)),
    total,
  };
}






// export function compareSkills(userSkills, roleSkills) {
//   const user = userSkills.map((s) => s.name.toLowerCase().trim());
//   const role = roleSkills.map((s) => s.toLowerCase().trim());

//   const matched = roleSkills.filter((rs) => user.includes(rs.toLowerCase().trim()));
//   const missing = roleSkills.filter((rs) => !user.includes(rs.toLowerCase().trim()));

//   const score = role.length === 0 ? 0 : Math.round((matched.length / role.length) * 100);
//   return { matched, missing, score };
// }
