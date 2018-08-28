const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const del = require('del')

const users = [
    {
        mail: 'motoko@kusanagi.jp',
        name: 'Motoko',
        role: 4
    },
    {
        mail: 'dva@overwatch.ko',
        name: 'D.Va',
        role: 3
    },
    {
        mail: 'lara@croft.uk',
        name: 'Lara',
        role: 2
    },
    {
        mail: 'dolphin@animals.com',
        name: 'Dolphin',
        role: 1
    }
]

const DEBUG = false
const TESTS = [
    {
        route: '/',
        check: data => logTest(data.success, 'routes/get', 'Load JSON', data)
    },
    {
        route: '/posts',
        check: data => logTest(data.success, 'posts/get', 'Load JSON', data)
    },
    {
        route: '/posts/1',
        check: data => logTest(!data.success, 'post/get', 'Try bad post', data)
    },
    {
        route: '/users/add',
        post: () => ({ name: users[0].name }),
        check: data => logTest(!data.success, 'users/add', 'Check user mail', data)
    },
    {
        route: '/users/add',
        post: () => (Object.assign(users[0], {returnPass: true})),
        check: data =>
        {
            users[0].pass = data.data.pass
            logTest(data.success && data.data.pass, 'users/add', 'Add first user', data)
        }
    },
    {
        route: '/users/add',
        post: () => (Object.assign(users[1], {returnPass: true})),
        check: data =>
        {
            logTest(!data.success, 'users/add', 'Can not add user if not connected', data)
        }
    },
    {
        route: '/auth/signin',
        post: () => ({ mail: users[0].mail, pass: 'bad password' }),
        check: data => logTest(!data.success, 'auth/signin', 'Try with bad password', data)
    },
    {
        route: '/auth/signin',
        post: () => ({ mail: 'bad email', pass: users[0].pass }),
        check: data => logTest(!data.success, 'auth/signin', 'Try with bad email', data)
    },
    {
        route: '/auth/signin',
        post: () => ({ mail: users[0].mail, pass: users[0].pass }),
        check: data =>
        {
            token = data.data.token.signature
            logTest(data.success && data.data.token, 'auth/signin', 'Sign in', data)
        }
    },
    ...users.filter((user, i) => i > 0).map((user, i) => ({
        route: '/users/add',
        post: () => (Object.assign(user, { returnPass: true })),
        check: data =>
        {
            users[i].pass = data.data.pass
            const role = ['guest', 'subscriber', 'author', 'editor', 'admin'][user.role]
            logTest(data.success && data.data.pass, 'users/add', 'Add ' + role, data)
        }
    })),
    {
        route: '/users',
        check: data =>
        {
            logTest(data.success && data.data.length === users.length, 'users', 'Get user list (connected)', data)
        }
    },
    {
        route: '/auth/signout',
        check: data =>
        {
            logTest(data.success, 'auth/signout', 'Sign out', data)
        }
    },
    {
        route: '/users',
        check: data =>
        {
            token = ''
            logTest(!data.success, 'users', 'Get user list (bad token)', data)
        }
    }
]

let pass = []
let token = ''
let testSuccess = 0
let testFailed = 0
let end = () => {}
let testNum = 0

function start()
{
    console.log('\n         START TESTS (API only) : ' + TESTS.length + '\n')

    const code = Math.round(Math.random() * 0xFFFFFFFF).toString(16)
    const dataRep = 'data-test-' + code
    let originalConfig = false

    if (fs.existsSync('./' + dataRep)) {
        logTest(false, 'content file', './' + dataRep + ' always exist')
        return
    }

    if (fs.existsSync('./api/config.php')) {
        originalConfig = './api/config.' + code + '.php'
        fs.renameSync('./api/config.php', originalConfig)
    }

    {
        const content = fs.readFileSync('./api/config.sample.php')
            .toString()
            .replace('/data', '/' + dataRep)
        fs.writeFileSync('./api/config.php', content)
    }

    end = () =>
    {
        fs.unlinkSync('./api/config.php')

        if (originalConfig) {
            fs.renameSync(originalConfig, './api/config.php')
        }
        
        del.sync(['./api/' + dataRep])

        console.log('\n -', testSuccess, 'success', '/', TESTS.length, 'total')
        console.log(' -', testFailed, 'failed')
        console.log(' -', TESTS.length - (testSuccess + testFailed), 'avoided')
        console.log('\n         END TESTS\n\n')
    }
    
    run(0, end)
}

function run(num = 0, onEnd = () => { })
{
    if (num > TESTS.length - 1)
    {
        onEnd()
    }
    else
    {
        const currentTest = TESTS[num]
        send(currentTest.route, data =>
        {
            try
            {
                currentTest.check(data)
                run(num + 1, onEnd)
            }
            catch(e)
            {
                logTest(false, 'check', e.message, data)
                onEnd()
            }
            
        }, currentTest.post ? currentTest.post() : false)
    }
}

start()




// -------------------
// HELPERS
// -------------------

function logTest(success, subject, title, message = '')
{
    testNum++
    const num = ' ' + '0'.repeat(String(TESTS.length).length - String(testNum).length) + testNum + ' '
    const rest = Math.max(15 - subject.length, 1)
    if (success)
    {
        testSuccess++
        console.log(
            num,
            '[ ok ] ',
            subject + ' '.repeat(rest),
            title
        )
    }
    else
    {
        testFailed++
        console.log(
            num,
            '[fail] ',
            subject + ' '.repeat(rest),
            title
        )
    }

    if (DEBUG)
    {
        console.log(
            '       ',
            message,
            '\n'
        )
    }
}

function send(url, callback, postData = false)
{
    const options = {
        hostname: 'inspire.local',
        port: '80', // app.get('port'),
        path: '/api' + url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (token != '') {
        options.headers['X-Access-Token'] = token
    }

    let postQuery
    if (postData) {
        postQuery = querystring.stringify(postData || {})
        options.method = 'POST'
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        options.headers['Content-Length'] = Buffer.byteLength(postQuery)
    }
      
    const req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            try {
                callback(JSON.parse(data))
            } catch(e) {
                logTest(false, 'parsing error', data, e.message)
                end()
            }
        })
    })

    req.on('error', function(e) {
        logTest(false, 'problem with request', '(' + url + ')', e.message)
        end()
    })

    if (postData) {
        req.write(postQuery)
    }

    req.end()
}