from skywall.core.settings import IntegerSetting, register_setting

@register_setting
class SampleSetting(IntegerSetting):
    name = 'sample'
    help = 'Sample Skywall module setting (Default: 47)'

    def default(self):
        return 47
