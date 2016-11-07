"use strict";
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const originPath = './public';
let todos = [
				{
					id: Math.random() + '',
					message: "Message 1",
					completed: false
				},
				{
					id: Math.random() + '',
					message: "Message 2",
					completed: false
				}];

const httpServer = http.createServer(function(req, res){
 	const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);
    const method = req.method;

	if(req.url==="/")
	{
		req.url="/index.html"; //if req.url emtpy redirect to "/index.html"
	}
	 if(method === 'GET') {
        if(req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let localTodos = todos;

            if(parsedQuery.searchtext) {
            	if(parsedQuery.searchtext === ""){
            		return res.end(JSON.stringify({items : localTodos}));
            	} else {
                localTodos = localTodos.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }
            }
            return res.end(JSON.stringify({items : localTodos}));
        }
    }
    if(method === 'PUT') {
        if(req.url.indexOf('/todos') === 0) {
            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body); // now that we have the content, convert the JSON into an object

                // find the todo in our todos array and replace it with the new object
                for(let i = 0; i < todos.length; i++) {
                    if(todos[i].id === (jsonObj.id)) { // found the same object
                    	
                        todos[i] = jsonObj; // replace the old object with the new object
                        res.setHeader('Content-Type', 'application/json');
                        res.statusCode = 200;
                        return res.end(JSON.stringify(jsonObj));
                    }
                } 
					res.statusCode = 404;
                	return res.end('Data was not found and can therefore not be updated');
                

            });
            return;
        }
    }
    if(method === 'POST') {
        if(req.url.indexOf('/todos') === 0) {

            // read the content of the message
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                let jsonObj = JSON.parse(body);  // now that we have the content, convert the JSON into an object
                jsonObj.id = Math.random() + ''; // assign an id to the new object
                todos[todos.length] = jsonObj;   // store the new object into our array (our 'database')

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(jsonObj));
            });
            return;
        }
    }
    if(method === 'DELETE') {
        if(req.url.indexOf('/todos/') === 0) {
            let id =  req.url.substr(7);
            for(let i = 0; i < todos.length; i++) {
                if(id === todos[i].id) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('Successfully removed');
                }
            }
            res.statusCode = 404;
            return res.end('Data was not found');
        }
    }
	const fileLocation = path.join(originPath, req.url);
		fs.readFile(fileLocation, function(err, data){
			if(err){
				res.writeHead(404, 'File not found');
				res.write('404: Sorry file not found');
				return res.end();
			}	else{
				res.statusCode = 200;
				return res.end(data);
			}
		});
	

	});

httpServer.listen(80);