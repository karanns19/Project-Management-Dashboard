// Libraries
const express = require('express');
const mongoose = require('mongoose');
const cors =  require('cors');

// App Config
const app = express();
app.use(express.json());
app.use(cors());

// DB Connection
mongoose.connect("mongodb://localhost:27017/mern", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("Connected to DB")).catch(console.error);

// Fetch Model Schema
const model = require('./models/model');

// APIs

// API to get Tasks
app.get('/tasks', async(req, res) => {
    const tasks = await model.find();
    res.json(tasks);
});

// API to post Tasks
app.post('/task/new', async(req,res)=>{
    const task = new model({
        task: req.body.task
    });
    task.save();
    res.json(task)

})

// API to delete tasks by id
app.delete('/task/delete/:id', async(req,res)=>{
    const result = await model.findByIdAndDelete(req.params.id)
    res.json(result);
})

// API to complete tasks by id
app.put('/task/complete/:id', async(req,res)=>{
    const task = await model.findById(req.params.id)
    task.status = !task.status

    task.save()
    res.json(task)
})

// App Listen
app.listen(3001, () => console.log("Server started on port 3001"));