/**
 * POLITÉCNICO DE LOS LLANOS - BUZÓN ESTUDIANTIL
 * Controlador del formulario de sugerencias con selector de modo (Anónimo vs No Anónimo),
 * ocultamiento condicional de campos y envío directo a Gmail / Correo institucional.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formSugerencia');
  const btnToggleModo = document.getElementById('btnToggleModo');
  const btnAnonimoIcon = document.getElementById('btnAnonimoIcon');
  const btnAnonimoTexto = document.getElementById('btnAnonimoTexto');
  const seccionDatosEstudiante = document.getElementById('seccionDatosEstudiante');

  const inputNombre = document.getElementById('nombreEstudiante');
  const inputPrograma = document.getElementById('programaAcademico');
  const selectGrado = document.getElementById('gradoEstudiante');

  const selectCategoria = document.getElementById('categoria');
  const customSelectWrapper = document.getElementById('customSelectWrapper');
  const categoriaTrigger = document.getElementById('categoriaTrigger');
  const triggerText = document.getElementById('triggerText');
  const triggerIcon = document.getElementById('triggerIcon');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  const inputAsunto = document.getElementById('asunto');
  const textareaSituacion = document.getElementById('situacionActual');
  const textareaSolucion = document.getElementById('propuestaSolucion');
  const inputDestino = document.getElementById('correoDestino');
  const alerta = document.getElementById('alerta');

  const btnEnviar = document.getElementById('btnEnviar');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnTexto = document.getElementById('btnTexto');

  const modalConfirmacion = document.getElementById('modalConfirmacion');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetalles = document.getElementById('modalDetalles');
  const btnModalCerrar = document.getElementById('btnModalCerrar');

  // Correo de recepción por defecto (Oficial Institucional)
  const DEFAULT_DESTINO = 'Politecnicodelosllanos@gmail.com';
  if (inputDestino && !inputDestino.value) {
    inputDestino.value = DEFAULT_DESTINO;
  }

  // =========================================================
  // BOTÓN SIMPLE Y DIRECTO (ANÓNIMO VS NO ANÓNIMO)
  // =========================================================
  let esModoAnonimo = true; // Por defecto es Anónimo

  function aplicarModo(anonimo, enfocar = false) {
    esModoAnonimo = Boolean(anonimo);

    if (esModoAnonimo) {
      if (btnToggleModo) {
        btnToggleModo.className = 'btn-anonimo-directo is-anonimo';
        btnToggleModo.setAttribute('aria-pressed', 'true');
      }
      if (btnAnonimoIcon) btnAnonimoIcon.textContent = '🔒';
      if (btnAnonimoTexto) btnAnonimoTexto.textContent = 'Anónimo';

      if (seccionDatosEstudiante) {
        seccionDatosEstudiante.classList.add('is-hidden');
        seccionDatosEstudiante.style.display = 'none';
      }
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
      if (btnToggleModo) {
        btnToggleModo.className = 'btn-anonimo-directo is-no-anonimo';
        btnToggleModo.setAttribute('aria-pressed', 'false');
      }
      if (btnAnonimoIcon) btnAnonimoIcon.textContent = '👤';
      if (btnAnonimoTexto) btnAnonimoTexto.textContent = 'No Anónimo';

      if (seccionDatosEstudiante) {
        seccionDatosEstudiante.classList.remove('is-hidden');
        seccionDatosEstudiante.style.display = 'block';
      }
      if (inputNombre) inputNombre.required = true;
      if (inputPrograma) inputPrograma.required = true;
      if (selectGrado) selectGrado.required = true;

      if (enfocar && inputNombre) {
        setTimeout(() => inputNombre.focus(), 80);
      }
    }
  }

  // Click en el botón conmuta directamente entre Anónimo y No Anónimo
  btnToggleModo?.addEventListener('click', (e) => {
    e.preventDefault();
    aplicarModo(!esModoAnonimo, true);
  });

  // Inicializar en Anónimo
  aplicarModo(true);

  // =========================================================
  // CASILLA DESPLEGABLE COMPACTA DE ÁREA (TIPO APPLE)
  // =========================================================
  categoriaTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = customSelectWrapper.classList.toggle('open');
    categoriaTrigger.setAttribute('aria-expanded', isOpen);
    customSelectWrapper.classList.remove('shake');
  });

  dropdownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = item.getAttribute('data-value');
      const text = item.querySelector('span').textContent;
      const iconSvg = item.querySelector('.item-icon').outerHTML;

      triggerText.textContent = text;
      triggerIcon.innerHTML = iconSvg;
      selectCategoria.value = val;

      dropdownItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');

      customSelectWrapper.classList.remove('open');
      categoriaTrigger.setAttribute('aria-expanded', 'false');
      customSelectWrapper.classList.remove('shake');
    });
  });

  document.addEventListener('click', (e) => {
    if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
      customSelectWrapper.classList.remove('open');
      categoriaTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

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
  // VALIDACIÓN DE CAMPOS
  // =========================================================
  function validarCampos() {
    // Si eligió identificarse (NO anónimo), validar nombre, carrera y grado
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

    if (!selectCategoria.value) {
      if (customSelectWrapper) {
        customSelectWrapper.classList.remove('shake');
        void customSelectWrapper.offsetWidth;
        customSelectWrapper.classList.add('shake');
        customSelectWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      mostrarMensaje('Por favor selecciona un área para tu sugerencia.');
      return false;
    }

    if (!inputAsunto.value.trim()) {
      inputAsunto.focus();
      mostrarMensaje('Por favor escribe el asunto o título principal.');
      return false;
    }

    if (!textareaSituacion.value.trim()) {
      textareaSituacion.focus();
      mostrarMensaje('Por favor describe la situación o problema observado.');
      return false;
    }

    if (!textareaSolucion.value.trim()) {
      textareaSolucion.focus();
      mostrarMensaje('Por favor explica tu propuesta de solución.');
      return false;
    }

    if (!inputDestino.value.trim()) {
      inputDestino.value = DEFAULT_DESTINO;
    }

    return true;
  }

  // =========================================================
  // ENVÍO REAL DIRECTO AL CORREO (FORMSUBMIT API)
  // =========================================================
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const destino = inputDestino.value.trim() || DEFAULT_DESTINO;
    const asunto = inputAsunto.value.trim();
    const esAnonimo = esModoAnonimo;
    const remitente = esAnonimo ? 'Estudiante Anónimo' : inputNombre.value.trim();
    const programa = esAnonimo ? 'No aplica (Envío Anónimo)' : inputPrograma.value.trim();
    const grado = esAnonimo ? 'No aplica (Envío Anónimo)' : selectGrado.value;
    const categoria = selectCategoria.value;
    const situacion = textareaSituacion.value.trim();
    const solucion = textareaSolucion.value.trim();

    // Estado visual de carga
    if (btnEnviar) btnEnviar.disabled = true;
    if (btnSpinner) btnSpinner.hidden = false;
    if (btnTexto) btnTexto.textContent = 'Enviando propuesta...';

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

    // Timeout de 5 segundos para que NUNCA se quede la rueda girando infinito
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

      clearTimeout(timeoutId);

      let data = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResp = await response.text();
        data = { success: response.ok, message: textResp };
      }

      if (data.success === 'true' || data.success === true) {
        // Entrega confirmada (sin mostrar el correo de recepción en pantalla)
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
      clearTimeout(timeoutId);
      if (btnEnviar) btnEnviar.disabled = false;
      if (btnSpinner) btnSpinner.hidden = true;
      if (btnTexto) btnTexto.textContent = '✉️ Enviar Sugerencia';
    }
  });

  // =========================================================
  // MODAL DE CONFIRMACIÓN
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

  btnModalCerrar?.addEventListener('click', cerrarModal);
  modalConfirmacion?.addEventListener('click', (e) => {
    if (e.target === modalConfirmacion) cerrarModal();
  });

  // =========================================================
  // LIMPIEZA DEL FORMULARIO
  // =========================================================
  function resetearFormulario() {
    form.reset();
    inputDestino.value = DEFAULT_DESTINO;
    selectCategoria.value = '';
    triggerText.textContent = 'Selecciona un área...';
    triggerIcon.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>`;
    dropdownItems.forEach((i) => i.classList.remove('selected'));
    aplicarModo(true);
  }

  // =========================================================
  // NOTIFICACIÓN FLOTANTE TIPO TOAST
  // =========================================================
  let alertaTimer = null;
  function mostrarMensaje(texto) {
    if (!alerta) return;
    if (alertaTimer) clearTimeout(alertaTimer);
    alerta.textContent = texto;
    alerta.classList.remove('hide');
    alerta.classList.add('show');

    alertaTimer = setTimeout(() => {
      alerta.classList.remove('show');
      alerta.classList.add('hide');
      setTimeout(() => {
        alerta.classList.remove('hide');
      }, 500);
    }, 4500);
  }
});
