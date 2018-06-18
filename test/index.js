const http = require('http')
const fs = require('fs')
const del = require('del')

const TESTS = [
    {
        route: '/',
        check: data => log(data.success, 'routes/get', 'Load JSON')
    },
    {
        route: '/posts',
        check: data => log(data.success, 'posts/get', 'Load JSON')
    },
    {
        route: '/posts/1',
        check: data => log(data.success, 'post/get', 'Load JSON')
    },
]

function start()
{
    const code = Math.round(Math.random() * 0xFFFFFFFF).toString(16)
    const dataRep = 'data-test-' + code
    let originalConfig = false

    if (fs.existsSync('./' + dataRep)) {
        log(false, 'content file', './' + dataRep + ' always exist')
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
    
    run(0, () =>
    {
        fs.unlinkSync('./api/config.php')

        if (originalConfig) {
            fs.renameSync(originalConfig, './api/config.php')
        }
        
        del.sync(['./api/' + dataRep])

        console.log(' ')
        console.log(
            '[ ok ] ',
            'all tests finished'
        )
    })
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
        send(currentTest.route, data => {
            currentTest.check(data)
            run(num + 1, onEnd)
        })
    }
}

start()




// -------------------
// HELPERS
// -------------------

function log(success, subject, title)
{
    if (success)
    {
        console.log(
            '[ ok ] ',
            subject + ' '.repeat(10 - subject.length),
            title
        )
    }
    else
    {
        console.log(
            '[fail] ',
            subject + ' '.repeat(10 - subject.length),
            title
        )
    }
}

function send(url, callback, method = 'get')
{
    var options = {
        hostname: 'inspire.local',
        port: '80', // app.get('port'),
        path: '/api' + url,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }
      
    var req = http.request(options, function(res)
    {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            callback(JSON.parse(data))
            // console.log(data); // I can't parse it because, it's a string. why?
        })
    })

    req.on('error', function(e) {
        callback('problem with request', '(' + url + ')', e.message)
        // console.log('problem with request: ' + e.message);
    })

    req.end()
}