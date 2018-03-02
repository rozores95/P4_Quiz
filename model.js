const fs = require("fs");

const DB_FILENAME = "quizzes.json";


let quizzes = [
  {
    question:"capital de italia", answer:"roma"
  },
  {
    question:"capital de francia", answer:"paris"
  },
  {
    question:"capital de españa", answer:"madrid"
  },
  {
    question:"capital de portugal", answer:"lisboa"
  }
];

const load = () => {
  fs.readFile(DB_FILENAME, (err,data)=>{
    if(err){
      if(err.code === "ENOENT"){
        save();
        return;
      }
      throw err;
    }
    let json=JSON.parse(data);
    if(json){
      quizzes=json;
    }
  });
};

const save = () => {
  fs.writeFile(DB_FILENAME,
  JSON.stringify(quizzes),
  err=>{
    if(err) throw err;
  });
};

exports.count=()=> quizzes.length;

exports.add =(question,answer)=>{
  quizzes.push({
    question:(question || "").trim(),
    answer:(answer||"").trim()
  });
  save();
};

exports.update=(id,question,answer)=>{
  const quiz = quizzes[id];
  if(typeof quiz ==="undefined"){
    throw new Error('el valor id no es valido');
  }
  quizzes.splice(id, 1,{
   question:(question || "").trim(),
    answer:(answer||"").trim()
  });
  save();
};

exports.getAll = ()=>JSON.parse(JSON.stringify(quizzes));

exports.getByIndex = id => {
  const quiz = quizzes[id];
  if(typeof quiz === "undefined"){
    throw new Error('el valor del parametro id no es valido');
  }
  return JSON.parse(JSON.stringify(quiz));
};

exports.deleteByIndex = id =>{
  const quiz = quizzes[id];
  if(typeof quiz === "undefined"){
    throw new Error('el valor del parametro id no es valido');
  }
  quizzes.splice(id,1);
  save();
};
load();
