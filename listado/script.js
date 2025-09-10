//1 datos y estado del sistema

//array que almacena todas las tareas

const lista = [];

//variable que controla si se esta modificando una tarea existente

let editando=null;

//2 conexion con el html (DOM)

//Obtenemos elementos del html para manipularlos desde javascript
const form=document.getElementById('formElemento'); // El formulario
const input = document.getElementById('dato'); //campo de texto
const contenedor = document.getElementById('listaElementos'); // <tbody> donde se muestran las tareas

//3 actualizar la lista en la pantalla
//esta funcion redibuja toda la tabla segun el estado actual de la 'lista'

function actualizarLista(){
// Limpiamos el contenido actual de la tabla
contenedor.innerHTML='';
// Si no hay tareas, mostramos un mensaje
if (lista.length===0){
  contenedor.innerHTML='<tr><td colspan="3" style="text-align:center; color:#888;">No hay elementos</tr>';
}
// Si hay tareas, creamos una fila por cada una
else {
  let filas=''; //Acumulador de html para todas las filas
  //Recorremos cada tarea en el array
  for (let i=0;i<lista.length;i++){
    const item=lista[i]; // Tarea actual en la posicion i
    // Si la tarea esta completada hacemos un efecto de texto tachado
    const estilo = item.completada ? 'style="text-decoration: line-through; color: #888;"':'';
    //El boton dice "Completar" si no eseta hecha, o "Desmarcar" si ya lo esta
    const textoBoton = item.completada ? 'Desmarcar' : 'Completar';
    // creamos el html de una fila con:
    // tres botones: completar, modificar, eliminar
    // data-index="${i}" -> guarda la posicion para usarla despues
    filas += `
    <tr>
    <td ${estilo}>${item.nombre}</td>
    <td>
    <button class="btn-completar" data-index="${i}">${textoBoton}</button>
    <button class="btn-edit" data-index="${i}">Modificar</button>
    <button class="btn-delete" data-index="${i}">Eliminar</button>
    </td>
    </tr> `;     
  }
//Insertamos todas las filas generadas en la tabla
contenedor.innerHTML= filas;

}
}
//4 Manejo del formulario: agregar o modificar
//escucha el evento 'submit' del formulario
form.addEventListener('submit', function(e){
e.preventDefault(); // evita que la pagina se recargue
//Obtenemos y limpiamos el valor del input(elimina espacios al inicio y al final)
const valor = input.value.trim();
//Validacion: si el campo esta vacio, mostramos alerta y salimos
if(!valor){
  alert("Escribe algo");
  return;
}
//Modo: agregar tarea
if (!editando) {
  //Creamos un nuevoo objeto y lo agregamos al final del array
  lista.push({
    nombre: valor,
    completada: false // Nueva tarea: no esta completada
  });

 
}
//Modo: modificar una tarea existente
else{
  //actualizamos el nombre de la tarea en la posicion 'editando'
  lista[editando].nombre=valor;
  //salimos del modo edicion
  editando=null;
  //Volvemos el texto del boton a "Agregar"
  form.querySelector('button').textContent= 'Agregar';
}
//Limpiamos el campo de texto
input.value='';
//actualizamos la tabla para reflejar los cambios
actualizarLista();
});

//5 Manejo de botones: completar,modificar y eliminar
// escuchamos clics en todo el contenedor (delegacion de eventos)
contenedor.addEventListener('click', function(e){
const boton=e.target; // El elemento exacto que recibio el clic

//Boton: eliminar
if (boton.classList.contains('btn-delete')){
//Obtenemos el indice de la tarea
const i = boton.dataset.index;
//preguntamos al usuario si realmente quiere eliminar
if(confirm("Eliminar este elemento?")){
  // eliminamos 1 elemento en la posicion 'i'
  lista.splice(i,1); //Si cambio el 1 por un 2 elimina dos elementos
  //actualizamos la tabla
  actualizarLista();
}

}
//Boton:modificar
if (boton.classList.contains('btn-edit')){
  // obtenemos el indice de la tarea
  const i = boton.dataset.index;
  //cargamos el nombre actual en el input del formulario
  input.value=lista[i].nombre;
  //Guardamos el indice para saber cual se esta editando
  editando=i;
  //cambiamos el textoo del boton del formulario
  form.querySelector('button').textContent='Guardar cambios';
  //ponemos el foco en el input para que el usuario empiece a escribir
  input.focus();
}
// boton: completar / desmarcar
// verificamos si el boton tiene la clase 'btn-completar'
if (boton.classList.contains('btn-completar')){
  //Obtenemos el indice (posicion) de la tarea desde el atributo data-index
  const i = boton.dataset.index;
  //Cambiamos el estado: si era true -> false, si ea false -> true
  lista[i].completada=!lista[i].completada;
  //volvemos a dibujar la tabla para mostrar el cambio visual
  actualizarLista();

}

});

