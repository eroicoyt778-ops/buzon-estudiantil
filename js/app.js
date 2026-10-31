/**
 * POLITÉCNICO DE LOS LLANOS - BUZÓN ESTUDIANTIL
 * Controlador del formulario de sugerencias, envío directo por correo (FormSubmit / Gmail)
 * y generación de datos estructurados en XML / XSLT.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formSugerencia');
  const checkAnonimo = document.getElementById('checkAnonimo');
  const grupoNombre = document.getElementById('grupoNombre');
  const grupoCorreo = document.getElementById('grupoCorreo');
  const inputNombre = document.getElementById('nombreEstudiante');
  const inputCorreoEstudiante = document.getElementById('correoEstudiante');
  const inputPrograma = document.getElementById('programaAcademico');
  const inputSemestre = document.getElementById('semestre');
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
  const btnGmailDirecto = document.getElementById('btnGmailDirecto');
  const btnDescargarXML = document.getElementById('btnDescargarXML');

  const modalConfirmacion = document.getElementById('modalConfirmacion');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalDesc = document.getElementById('modalDesc');
  const modalDetalles = document.getElementById('modalDetalles');
  const btnModalCerrar = document.getElementById('btnModalCerrar');
  const btnModalDescargarXML = document.getElementById('btnModalDescargarXML');

  // Abrir / Cerrar casilla desplegable con animación fluida tipo Apple
  categoriaTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = customSelectWrapper.classList.toggle('open');
    categoriaTrigger.setAttribute('aria-expanded', isOpen);
    customSelectWrapper.classList.remove('shake');
  });

  // Selección de opción dentro de la casilla compacta
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

  // Cerrar desplegable al hacer clic afuera
  document.addEventListener('click', (e) => {
    if (customSelectWrapper && !customSelectWrapper.contains(e.target)) {
      customSelectWrapper.classList.remove('open');
      categoriaTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar desplegable con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && customSelectWrapper?.classList.contains('open')) {
      customSelectWrapper.classList.remove('open');
      categoriaTrigger?.setAttribute('aria-expanded', 'false');
    }
    if (e.key === 'Escape' && modalConfirmacion && !modalConfirmacion.hidden) {
      cerrarModal();
    }
  });

  // Alternar modo anónimo (sin requerir nombre ni correo)
  checkAnonimo?.addEventListener('change', () => {
    if (checkAnonimo.checked) {
      inputNombre.value = '';
      inputCorreoEstudiante.value = '';
      inputNombre.disabled = true;
      inputCorreoEstudiante.disabled = true;
      inputNombre.required = false;
      inputNombre.placeholder = 'Envío anónimo (identidad protegida)';
      inputCorreoEstudiante.placeholder = 'No requerido en envío anónimo';
      if (grupoNombre) grupoNombre.style.opacity = '0.55';
      if (grupoCorreo) grupoCorreo.style.opacity = '0.55';
    } else {
      inputNombre.disabled = false;
      inputCorreoEstudiante.disabled = false;
      inputNombre.required = true;
      inputNombre.placeholder = 'Tu nombre y apellido';
      inputCorreoEstudiante.placeholder = 'ejemplo@correo.com';
      if (grupoNombre) grupoNombre.style.opacity = '1';
      if (grupoCorreo) grupoCorreo.style.opacity = '1';
    }
  });

  // Escapar caracteres especiales para XML seguro
  function escaparXML(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Generación del documento XML estructurado (compatible con estilo.xsl)
  function generarXML() {
    const esAnonimo = checkAnonimo ? checkAnonimo.checked : false;
    const remitente = esAnonimo ? 'Anónimo' : (inputNombre.value.trim() || 'Estudiante');
    const correoContacto = esAnonimo ? 'No aplica (Envío Anónimo)' : (inputCorreoEstudiante.value.trim() || 'No registrado');
    const programa = inputPrograma.value.trim() || 'No especificado';
    const semestre = inputSemestre.value.trim() || 'No especificado';
    const categoria = selectCategoria.value || 'General';
    const asunto = inputAsunto.value.trim() || 'Sin asunto';
    const situacion = textareaSituacion.value.trim() || 'Sin descripción';
    const solucion = textareaSolucion.value.trim() || 'Sin propuesta';
    const fecha = new Date().toISOString().split('T')[0];

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="estilo.xsl"?>
<buzonEstudiantil institucion="Politécnico de los Llanos">
  <fechaRegistro>${fecha}</fechaRegistro>
  <remitente anonimo="${esAnonimo}">
    <nombre>${escaparXML(remitente)}</nombre>
    <correo>${escaparXML(correoContacto)}</correo>
    <programa>${escaparXML(programa)}</programa>
    <semestre>${escaparXML(semestre)}</semestre>
  </remitente>
  <propuesta>
    <area>${escaparXML(categoria)}</area>
    <asunto>${escaparXML(asunto)}</asunto>
    <situacionActual>${escaparXML(situacion)}</situacionActual>
    <solucionPropuesta>${escaparXML(solucion)}</solucionPropuesta>
  </propuesta>
</buzonEstudiantil>`;
  }

  // Descarga del archivo XML en el navegador del usuario
  function descargarArchivoXML() {
    const asunto = inputAsunto.value.trim() || 'sugerencia';
    const xmlContent = generarXML();
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = asunto.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'propuesta';
    a.href = url;
    a.download = `sugerencia-${safeName}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarMensaje('✓ Archivo XML generado y descargado correctamente.');
  }

  // Generar redacción formal para el cuerpo del correo
  function generarCuerpoCorreo() {
    const esAnonimo = checkAnonimo ? checkAnonimo.checked : false;
    const remitente = esAnonimo ? 'Anónimo (Identidad protegida)' : (inputNombre.value.trim() || 'Estudiante');
    const contacto = esAnonimo ? 'No aplica (Envío Anónimo)' : (inputCorreoEstudiante.value.trim() || 'No registrado');
    const programa = inputPrograma.value.trim() || 'No especificado';
    const semestre = inputSemestre.value.trim() || 'No especificado';
    const categoria = selectCategoria.value || 'General';
    const asunto = inputAsunto.value.trim();
    const situacion = textareaSituacion.value.trim();
    const solucion = textareaSolucion.value.trim();
    const xml = generarXML();

    return `POLITÉCNICO DE LOS LLANOS
BUZÓN DE SUGERENCIAS Y MEJORA DEL AMBIENTE ESTUDIANTIL
============================================================

DATOS DEL REMITENTE:
• Tipo de propuesta: ${esAnonimo ? 'ANÓNIMA' : 'IDENTIFICADA'}
• Estudiante: ${remitente}
• Correo de contacto: ${contacto}
• Programa académico: ${programa}
• Semestre / Jornada: ${semestre}

DETALLES DE LA PROPUESTA:
• Área: ${categoria}
• Asunto: ${asunto}

1. SITUACIÓN ACTUAL OBSERVADA:
${situacion}

2. PROPUESTA DE SOLUCIÓN:
${solucion}

============================================================
REGISTRO ESTRUCTURADO (FORMATO XML / XSLT):
============================================================
${xml}
`;
  }

  // Validar campos antes de cualquier acción de envío
  function validarCampos() {
    if (!selectCategoria.value) {
      if (customSelectWrapper) {
        customSelectWrapper.classList.remove('shake');
        void customSelectWrapper.offsetWidth;
        customSelectWrapper.classList.add('shake');
        customSelectWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      mostrarMensaje('Por favor selecciona un área para tu propuesta.');
      return false;
    }

    if (!inputPrograma.value.trim()) {
      inputPrograma.focus();
      mostrarMensaje('Por favor indica tu programa académico o carrera.');
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
      inputDestino.focus();
      mostrarMensaje('Por favor ingresa un correo o Gmail receptor.');
      return false;
    }

    return true;
  }

  // Acción 1: Envío REAL y directo por red a la bandeja de correo / Gmail (FormSubmit API)
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    const destino = inputDestino.value.trim();
    const asunto = inputAsunto.value.trim();
    const esAnonimo = checkAnonimo ? checkAnonimo.checked : false;
    const remitente = esAnonimo ? 'Anónimo (Identidad protegida)' : (inputNombre.value.trim() || 'Estudiante');
    const contacto = esAnonimo ? 'No aplica (Envío Anónimo)' : (inputCorreoEstudiante.value.trim() || 'No proporcionado');
    const programa = inputPrograma.value.trim() || 'No especificado';
    const semestre = inputSemestre.value.trim() || 'No especificado';
    const categoria = selectCategoria.value || 'General';
    const situacion = textareaSituacion.value.trim();
    const solucion = textareaSolucion.value.trim();
    const xml = generarXML();

    // Activar estado de carga visual tipo Apple
    if (btnEnviar) btnEnviar.disabled = true;
    if (btnSpinner) btnSpinner.hidden = false;
    if (btnTexto) btnTexto.textContent = 'Enviando propuesta al servidor y correo...';

    const payload = {
      _subject: `[Politécnico de los Llanos] Sugerencia: ${asunto}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: esAnonimo ? 'noreply@estudiantes.xuanii.com' : (contacto.includes('@') ? contacto : 'noreply@estudiantes.xuanii.com'),
      'Institución': 'Politécnico de los Llanos',
      'Tipo de Envío': esAnonimo ? 'Anónimo (Identidad protegida)' : 'Estudiante identificado',
      'Estudiante': remitente,
      'Correo de Contacto': contacto,
      'Programa Académico': programa,
      'Semestre / Jornada': semestre,
      'Área de la Sugerencia': categoria,
      'Asunto': asunto,
      'Situación Observada': situacion,
      'Propuesta de Solución': solucion,
      'Fecha y Hora': new Date().toLocaleString('es-CO'),
      'Estructura XML': xml
    };

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(destino)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success === 'true' || data.success === true) {
        // Éxito rotundo: Correo recibido en la bandeja
        abrirModal(
          '¡Propuesta Entregada con Éxito!',
          `Tu sugerencia se envió correctamente al servidor y ha sido entregada en la bandeja de entrada del correo:`,
          `<strong>Destino:</strong> ${destino}<br>
           <strong>Remitente:</strong> ${remitente}<br>
           <strong>Área:</strong> ${categoria}<br>
           <strong>Asunto:</strong> ${asunto}`
        );
        resetearFormularioPreservandoDestino();
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        // Primera vez con este correo: FormSubmit envía un enlace de activación por seguridad
        abrirModal(
          '¡Paso Final de Activación!',
          `FormSubmit envió un correo de activación a <strong>${destino}</strong> para autorizar la recepción de mensajes.`,
          `Para que este y los próximos correos lleguen automáticamente:<br>
           1. Abre tu Gmail o bandeja de entrada en <strong>${destino}</strong>.<br>
           2. Haz clic en el enlace <em>"Activate Form"</em> (solo se hace 1 vez).<br>
           3. ¡Listo! A partir de ese momento todas las sugerencias entrarán directo.`
        );
      } else {
        // Fallback elegante
        mostrarMensaje(data.message || 'No se pudo entregar por la red. Puedes usar "Abrir en Gmail Web".');
      }
    } catch (err) {
      console.warn('Error al conectar con FormSubmit:', err);
      mostrarMensaje('No hubo conexión con el servidor. Abriendo opción alternativa en Gmail Web...');
      // Ofrecer abrir Gmail Web
      abrirGmailWeb();
    } finally {
      if (btnEnviar) btnEnviar.disabled = false;
      if (btnSpinner) btnSpinner.hidden = true;
      if (btnTexto) btnTexto.textContent = '✉️ Enviar Sugerencia al Correo';
    }
  });

  // Acción 2: Abrir directamente en Gmail Web en el navegador
  function abrirGmailWeb() {
    if (!validarCampos()) return;

    const destino = inputDestino.value.trim();
    const asunto = inputAsunto.value.trim();
    const asuntoCompleto = `[Politécnico de los Llanos] Sugerencia: ${asunto}`;
    const cuerpo = generarCuerpoCorreo();

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(destino)}&su=${encodeURIComponent(asuntoCompleto)}&body=${encodeURIComponent(cuerpo)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    mostrarMensaje('Abriendo Gmail Web con la propuesta formal redactada...');
  }

  btnGmailDirecto?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirGmailWeb();
  });

  // Acción 3: Descargar constancia XML
  btnDescargarXML?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!inputAsunto.value.trim() && !textareaSolucion.value.trim()) {
      mostrarMensaje('Por favor completa al menos el asunto y la propuesta para generar el XML.');
      return;
    }
    descargarArchivoXML();
  });

  // Modal de confirmación
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
  btnModalDescargarXML?.addEventListener('click', () => {
    descargarArchivoXML();
  });

  modalConfirmacion?.addEventListener('click', (e) => {
    if (e.target === modalConfirmacion) cerrarModal();
  });

  function resetearFormularioPreservandoDestino() {
    const destinoActual = inputDestino.value;
    form.reset();
    inputDestino.value = destinoActual;
    selectCategoria.value = '';
    triggerText.textContent = 'Selecciona un área...';
    triggerIcon.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>`;
    dropdownItems.forEach((i) => i.classList.remove('selected'));
    if (checkAnonimo) checkAnonimo.checked = false;
    inputNombre.disabled = false;
    inputCorreoEstudiante.disabled = false;
    inputNombre.placeholder = 'Tu nombre y apellido';
    inputCorreoEstudiante.placeholder = 'ejemplo@correo.com';
    if (grupoNombre) grupoNombre.style.opacity = '1';
    if (grupoCorreo) grupoCorreo.style.opacity = '1';
  }

  // Notificación flotante fluida tipo Apple
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
