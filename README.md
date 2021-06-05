### How to Run

```
npm i
npm start
# only dev command is added in package.json
```

### API

```
/signup

- expected post body {username: "", "password": "", "role": ""}

/login
- expected post body {username: "", "password": ""}


/register-using-admin
- expected post body {username: "", "password": "", "role": ""}
- required header - {Authorization: "YOUR JWT TOKEN"}
```

### Some Comments

This project itself is bootstrapped from one of my open source projects written for express framework.

https://github.com/faysal515/express-production/

JEST has been configured, but test cases are written just for the illustration purpose. need few more test cases to cover






### Logging
My preferred logging format is

`timestamp [function name] logging level: message - stringified arguments`

Adding function name/label in the logs helps me search quickly in log files.
