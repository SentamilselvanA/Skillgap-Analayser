export function compareSkills(userSkills, roleSkills) {
  const user = userSkills.map((s) => s.name.toLowerCase().trim());
  const role = roleSkills.map((s) => s.toLowerCase().trim());

  const matched = roleSkills.filter((rs) => user.includes(rs.toLowerCase().trim()));
  const missing = roleSkills.filter((rs) => !user.includes(rs.toLowerCase().trim()));

  const score = role.length === 0 ? 0 : Math.round((matched.length / role.length) * 100);
  return { matched, missing, score };
}
