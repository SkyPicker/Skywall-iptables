

export const rulesetLabel = (ruleset) => {
  if (!ruleset) return null
  return ruleset.name || 'Unnamed ruleset'
}
