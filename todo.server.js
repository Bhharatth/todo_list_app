const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
// const { join } = require("path"); 
const path =  require("path")
const app = express();
app.use(bodyParser.json());

// function findIndex(arr, id) {
//   for (let i = 0; i <= arr.lenght; i++) {
//     if (arr[i].id === id) {
//       return i;
//     }else{
//         return -1;
//     }
// }
// }
function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return i;
    }
    return -1;
  }
  

function removeAtIndex(arr, index) {
  let updatedArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) {
      updatedArray.push(arr[i]);
    }
  }
  return updatedArray;
}


app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/todos/:id", (req, res) => {
    fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.status(201).json(todos[todoIndex]);
    }
  });
});


app.post("/todos", (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000),
    title: req.body.title,
    description: req.body.description,
  };

  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const todos = JSON.parse(data);
    todos.push(newTodo);

    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);

    const index = findIndex(todos, parseInt(req.params.id));

    if (index === -1) {
      res.status(404).send();
    } else {
      const updatedTodo = {
        id: todos[index].id,
        title: req.body.title,
        description: req.body.description,
      };
      todos[index] = updatedTodo;

      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(201).json(updatedTodo);
      });
    }
  });
});

app.delete("/todos/:id", (req, res) => {

  fs.readFile("todos.json","utf-8", (err, data) => {
    if (err) throw err;
    let todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));

    if (todoIndex === -1) {
      res.status(404).send("error");
    }else{
        todos = removeAtIndex(todos, todoIndex);

        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
          if (err) throw err;
          res.status(201).json("success");
        });

    }
   
  });
});

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, "index.html"));
})

app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(3000);

module.exports = app;
