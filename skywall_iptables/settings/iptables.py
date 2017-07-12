from skywall.core.settings import BooleanSetting, register_setting

@register_setting
class DryRunSetting(BooleanSetting):
    name = 'iptables.dryrun'
    help = "Don't change any iptables rules, just pretend changing them (Default: False)"

    def default(self):
        return False
