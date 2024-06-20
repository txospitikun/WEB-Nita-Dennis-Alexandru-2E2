var http = require('http');
const url = require('url');
var querystring = require('querystring');

const authentification_worker = require('./workers/auth_worker.js');
const user_worker = require('./workers/user_worker.js');

http.createServer((req, res) =>
{
     // Add CORS headers
     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include Authorization
 
     // Handle preflight requests
     if (req.method === 'OPTIONS') {
         res.writeHead(204);
         res.end();
         return;
     }

    if (req.url.startsWith('/api')) 
    {
        req.url = req.url.slice(4);
    } 
    else 
    {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Request not found!');
        return;
    }
   
    const parsedUrl = url.parse(req.url, true);

    switch (req.method)
    {
        case 'POST':
            switch (parsedUrl.pathname)
            {
                case '/register':
                    authentification_worker.handle_register(req, res);
                    break;
                case '/login':
                    authentification_worker.handle_login(req, res);
                    break;
                case '/load_user':
                    user_worker.loadUser(req, res);
                    break;
                case '/insert_children':
                    user_worker.insertChildren(req, res);
                    break;
                case '/insert_feeding_entry':
                    user_worker.insertFeedingEntry(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'GET':
            switch(parsedUrl.pathname)
            {
                case '/get_user_children':
                    user_worker.loadSelfChildren(req, res);
                    break;
                case '/get_feeding_entry':
                    user_worker.getFeedingEntry(req, res);
                    break;
                case '/get_feeding_entries_by_date':
                    user_worker.getFeedingEntriesByDate(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
        case 'PUT':
            switch(parsedUrl.pathname)
            {
                case '/edit_feeding_entry':
                    user_worker.editFeedingEntry(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;

        case 'DELETE':
            switch(parsedUrl.pathname)
            {
                case '/delete_feeding_entry':
                    user_worker.deleteFeedingEntry(req, res);
                    break;
                default:
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
            }
            break;
    }
}
).listen(5000);
console.log("Server has started!");

