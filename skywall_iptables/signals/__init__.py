from skywall.core.signals import Signal


sample_signal = Signal('sample_signal')


@sample_signal.connect
def sample_signal_listener(value):
    print('Received sample signal: {}'.format(value))
