# Passwd as a Service
This program creates a minimal HTTP service that exposes the user and group information on a UNIX-like system, that is usually locked away in the UNIX `/etc/passwd` and `/etc/groups` files.

# Requirements
* Paths to `passwd` and `groups` file should be configurable, defaulting to standard system path
* If input files are absent or malformed, servie must indicate an appropriate error
* Service should be able to handle changes in the underlying passwd and groups files while the service is running

# Terminal commands
* `npm run dev` - Fires up a nodemon process of the server to run it indefinitely
* `npm test` - Run Mocha tests
* `npm run build` - Runs babel on the es6 code and compiles it into the `/compiled/` directory
* `npm run serve` - Runs the compiled code from `/compiled/`
* `npm run build+serve` - Combines the two previous commands

* `npm run dev --passwd /etc/passwd --groups /etc/groups` - Runs the nodemon process with custom passwd and/or groups files
* `npm run serve --passwd /etc/passwd --groups /etc/groups` - Runs the compiled js with custom passwd and/or groups files

# Routes:
* `GET /users` - List of all users in the system, as defined in /etc/passwd file
	* Example response: `[{“name”: “root”, “uid”: 0, “gid”: 0, “comment”: “root”, “home”: “/root”, “shell”: “/bin/bash”},  {“name”: “dwoodlins”, “uid”: 1001, “gid”: 1001, “comment”: “”, “home”:  “/home/dwoodlins”, “shell”: “/bin/false”}]`
* `GET /users/query[?name=<nq>][&uid=<uq>][&gid=<gq>][&comment=<cq>][&home=<hq>][&shell=<sq>]` - List of users matching all specified query fields. Each field is optional. Only exact matches are needed
	* Example Query: `GET /users/query?shell=%2Fbin%2Ffalse`
    * Example Response: `[{“name”: “dwoodlins”, “uid”: 1001, “gid”: 1001, “comment”: “”, “home”:“/home/dwoodlins”, “shell”: “/bin/false”}]`
* `GET /users/<uid>` - Get the user with the matching uid. Return a `404` if not found.
	* Example response: `{“name”: “dwoodlins”, “uid”: 1001, “gid”: 1001, “comment”: “”, “home”: “/home/dwoodlins”, “shell”: “/bin/false”}`
* `GET /users/<uid>/groups` - Return all groups for the given user
	* Example response: `[{“name”: “docker”, “gid”: 1002, “members”: [“dwoodlins”]}]`
* `GET /groups` - Return a list of all groups in the system, defined by `/etc/group`
	* Example response: `[{“name”: “_analyticsusers”, “gid”: 250, “members”: [“_analyticsd’,”_networkd”,”_timed”]}, {“name”: “docker”, “gid”: 1002, “members”: []}]`
* `GET /groups/query[?name=<nq>][&gid=<gq>][&member=<mq1>[&member=<mq2>][&...]]` - Returns a list of groups matching all of the specified query fields. Each field is optional.
	* The groups must contain ALL specified users
	* Example query: `GET /groups/query?member=_analyticsd&member=_networkd`
	* Example response: `[{“name”: “_analyticsusers”, “gid”: 250, “members”: [“_analyticsd’,”_networkd”,”_timed”]}]`
* `GET /groups/<gid>` - Returns a single group with gid. Return 404 if not found
	* Example response: `{“name”: “docker”, “gid”: 1002, “members”: [“dwoodlins”]}`