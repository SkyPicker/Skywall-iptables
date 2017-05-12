from skywall.core.reports import AbstractReport, register_report


@register_report
class HostnameReport(AbstractReport):
    name = 'sample'
    label = 'Sample'

    def __init__(self):
        self.counter = 0

    def collect(self):
        self.counter += 1
        return 'sample {}'.format(self.counter)
