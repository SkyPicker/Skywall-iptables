import os
from setuptools import setup, find_packages


with open(os.path.join(os.path.dirname(__file__), 'requirements.txt')) as f:
    requirements = f.read().splitlines()

with open(os.path.join(os.path.dirname(__file__), 'README.md')) as f:
    readme = f.read()

setup(
    name='skywall-iptables',
    version='0.0.1',
    description='Skywall module to configure iptables.',
    long_description=readme,
    url='https://github.com/SkyPicker/Skywall-iptables',
    author='',
    author_email='',
    license='SEE LICENSE IN ./LICENSE',
    install_requires=requirements,
    packages=find_packages(),
    zip_safe=False,
    )
