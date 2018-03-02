const {log, biglog, errorlog, colorize} = require("./out");

const model = require ('./model');

/**
 * Funciones auxiliares
 */
 
exports.helpCmd = rl => {
   console.log("Commandos:");
      log("h | help - Muestra esta ayuda.");
      log("list- Listar los quizes existentes.");
      log("show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
      log("add- Añadir un nuevo quiz interactivamente.");
      log("delete <id> -Borrar el quiz indicado.");
      log("edit <id> - Editar el quiz indicado.");
      log("test <id> - Probar el quiz indicado.");
      log(" p|play - Jugar a preguntar aleatoriamente todos los quizes.");
      log(" credits - Créditos.");
      log(" q | quit - Salir del programa.");
       rl.prompt();
 };
 
exports.quitCmd = rl => {
    rl.close();
 };
 
exports.addCmd = rl => {
   rl.question(colorize(' introduzca una pregunta: ', 'red'), question =>{
     rl.question(colorize(' introduzca la respuesta: ', 'red'), answer =>{
       model.add(question, answer);
       log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
      rl.prompt();
   });
   });   
 };
 
exports.listCmd = rl => {
  model.getAll().forEach((quiz, id) =>{
    log(`[${colorize(id, 'magenta')}]: ${quiz.question}`);
  });
   
    rl.prompt();
 };
 
exports.showCmd = (rl, id) => {
   
   if (typeof id === "undefined"){
     errorlog(`Falta el parámetro id.`);
   }else {
     try{
       const quiz = model.getByIndex(id);
       log ( `[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
     }catch(error){
       errorlog(error.message);
     }
   }
   
    rl.prompt();
 };
 
exports.testCmd = (rl, id) => {
if (typeof id === "undefined"){
     errorlog(`Falta el parámetro id.`);
   }else {
     try{
       const quiz = model.getByIndex(id);
      rl.question(`${colorize(quiz.question, 'red')}`, respuesta1 =>{
       respuesta = respuesta1.trim();
        if(respuesta === quiz.answer){
        log("Su respuesta es correcta.");
        biglog('Correcta', 'green');
        rl.prompt();
      
        
        }else{
        log("Su respuesta es incorrecta.");
        biglog("Incorrecta", 'red');
        rl.prompt();
      }
        
      
     });
    
   }
    catch(error){
       errorlog(error.message);
     }
   
    rl.prompt();
 }
}

exports.playCmd = rl => {
    let marcador = 0;
    let aux = [];
    let c = model.count();
    let b = model.count();
    for ( i = 0; i <c; i++){
        
     
    
      aux [i] = i; //simplemente guarda indices
    }
    
    const jugaraux=() => {
      if (b === 0 ){
          log("Fin del juego. Aciertos "+marcador);
     biglog(marcador,'magenta')  ;    rl.prompt();
      } else{
        let pos = Math.round(Math.random()*(b-1)+parseInt(0));
        //log (pos);
        //log(aux[pos]);
        let idaux = aux[pos];
        let opcion = model.getByIndex(idaux); //esto guarda el quiz del id aux
       aux.splice(pos, 1);
       b--;
       rl.question
       (`${colorize(opcion.question, 'red')}`, respuesta1 =>{
         respuesta = respuesta1.trim();
        if(respuesta === opcion.answer){
          marcador++;
          log("CORRECTO - Lleva  "  +marcador+"   aciertos");
           
            jugaraux();      
         
       }else {
         log( "INCORRECTO");
         log("Fin del juego. Aciertos "+marcador);
         biglog ( marcador, 'magenta');
         rl.prompt();
       }  
        
        
      });
    } 
  
 
}; jugaraux();
}
 
exports.delCmd = (rl, id) => {
   if (typeof id === "undefined"){
     errorlog(`Falta el parámetro id.`);
   }else {
     try{
       model.deleteByIndex(id);
      
     }catch(error){
       errorlog(error.message);
     }
   }
    rl.prompt();
 };
 
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined"){
     errorlog(`Falta el parámetro id.`);
   }else {
     try{
       const quiz = model.getByIndex(id);
       process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
    rl.question(colorize(' introduzca una pregunta: ', 'red'), question =>{
       process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
     rl.question(colorize(' introduzca la respuesta: ', 'red'), answer =>{
       model.update(id, question, answer);
       log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
      rl.prompt();
   });
   });   
     }catch(error){
       errorlog(error.message);
       rl.prompt();
     }
   }
   
    
   
 };
 
exports.creditsCmd = rl => {
       log ('Autor de la práctica.', 'red');
      log('Rodrigo Ozores Benito', 'green');
       rl.prompt();
 };