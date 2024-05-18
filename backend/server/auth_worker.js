var db_logic = require('./database_logic.js');
const database = require('./connection.js');
const json_worker = require('./json_worker.js');


async function handle_register(req, res) {
    let body = '';
    let registerResponse = 100;
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        let data = JSON.parse(body);
        if(data.password != data.register_confirm_password)
            registerResponse = 101;
        else
        {
            try
            {
                const client = await database.connect();
                const searchedUser = await db_logic.findUserByEmail(client, data["email"]);
                if(!json_worker.isEmpty(searchedUser))
                {
                    registerResponse = 102;
                }
                else
                {
                    console.log(await db_logic.insertUser(client, data["email"], data["password"], 0, 0));
                }
                client.release();
            } catch(err)
            {
                console.log("Error while registering user: ", err);
                register_response = 1;
            }
        }


        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({RegisterResponse: registerResponse}));
    });
}

async function handle_login(req, res)
{
    let body = '';
    let loginResponse = 110;
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        let data = JSON.parse(body);
        let userInfo = '';
        try
        {
            const client = await database.connect();
            const searchedUser = await db_logic.findUserByEmail(client, data["email"]);
            if(json_worker.isEmpty(searchedUser))
            {
                loginResponse = 111;
            }
            else if(searchedUser[0]["password"] != data["password"])
            {
                loginResponse = 111;
            }
            else
            {
                userInfo = searchedUser[0];
            }
            
            client.release();
        } catch(err)
        {
            console.log("Error while registering user: ", err);
            register_response = 1;
        }

        res.writeHead(200, {'Content-Type': 'application/json',});
        res.end(JSON.stringify({LoginResponse: loginResponse, UserInfo: userInfo}));
    });
}

module.exports = {handle_register, handle_login}