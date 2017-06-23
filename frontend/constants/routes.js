// API routes
export const API_RULESET_LIST = '/iptables/rulesets'
export const API_RULESET_UPDATE = '/iptables/rulesets/:rulesetId'
export const API_RULE_ADD = '/iptables/rules'
export const API_RULE_UPDATE = '/iptables/rules/:ruleId'
export const API_RULE_DELETE = '/iptables/rules/:ruleId'
export const API_RULE_MOVE_BEFORE = '/iptables/rules/:ruleId/before/:beforeId'
export const API_RULE_MOVE_AFTER = '/iptables/rules/:ruleId/after/:afterId'

// Frontend routes
export const RULESET_LIST = '/iptables/rulesets'
export const RULESET_DETAIL = '/iptables/rulesets/:rulesetId'
export const SAMPLE = '/sample'
