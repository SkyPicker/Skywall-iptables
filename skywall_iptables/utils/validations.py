import re
from aiohttp.web import HTTPBadRequest


def is_number(value, max):
    if not re.match(r'^(0|[1-9][0-9]*)$', value): # We don't want octal
        return False
    if int(value) > max:
        return False
    return True

def is_port(value):
    if not is_number(value, 65535):
        return False
    return True

def is_ip(value):
    parts = value.split('.')
    if len(parts) != 4:
        return False
    for part in parts:
        if not is_number(part, 255):
            return False
    return True

def is_ip_range(value):
    parts = value.split('/')
    if len(parts) != 2:
        return False
    if not is_ip(parts[0]):
        return False
    if not is_number(parts[1], 32):
        return False
    return True


def validate_iface(value):
    if value and not re.match(r'^\w+$', value):
        raise HTTPBadRequest(reason='Invalid iface')
    return value

def validate_source(value):
    if value and not is_ip(value) and not is_ip_range(value):
        raise HTTPBadRequest(reason='Invalid source')
    return value

def validate_destination(value):
    if value and not is_ip(value) and not is_ip_range(value):
        raise HTTPBadRequest(reason='Invalid destination')
    return value

def validate_service(value):
    if value and not is_port(value):
        raise HTTPBadRequest(reason='Invalid service')
    return value

def validate_action(value):
    if value not in ['ACCEPT', 'DROP']:
        raise HTTPBadRequest(reason='Invalid action')
    return value
