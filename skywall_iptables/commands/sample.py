from skywall.core.signals import Signal
from skywall.core.commands import AbstractCommand, register_command
from skywall_iptables.signals import sample_signal


@register_command
class SampleCommand(AbstractCommand):
    name = 'sample'
    help = 'Sample Skywall module command'
    before_run = Signal('SampleCommand.before_run')
    after_run = Signal('SampleCommand.after_run')

    def run(self, args):
        print('This is sample Skywall module command')
        sample_signal.emit(value=args)
