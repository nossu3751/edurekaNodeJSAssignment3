const express = require('express');
const request = require('request');
const path = require('path');

const app = express();
const port = 8000;

const router  = express.Router();
const fs = require('fs');
const { ENOBUFS } = require('constants');


// Question 1

app.get("/employee", (req, res)=>{
    let employees = getEmployees();

    employees.then((result)=>{
        res.send(JSON.stringify(result));
    })
})

app.get("/employee/:id", (req,res)=>{
    let id = parseInt(req.params.id);

    let employeeData = getEmployees();
    employeeData.then((result)=>{

        let employee = result.find(
            (e)=>(e.id == id)
        );
        if(employee === undefined){
            res.send("No such employee found!");
        }else{
            res.send(JSON.stringify(employee));
        }
    })
})

app.get("/project",(req,res)=>{
    let projects = getProjects();

    projects.then((result)=>{
        res.send(JSON.stringify(result));
    })
})

app.get("/project/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    
    let projectData = getProjects();
    projectData.then((result)=>{
        let project = result.find(
            (p) => (p.projectId == id)
        );
        if(project === undefined){
            res.send("No such project found!");
        }else{
            res.send(JSON.stringify(project));
        }
    })
})

app.get("/getemployeedetails",(req,res)=>{

    fetchEmployee().then((employees)=>{
        let employeeList = employees;
        fetchProject().then((projects)=>{
            for(let emp of employeeList){
                let projId = emp.projectId;
                let project = projects.find(
                    (p) => (p.projectId == emp.projectId)
                )
                emp["project"] = project;
                delete emp["projectId"];
            }
            res.send(JSON.stringify(employeeList));
        })
    })
})


fetchEmployee = () => {
    return new Promise((resolve)=>{
        request.get("http://localhost:" + port + "/employee", (err, res, body)=> {
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(body));
            }
        })
    })
}

fetchProject = () => {
    return new Promise((resolve)=>{
        request.get("http://localhost:" + port + "/project", (err, res, body)=>{
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(body));
            }
        })
    })
}


getProjects = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/db/project.json',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        })
    })
}


getEmployees = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./src/db/employee.json', (err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        })
    })
}


// Question 2

app.use(express.static(__dirname + "/public"));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const url = "http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees";

getEmployee = () => {
    return new Promise((resolve, reject)=>{
        request.get(url, (err, res, body)=> {
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(body));
            }
        })
    })
}

app.get('/', (req,res)=>{
    let employees = getEmployee();
    employees.then(
        (result)=>{
            res.render('main', {
                result,
                title:"EMPLOYEE LIST"
            })
        }
    )
})


app.listen(port,(error)=>{
    console.log('server is running on port' + port);
})

