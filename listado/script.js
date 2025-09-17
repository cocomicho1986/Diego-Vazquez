// =============================================================================
// 1. DATOS EN MEMORIA (como si fuera una "base de datos")
// =============================================================================
let lista = [];           // Nuestra "base de datos" en memoria
let nextId = 1;           // Simulamos IDs únicos (como un autoincremento)

// =============================================================================
// 2. REFERENCIAS AL HTML (DOM)
// =============================================================================
const form = document.getElementById('formElemento');
const input = document.getElementById('dato');
const contenedor = document.getElementById('listaElementos');

// =============================================================================
// 3. SIMULACIÓN DE "FETCH": Funciones que imitan llamadas a una API
// =============================================================================

// GET /tareas → devuelve todas las tareas
async function obtenerTareas() {
  // Simulamos un pequeño retraso (como si viniera del servidor)
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...lista]; // devolvemos una copia
}

// POST /tareas → agrega una nueva tarea
async function agregarTarea(tarea) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const nueva = { id: nextId++, ...tarea };
  lista.push(nueva);
  return nueva;
}

// PUT /tareas/:id → actualiza una tarea
async function actualizarTarea(id, tareaActualizada) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = lista.findIndex(t => t.id === id);
  if (index !== -1) {
    lista[index] = { ...lista[index], ...tareaActualizada };
    return lista[index];
  }
  throw new Error("Tarea no encontrada");
}

// DELETE /tareas/:id → elimina una tarea
async function eliminarTarea(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const index = lista.findIndex(t => t.id === id);
  if (index !== -1) {
    lista.splice(index, 1);
    return { id }; // respuesta simulada
  }
  throw new Error("Tarea no encontrada");
}

// =============================================================================
// 4. MOSTRAR TAREAS EN LA TABLA
// =============================================================================
async function mostrarTareas() {
  const tareas = await obtenerTareas(); // ← ¡usamos "fetch" simulado!
  contenedor.innerHTML = '';

  if (tareas.length === 0) {
    contenedor.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">No hay tareas</td></tr>';
  } else {
    let filas = '';
    tareas.forEach(tarea => {
      const estilo = tarea.completada ? 'style="text-decoration: line-through; color: #888;"' : '';
      const textoBoton = tarea.completada ? 'Desmarcar' : 'Completar';

      filas += `
        <tr>
          <td ${estilo}>${tarea.nombre}</td>
          <td class="text-center">
            <div class="acciones">
              <button class="btn-completar" data-id="${tarea.id}">${textoBoton}</button>
              <button class="btn-edit" data-id="${tarea.id}">Modificar</button>
              <button class="btn-delete" data-id="${tarea.id}">Eliminar</button>
            </div>
          </td>
        </tr>`;
    });
    contenedor.innerHTML = filas;
  }
}

// =============================================================================
// 5. FORMULARIO: Agregar o Modificar
// =============================================================================
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const valor = input.value.trim();

  if (!valor) {
    alert("Escribe algo");
    return;
  }

  const tarea = { nombre: valor };

  try {
    if (!window.editandoId) {
      // === AGREGAR ===
      await agregarTarea({ ...tarea, completada: false });
      form.querySelector('button').textContent = 'Agregar';
    } else {
      // === MODIFICAR ===
      await actualizarTarea(window.editandoId, tarea);
      window.editandoId = null;
      form.querySelector('button').textContent = 'Agregar';
    }

    // Limpiar y refrescar
    input.value = '';
    await mostrarTareas(); // ← volvemos a "traer" los datos
  } catch (error) {
    alert(error.message);
  }
});

// =============================================================================
// 6. BOTONES: Completar, Modificar, Eliminar
// =============================================================================
contenedor.addEventListener('click', async function(e) {
  const boton = e.target;

  // === ELIMINAR ===
  if (boton.classList.contains('btn-delete')) {
    const id = Number(boton.dataset.id);
    if (confirm("¿Eliminar esta tarea?")) {
      try {
        await eliminarTarea(id);
        await mostrarTareas();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // === MODIFICAR ===
  if (boton.classList.contains('btn-edit')) {
    const id = Number(boton.dataset.id);
    try {
      const tareas = await obtenerTareas();
      const tarea = tareas.find(t => t.id === id);
      if (tarea) {
        input.value = tarea.nombre;
        window.editandoId = id;
        form.querySelector('button').textContent = 'Guardar Cambios';
        input.focus();
      }
    } catch (error) {
      alert(error.message);
    }
  }

  // === COMPLETAR / DESMARCAR ===
  if (boton.classList.contains('btn-completar')) {
    const id = Number(boton.dataset.id);
    try {
      const tareas = await obtenerTareas();
      const tarea = tareas.find(t => t.id === id);
      if (tarea) {
        await actualizarTarea(id, { completada: !tarea.completada });
        await mostrarTareas();
      }
    } catch (error) {
      alert(error.message);
    }
  }
});

// =============================================================================
// 7. INICIAR: cargar tareas al inicio
// =============================================================================
mostrarTareas();