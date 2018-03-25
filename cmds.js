const Sequelize = require('sequelize');
const {models} =require('./model');
const {log, biglog, errorlog, colorize} = require("./out");

exports.helpCmd=rl=>{
        console.log('Comandos:');
     console.log("h|help - Muestra esta ayuda.");
     console.log("list - Listar los quizzes existentes.");
     console.log("show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
     console.log("add - Añadir un nuevo quiz interactivamente.");
     console.log("delete <id> - Borrar el quiz indicado.");
     console.log("edit <id> - Editar el quiz indicado");
     console.log("test <id> - Probar el quiz indicado");
     console.log("p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
     console.log("credits - Créditos.");
     console.log("q|quiz - Salir del programa.");
      rl.prompt();
     };


    exports.quitCmd=rl=>{
    
rl.close();
    rl.prompt();
   };
 

    const makeQuestion = (rl, text) => {


        return new Sequelize.Promise((resolve, reject) => {

            rl.question(colorize(text, 'red'), answer =>{
        resolve(answer.trim());
});
});
};

    exports.addCmd=rl=>{


        makeQuestion(rl, 'Introduzca una pregunta:')

        .then(q=> {

            return makeQuestion(rl, 'Introduzca la respuesta')

                .then(a => {

                    return {question : q, answer:a};

});

})

        .then(quiz => {
            return models.quiz.create(quiz);

})

        .then((quiz) =>{

log(`${colorize('Se ha añadido','magenta')}: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);

})
           .catch(Sequelize, ValidationError, error => {

            errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
})  

.catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})
    };


  exports.listCmd=rl=>{

    models.quiz.findAll()
    .each(quiz => {

            log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);

    })

    .catch(error => {

    errorlog(error.message);

    })
    .then(() => {

        rl.prompt();
    });
   };


    const validateId = id => {

        return new Sequelize.Promise((resolve,reject) => {

            if (typeof id === "undefined"){
                
                reject(new Error(`Falta el parametro <id>.`));
  
    
            }
            else{

                id=parseInt(id);

                if(Number.isNaN(id)){
                    reject(new Error(`El valor del parametro <id> no es un número.`));
    

                }
                else {
                    resolve(id);
    

             
                }

            }
})

};

   exports.showCmd=(rl,id)=>{

    validateId(id)
    .then(id => models.quiz.findById(id))
    .then(quiz => {

        if(!quiz){
            throw new Error(`No existe un quiz asociado al id = ${id}.`);

        }

        log(`[${colorize(quiz.id, 'magenta')}]: ${quiz.question}${colorize('=>', 'red')}`)
    
    })
     
    .catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})
    };
   
exports.testCmd = (rl, id) => {
  validateId(id)
  .then(id=>models.quiz.findById(id))
  .then(quiz =>{
    if(!quiz){
            throw new Error(`No existe un quiz asociado al id = ${id}.`);
          }
   makeQuestion(rl, quiz.question)
    .then (a =>{
      if (quiz.answer === a){
        console.log("Su respuesta es correcta");
        
        rl.prompt();
      }
      else{
        console.log ("Su respuesta es incorrecta");
        
        rl.prompt();
      }

    });
  })
  .catch(error =>{
    errorlog(error.message);
    rl.prompt();
  })        
  .then( () => { rl.prompt();})

  }



exports.playCmd = rl => {
    let marcador = 0;
    let aux = [];
    
    
   const jugaraux = () => {

    return Promise.resolve()
    .then (() => {
      if (aux.length <= 0) {
        log("Fin del juego.");
        log("Ha obtenido " + marcador + " aciertos");
        return;
      }
      let pos = Math.round(Math.random()*(aux.length -1));
      let quiz = aux[pos];
      aux.splice(pos, 1);

      return makeQuestion(rl, quiz.question)
      .then(a => {
        if(a === quiz.answer) {
          marcador++;
          log("Su respusta es correcta");
          if (aux.length > 0){
          log("Lleva " + marcador + " aciertos");
          }   
          return jugaraux();

        } else {
          log("Su respusta es incorrecta");
          log("Fin del juego");
          log("Ha obtenido " + marcador + " aciertos");

        }
      })
    })
  }

  models.quiz.findAll({raw: true})
  .then(quizzes => {
    aux = quizzes;
  })
  .then(() => {
    return jugaraux();
  })
  .catch(er => {
    console.log("error: " + e);
  })
  .then(() => {
    console.log(marcador);
    rl.prompt();
  }) 
   
   
};

   exports.delCmd=(rl,id)=>{

    validateId(id)

    .then(id => models.quiz.destroy({where: {id}}))

    .catch(error => {
       errorlog(error.message);
  rl.prompt();
     })
    
    .then(()  => { 
    
    rl.prompt();

})
    };


   exports.editCmd=(rl,id)=>{


        validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
        if(!quiz){
            throw new Error(`No existe un quiz asociado al id = ${id}.`);

        }
    process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);

    return makeQuestion(rl, 'Introduzca la pregunta:')
        
        .then (q => {
        process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);

    return makeQuestion(rl, 'Introduzca la respuesta:')

       .then(a => {
            quiz.question =q;
            quiz.answer=a;
            return quiz;
});
});
})

    .then(quiz => {

        return quiz.save();
})

    .then(quiz => {

        log(`Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
    
    })

    .catch(Sequelize.ValidationError, error => {
errorlog('El quiz es erroneo:');
            error.errors.forEach(({message}) => errorlog(message));
})  

.catch(error => {
       errorlog(error.message);
     })
    
    .then(()  => {   rl.prompt();

})

         };
    
    exports.creditsCmd=rl=>{
    console.log("Autores de la practica:");
    console.log('nombre 1: Rodrigo Ozores Benito');
   
    rl.prompt();
};
