# Buzón de Sugerencias Estudiantiles • Politécnico de los Llanos

Plataforma web institucional desarrollada con **HTML5, CSS3, JavaScript, XML y XSLT**, diseñada para la recepción, formalización y envío directo de propuestas de mejora en el ambiente estudiantil del **Politécnico de los Llanos**.

Dominio oficial en producción: **`https://estudiantes.xuanii.com`**

---

## 🎯 ¿De qué trata este proyecto?

Es un canal oficial, accesible y confidencial donde cualquier estudiante del Politécnico de los Llanos puede redactar una propuesta para mejorar:
- **Salud Mental y Bienestar:** Apoyo psicosocial, descanso y prevención del estrés académico.
- **Aulas e Infraestructura:** Mantenimiento de aulas, baños, iluminación y ventilación.
- **Convivencia y Respeto:** Prevención de conflictos, fomento del respeto y ambiente sano.
- **Cafetería y Alimentación:** Precios justos, higiene y áreas de comedor.
- **Biblioteca y Recursos de Estudio:** Material bibliográfico, salas de estudio y computadores.
- **Transporte y Seguridad:** Acceso al campus, paraderos e iluminación externa.

---

## ✨ Características Principales

1. **Envío Directo a Gmail / Correo Institucional por Red:**
   - La plataforma envía la propuesta de manera automática por internet directamente a la bandeja de entrada del correo o Gmail receptor.
   - Cuenta con botón complementario para redactar directamente en **Gmail Web** con 1 clic.

2. **Modo 100% Anónimo:**
   - El estudiante puede marcar la casilla *"Deseo enviar esta sugerencia de manera anónima"*.
   - **No se exige iniciar sesión ni tener correo electrónico** para enviar la sugerencia, protegiendo totalmente la identidad del estudiante.

3. **Generación y Descarga de Constancia en XML:**
   - Cada propuesta genera un documento estructurado en formato **XML** que cumple con el esquema `sugerencias.xsd`.
   - Incluye referencia a la hoja de transformación **XSLT (`estilo.xsl`)**, lo que permite abrir el archivo `.xml` directamente en cualquier navegador web y visualizarlo como un certificado institucional con diseño formal.

---

## 📂 Estructura de Archivos

| Archivo | Función |
|---|---|
| **`index.html`** | Página principal con formulario institucional, casilla desplegable animada y modales. |
| **`css/styles.css`** | Estilos visuales institucionales en blanco y rojo, con animaciones suaves y fluidas. |
| **`js/app.js`** | Lógica de validación, envío por red a Gmail/correo, descarga de XML y apertura de Gmail Web. |
| **`sugerencias.xml`** | Plantilla de datos estructurados en formato XML. |
| **`sugerencias.xsd`** | Esquema XML formal para validación de estructura de datos. |
| **`estilo.xsl`** | Hoja XSLT que transforma y maqueta el XML en una constancia visual formal al abrirlo en el navegador. |
| **`CNAME`** | Configuración de dominio personalizado para GitHub Pages (`estudiantes.xuanii.com`). |
| **`iniciar_servidor.sh`** | Script de inicio de servidor web local para Linux / macOS (`http://localhost:8080`). |
| **`iniciar_servidor.bat`** | Script de inicio de servidor web local para Windows (`http://localhost:8000`). |

---

## 🚀 Uso Local

### En Linux / macOS:
```bash
./iniciar_servidor.sh
```
Abre en tu navegador: `http://localhost:8080`

### En Windows:
Doble clic en `iniciar_servidor.bat` o abre `index.html` directamente en tu navegador.
