# Table of contents

* [Requirements](#Requirements)
* [Installation](#Installation)
* [Usage](#Usage)
    * [How to set up voice system](#How-to-set-up-voice-system)  

# Requirements

* node.js v12.19.0
* discord.js ^12.5.1
* Apache cassandra 3.3 - 4.0

# Installation

Clone

```bash
$ git clone https://github.com/SaintMiner/uno-chi.git
```

Install packages

```bash
$ npm i
```

Run

```
$ npm run start

# on development
$ npm run dev
```

# Usage
### How to set up voice system

1) Set the alert channel

```conf
>guild set channel -alert <Text channel ID>

# to remove use 
>guild set channel -alert 0
```

2) Set the rooms which will give experience
```conf
>voice room create -id <Voice channel ID> -exp <XP amount per 9 seconds> -mining <voicepoints amount per hour>

# to check voice room
>voice room info <channel id>
# to remove voice room
>voice room remove <channel id>
```

3) Set the levels on which users will get their roles
```conf
>voice level create -level <Level> -add <Roles> -remove <Roles>
# Level formula: (10 + level) * 10 * level * level

# to view all levels and his roles
>voice level
# to remove level
>voice level remove <id>
```

0) You can change language 
```conf
>guild set language <language>
# Availabled: [ en, ru ]
```

0) You can give manualy voicepoints or voicexp to your members
```conf
>voice add voicepoints @person <amount>
>voice add voicexp @person <amount>
# negative numbers also supported
```

0) Get info
```conf
>info
>info @person
>top voicepoints/voicelevel/time/textlevel (default: voicelevel)

# Voice points are used for subextensions like gamble
# Voice points Formula: 10 * level on each level up (1 level = +10, 2 level = +20)
```