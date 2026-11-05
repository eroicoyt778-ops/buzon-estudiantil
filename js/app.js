/**
 * POLITÉCNICO DE LOS LLANOS - BUZÓN ESTUDIANTIL
 * -------------------------------------------------------------
 * Código JavaScript principal que desarrollé para el formulario.
 * Aquí manejo:
 * 1. La alternancia directa entre modo Anónimo y No Anónimo.
 * 2. El despliegue de los campos personales sólo si el estudiante desea identificarse.
 * 3. El menú interactivo de categorías temáticas.
 * 4. La validación de los datos antes de enviarlos.
 * 5. El envío asíncrono con límite de tiempo (timeout) para evitar bloqueos del botón.
 * 6. La ventana modal de confirmación con diseño limpio y formal.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================
  // 1. CAPTURA DE ELEMENTOS DEL DOM
  // Aquí guardo en constantes todos los elementos que voy a manipular
  // con JavaScript para no tener que buscarlos repetidamente.
  // =========================================================

  // Elemento del formulario principal
  const form = document.getElementById('formSugerencia');

  // Elementos del botón directo de modo anónimo
  const btnToggleModo = document.getElementById('btnToggleModo');
  const btnAnonimoIcon = document.getElementById('btnAnonimoIcon');
  const btnAnonimoTexto = document.getElementById('btnAnonimoTexto');

  // Sección condicional que contiene Nombre, Carrera y Grado
  const seccionDatosEstudiante = document.getElementById('seccionDatosEstudiante');
  const inputNombre = document.getElementById('nombreEstudiante');
  const inputPrograma = document.getElementById('programaAcademico');
  const selectGrado = document.getElementById('gradoEstudiante');

  // Elementos de la casilla desplegable personalizada para las áreas de sugerencia
  const selectCategoria = document.getElementById('categoria');
  const customSelectWrapper = document.getElementById('customSelectWrapper');
  const categoriaTrigger = document.getElementById('categoriaTrigger');
  const triggerText = document.getElementById('triggerText');
  const triggerIcon = document.getElementById('triggerIcon');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  // Campos de texto de la propuesta
  const inputAsunto = document.getElementById('asunto');
  const textareaSituacion = document.getElementById('situacionActual');
  const textareaSolucion = document.getElementById('propuestaSolucion');
  const inputDestino = document.getElementById('correoDestino');
  const alerta = document.getElementById('alerta');

  // Botón de envío y su indicador de carga animado (spinner)
  const btnEnviar = document.getElementById('btnEnviar');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnTexto = document.getElementById('btnTexto');

  // Elementos de la ventana modal de confirmación
  const modalConfirmacion = document.getElementById('modalConfirmacion');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetalles = document.getElementById('modalDetalles');
  const btnModalCerrar = document.getElementById('btnModalCerrar');

  // Correo institucional oficial al que se entregan todas las propuestas
  const DEFAULT_DESTINO = 'Politecnicodelosllanos@gmail.com';
  if (inputDestino && !inputDestino.value) {
    inputDestino.value = DEFAULT_DESTINO;
  }

  // =========================================================
  // 2. LÓGICA DEL BOTÓN SIMPLE DE MODO ANÓNIMO
  // Aquí programé cómo funciona la privacidad del envío.
  // =========================================================

  // Esta variable guarda si el modo anónimo está prendido o apagado
  let esModoAnonimo = true; // Por defecto siempre arranco en Anónimo

  /**
   * Con esta función controlo el estado visual del botón y la visibilidad
   * de los campos de datos personales del estudiante.
   * @param {boolean} anonimo - true para anónimo, false para identificado
   * @param {boolean} enfocar - true si quiero poner el cursor en el input de nombre
   */
  function aplicarModo(anonimo, enfocar = false) {
    esModoAnonimo = Boolean(anonimo);

    if (esModoAnonimo) {
      // MODO ANÓNIMO:
      // 1. Pongo el botón en estilo verde con candado 🔒
      if (btnToggleModo) {
        btnToggleModo.className = 'btn-anonimo-directo is-anonimo';
        btnToggleModo.setAttribute('aria-pressed', 'true');
      }
      if (btnAnonimoIcon) btnAnonimoIcon.textContent = '🔒';
      if (btnAnonimoTexto) btnAnonimoTexto.textContent = 'Anónimo';

      // 2. Oculto por completo la sección de datos personales
      if (seccionDatosEstudiante) {
        seccionDatosEstudiante.classList.add('is-hidden');
        seccionDatosEstudiante.style.display = 'none';
      }

      // 3. Quito la obligatoriedad y limpio los campos por si había escrito algo
      if (inputNombre) {
        inputNombre.required = false;
        inputNombre.value = '';
      }
      if (inputPrograma) {
        inputPrograma.required = false;
        inputPrograma.value = '';
      }
      if (selectGrado) {
        selectGrado.required = false;
        selectGrado.value = '';
      }
    } else {
      // MODO NO ANÓNIMO (IDENTIFICARSE):
      // 1. Cambio el botón a estilo azul con icono de persona 👤
      if (btnToggleModo) {
        btnToggleModo.className = 'btn-anonimo-directo is-no-anonimo';
        btnToggleModo.setAttribute('aria-pressed', 'false');
      }
      if (btnAnonimoIcon) btnAnonimoIcon.textContent = '👤';
      if (btnAnonimoTexto) btnAnonimoTexto.textContent = 'No Anónimo';

      // 2. Hago visible la sección de datos del estudiante
      if (seccionDatosEstudiante) {
        seccionDatosEstudiante.classList.remove('is-hidden');
        seccionDatosEstudiante.style.display = 'block';
      }

      // 3. Vuelvo obligatorios los campos para que la propuesta quede bien identificada
      if (inputNombre) inputNombre.required = true;
      if (inputPrograma) inputPrograma.required = true;
      if (selectGrado) selectGrado.required = true;

      // 4. Si el usuario acaba de tocar el botón, enfoco el cursor directamente en el nombre
      if (enfocar && inputNombre) {
        setTimeout(() => inputNombre.focus(), 80);
      }
    }
  }

  // Al hacer clic en el botón de modo, simplemente invierto el valor actual (!esModoAnonimo)
  btnToggleModo?.addEventListener('click', (e) => {
    e.preventDefault();
    aplicarModo(!esModoAnonimo, true);
  });

  // Inicializo la página asegurándome de que arranque en Anónimo
  aplicarModo(true);

  // =========================================================
  // 3. INTERACCIÓN DEL SELECT PERSONALIZADO DE ÁREAS
  // Aquí programé la apertura, selección y cierre del menú con iconos
  // =========================================================

  // Abrir o cerrar el menú al hacer clic sobre el botón trigger
  categoriaTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = customSelectWrapper.classList.toggle('open');
    categoriaTrigger.setAttribute('aria-expanded', isOpen);
    customSelectWrapper.classList.remove('shake');
  });

  // Cuando el usuario hace clic en una opción de la lista
  dropdownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = item.getAttribute('data-value');
      const text = item.querySelector('span').textContent;
      const iconSvg = item.querySelector('.item-icon').outerHTML;

      // Actualizo el texto y el icono que se muestran en el botón principal
      triggerText.textContent = text;
      triggerIcon.innerHTML = iconSvg;

      // Sincronizo el valor con el select nativo para que el formulario lo reconozca
      selectCategoria.value = val;

      // Marco visualmente el elemento seleccionado
      dropdownItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');

      // Cierro el menú desplegable
      customSelectWrapper.classList.remove('open');
      categoriaTrigger.setAttribute('aria-expanded', 'false');
      customSelectWrapper.classList.remove('shake');
    });
  });

  // Si el usuario hace clic en cualquier parte fuera del menú, lo cierro automáticamente
  document.addEventListener('click', (e) => {
    if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
      customSelectWrapper.classList.remove('open');
      categoriaTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  // Soporte para cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && customSelectWrapper?.classList.contains('open')) {
      customSelectWrapper.classList.remove('open');
      categoriaTrigger?.setAttribute('aria-expanded', 'false');
    }
    if (e.key === 'Escape' && modalConfirmacion && !modalConfirmacion.hidden) {
      cerrarModal();
    }
  });

  // =========================================================
  // 4. VALIDACIÓN DE LOS CAMPOS DEL FORMULARIO
  // Esta función revisa que no haya campos vacíos antes de enviar
  // =========================================================
  function validarCampos() {
    // Si el estudiante eligió 'No Anónimo', sus datos personales son obligatorios
    if (!esModoAnonimo) {
      if (!inputNombre.value.trim()) {
        inputNombre.focus();
        mostrarMensaje('Por favor escribe tu nombre completo.');
        return false;
      }
      if (!inputPrograma.value.trim()) {
        inputPrograma.focus();
        mostrarMensaje('Por favor escribe tu programa o carrera.');
        return false;
      }
      if (!selectGrado.value) {
        selectGrado.focus();
        mostrarMensaje('Por favor selecciona tu grado.');
        return false;
      }
    }

    // El área temática siempre es obligatoria
    if (!selectCategoria.value) {
      if (customSelectWrapper) {
        customSelectWrapper.classList.remove('shake');
        void customSelectWrapper.offsetWidth; // Reinicio la animación para que vuelva a vibrar
        customSelectWrapper.classList.add('shake');
        customSelectWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      mostrarMensaje('Por favor selecciona un área para tu sugerencia.');
      return false;
    }

    // Validar el asunto
    if (!inputAsunto.value.trim()) {
      inputAsunto.focus();
      mostrarMensaje('Por favor escribe el asunto o título principal.');
      return false;
    }

    // Validar la explicación del problema
    if (!textareaSituacion.value.trim()) {
      textareaSituacion.focus();
      mostrarMensaje('Por favor describe la situación o problema observado.');
      return false;
    }

    // Validar la propuesta de solución
    if (!textareaSolucion.value.trim()) {
      textareaSolucion.focus();
      mostrarMensaje('Por favor explica tu propuesta de solución.');
      return false;
    }

    // Si por alguna razón el correo destino estuviera vacío, uso el oficial por defecto
    if (!inputDestino.value.trim()) {
      inputDestino.value = DEFAULT_DESTINO;
    }

    return true; // Todos los datos están correctos
  }

  // =========================================================
  // 5. ENVÍO REAL DIRECTO POR CORREO
  // Aquí proceso el envío al presionar el botón 'Enviar Sugerencia'
  // =========================================================
  form?.addEventListener('submit', async (e) => {
    // Evito que la página se recargue automáticamente
    e.preventDefault();

    // Verifico que todos los campos requeridos estén llenos
    if (!validarCampos()) return;

    // Recolecto los datos del formulario
    const destino = inputDestino.value.trim() || DEFAULT_DESTINO;
    const asunto = inputAsunto.value.trim();
    const esAnonimo = esModoAnonimo;
    const remitente = esAnonimo ? 'Estudiante Anónimo' : inputNombre.value.trim();
    const programa = esAnonimo ? 'No aplica (Envío Anónimo)' : inputPrograma.value.trim();
    const grado = esAnonimo ? 'No aplica (Envío Anónimo)' : selectGrado.value;
    const categoria = selectCategoria.value;
    const situacion = textareaSituacion.value.trim();
    const solucion = textareaSolucion.value.trim();

    // Activo el estado visual de carga en el botón (spinner rodando)
    if (btnEnviar) btnEnviar.disabled = true;
    if (btnSpinner) btnSpinner.hidden = false;
    if (btnTexto) btnTexto.textContent = 'Enviando propuesta...';

    // Armo el objeto con toda la información que llegará al correo
    const payload = {
      _subject: `[Politécnico de los Llanos] Sugerencia (${esAnonimo ? 'Anónima' : remitente}): ${asunto}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: 'noreply@estudiantes.xuanii.com',
      'Institución': 'Politécnico de los Llanos',
      'Modo de Envío': esAnonimo ? '100% Anónimo (Identidad protegida)' : 'Estudiante Identificado',
      'Remitente': remitente,
      ...(esAnonimo
        ? {}
        : {
            'Programa o Carrera': programa,
            'Grado': grado
          }),
      'Área de la Sugerencia': categoria,
      'Asunto': asunto,
      'Problema / Situación Observada': situacion,
      'Propuesta de Solución': solucion,
      'Fecha y Hora': new Date().toLocaleString('es-CO')
    };

    // CONTROL DE TIEMPO (TIMEOUT DE 5 SEGUNDOS):
    // Aquí uso AbortController para que, si el servidor de correo se demora más de 5 segundos,
    // la petición se cancele de inmediato y el botón NUNCA se quede rodando infinito.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destino)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      // Si respondió antes de los 5 segundos, limpio el temporizador
      clearTimeout(timeoutId);

      // Verifico si la respuesta vino en formato JSON o texto
      let data = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResp = await response.text();
        data = { success: response.ok, message: textResp };
      }

      if (data.success === 'true' || data.success === true) {
        // Entrega confirmada: abro mi modal de éxito mostrando el resumen de la propuesta
        abrirModal(
          '¡Propuesta Enviada con Éxito!',
          `Tu sugerencia se ha entregado en la bandeja de entrada institucional.`,
          `<strong>Tipo de envío:</strong> ${esAnonimo ? '100% Anónimo' : 'Estudiante Identificado'}<br>
           ${!esAnonimo ? `<strong>Remitente:</strong> ${remitente}<br><strong>Programa:</strong> ${programa}<br><strong>Grado:</strong> ${grado}<br>` : ''}
           <strong>Área:</strong> ${categoria}<br>
           <strong>Asunto:</strong> ${asunto}`
        );
        resetearFormulario();
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        // En caso de que el servicio requiera autorización por primera vez en el correo
        abrirModal(
          '¡Paso Final de Activación!',
          `FormSubmit envió un correo de confirmación para autorizar la recepción automática.`,
          `Para recibir este y los próximos mensajes:<br>
           1. Abre tu bandeja de correo institucional.<br>
           2. Abre el correo de FormSubmit y pulsa en <em>"Activate Form"</em> (solo se hace 1 vez).<br>
           3. ¡Listo! A partir de ese clic, todas las propuestas llegarán en automático.`
        );
      } else {
        mostrarMensaje(data.message || 'No se pudo entregar por la red. Por favor intenta de nuevo.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Error al conectar con el servicio de correo:', err);
      if (err.name === 'AbortError') {
        mostrarMensaje('El servidor tardó en responder. Por favor intenta de nuevo.');
      } else {
        mostrarMensaje('No se pudo conectar con el servidor. Revisa tu conexión a internet.');
      }
    } finally {
      // Este bloque 'finally' SIEMPRE se ejecuta:
      // Aquí garantizo que el spinner se oculte y el botón vuelva a su texto normal
      clearTimeout(timeoutId);
      if (btnEnviar) btnEnviar.disabled = false;
      if (btnSpinner) btnSpinner.hidden = true;
      if (btnTexto) btnTexto.textContent = '✉️ Enviar Sugerencia';
    }
  });

  // =========================================================
  // 6. GESTIÓN DEL MODAL EMERGENTE
  // Funciones para abrir y cerrar la ventana de confirmación
  // =========================================================
  function abrirModal(titulo, desc, detallesHTML) {
    if (!modalConfirmacion) return;
    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalDesc) modalDesc.innerHTML = desc;
    if (modalDetalles) modalDetalles.innerHTML = detallesHTML || '';
    modalConfirmacion.hidden = false;
  }

  function cerrarModal() {
    if (!modalConfirmacion) return;
    modalConfirmacion.hidden = true;
  }

  // Cerrar al dar clic en el botón 'Entendido' o en el fondo oscuro
  btnModalCerrar?.addEventListener('click', cerrarModal);
  modalConfirmacion?.addEventListener('click', (e) => {
    if (e.target === modalConfirmacion) cerrarModal();
  });

  // =========================================================
  // 7. LIMPIEZA Y RESTAURACIÓN DEL FORMULARIO
  // Esta función resetea los campos después de un envío exitoso
  // =========================================================
  function resetearFormulario() {
    form.reset();
    inputDestino.value = DEFAULT_DESTINO;
    selectCategoria.value = '';
    triggerText.textContent = 'Selecciona un área...';
    triggerIcon.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>`;
    dropdownItems.forEach((i) => i.classList.remove('selected'));
    
    // Regreso siempre al modo anónimo por defecto
    aplicarModo(true);
  }

  // =========================================================
  // 8. NOTIFICACIÓN FLOTANTE (TOAST)
  // Mensajes flotantes temporales que avisan al usuario de errores o recordatorios
  // =========================================================
  let alertaTimer = null;
  function mostrarMensaje(texto) {
    if (!alerta) return;
    if (alertaTimer) clearTimeout(alertaTimer);
    alerta.textContent = texto;
    alerta.classList.remove('hide');
    alerta.classList.add('show');

    // Desaparece automáticamente después de 4.5 segundos
    alertaTimer = setTimeout(() => {
      alerta.classList.remove('show');
      alerta.classList.add('hide');
      setTimeout(() => {
        alerta.classList.remove('hide');
      }, 500);
    }, 4500);
  }
});
