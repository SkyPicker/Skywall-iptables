# Skywall Iptables module

Skywall module to configure iptables.

## Server installation

First [install and configure Skywall server](https://github.com/SkyPicker/Skywall#skywall-server).
Then to enable this module run as `skywall` user:

```
$ cd /opt/skywall
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall-iptables.git
(env) $ skywall set --modules skywall_iptables
(env) $ skywall install
```

To disable the module run:

```
(env) $ skywall set --modules ~skywall_iptables
```

## Client installation


First [install and configure Skywall client](https://github.com/SkyPicker/Skywall#skywall-client).
Then to enable this module run as `skywall` user:

```
$ cd /opt/skywall
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall-iptables.git
(env) $ skywall set --modules skywall_iptables
```

Skywall iptables module needs to `sudo /sbin/iptables` in order to save configured iptable rules.
To let the module do it run `sudo visudo` and add the following line:

```
skywall ALL=NOPASSWD: /sbin/iptables
```

To disable the module run:

```
(env) $ skywall set --modules ~skywall_iptables
```

### Configuration

#### Dry run mode

I you want to just see what the module would do instead of actually saving any iptable rules
anywhere, you can enable `dryrun` mode:

```
(env) $ skywall set --iptables.dryrun True
```

To disable `dryrun` mode run:

```
(env) $ skywall set --iptables.dryrun False
```

## Instructions for developers

### Installing the module form the repository as part of the server

```
$ git clone https://github.com/SkyPicker/Skywall-iptables.git skywall-iptables
$ cd skywall-iptables
$ virtualenv --python=/usr/bin/python3 env
$ pwd > $(echo env/lib/python*/site-packages)/local.pth
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall.git
(env) $ pip install -r requirements.txt
(env) $ nodeenv -p --node=7.7.4
(env) $ npm install
(env) $ ln -s .. node_modules/skywall_iptables
(env) $ skywall set --modules skywall_iptables
(env) $ skywall install
```

If you want to enable some other modules, run:

```
(env) $ pip install MODULE
(env) $ skywall set --modules MODULE
(env) $ skywall install
```

### Installing the module form the repository as part of the client

```
$ git clone https://github.com/SkyPicker/Skywall-iptables.git skywall-iptables
$ cd skywall-iptables
$ virtualenv --python=/usr/bin/python3 env
$ pwd > $(echo env/lib/python*/site-packages)/local.pth
$ . env/bin/activate
(env) $ pip install git+https://github.com/SkyPicker/Skywall.git
(env) $ pip install -r requirements.txt
(env) $ skywall set --modules skywall_iptables
```

If you want to enable some other modules, run:

```
(env) $ pip install MODULE
(env) $ skywall set --modules MODULE
```

### Configuration

Follow general configuration instructions for the
[server](https://github.com/SkyPicker/Skywall#configuration) and the
[client](https://github.com/SkyPicker/Skywall#configuration-1).

#### Dry run mode

During development you may not want to actually save any iptable rules anywhere. To achieve this
just enable `dryrun` mode:

```
(env) $ skywall set --iptables.dryrun True
```

### Running server in developement mode

To run your server in the developement mode with frontend hot-reload you need to enable it:

```
(env) $ skywall set --devel true
```

And then run your server (without manually building it, it will build itself):

```
(env) $ skywall server
```

This option will enable various debug messages and it will automatically reload the frontend app
whenever you change some code in it.

### Running client

Client has no developement mode yet. Just run:

```
(env) $ skywall client
```

### Pylint and Eslint

Before commiting your code it's a good babit to lint it:

```
(env) $ npm run eslint
(env) $ npm run pylint
```
