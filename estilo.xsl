<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="es">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Constancia de Sugerencia • Politécnico de los Llanos</title>
        <style>
          body {
            background-color: #f8fafc;
            color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 3rem 1.5rem;
            line-height: 1.6;
          }
          .constancia {
            max-width: 650px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-top: 4px solid #dc2626;
            padding: 2.5rem;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(15, 23, 42, 0.06);
          }
          .logo-box {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 1.25rem;
          }
          .logo-box img {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #e2e8f0;
          }
          .institucion {
            font-size: 0.95rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #0f172a;
          }
          .institucion-sub {
            font-size: 0.76rem;
            color: #64748b;
          }
          h1 {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e2e8f0;
            color: #0f172a;
          }
          .campo {
            margin-bottom: 1.1rem;
          }
          .etiqueta {
            font-size: 0.78rem;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.04em;
            display: block;
            margin-bottom: 0.2rem;
          }
          .valor {
            font-size: 0.95rem;
            color: #0f172a;
          }
          .caja-texto {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #dc2626;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 0.3rem;
            color: #334155;
          }
          .footer-nota {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            font-size: 0.82rem;
            color: #64748b;
            display: flex;
            justify-content: space-between;
          }
          .btn {
            display: inline-block;
            margin-top: 1.5rem;
            color: #ffffff;
            background: #dc2626;
            padding: 0.65rem 1.3rem;
            text-decoration: none;
            font-weight: 600;
            border-radius: 4px;
            font-size: 0.88rem;
            transition: background 0.15s;
          }
          .btn:hover {
            background: #b91c1c;
          }
        </style>
      </head>
      <body>
        <div class="constancia">
          <div class="logo-box">
            <img src="img/logo.jpg" alt="Logo Politécnico de los Llanos"/>
            <div>
              <div class="institucion"><xsl:value-of select="buzonEstudiantil/@institucion"/></div>
              <div class="institucion-sub">Institución de Educación para el Trabajo y el Desarrollo Humano</div>
            </div>
          </div>

          <h1>Registro de Sugerencia Estudiantil</h1>

          <div class="campo">
            <span class="etiqueta">Área o Categoría</span>
            <div class="valor"><xsl:value-of select="buzonEstudiantil/propuesta/area"/></div>
          </div>

          <div class="campo">
            <span class="etiqueta">Asunto</span>
            <div class="valor" style="font-weight: 700;"><xsl:value-of select="buzonEstudiantil/propuesta/asunto"/></div>
          </div>

          <div class="campo">
            <span class="etiqueta">Situación Observada</span>
            <div class="caja-texto"><xsl:value-of select="buzonEstudiantil/propuesta/situacionActual"/></div>
          </div>

          <div class="campo">
            <span class="etiqueta">Propuesta de Solución</span>
            <div class="caja-texto"><xsl:value-of select="buzonEstudiantil/propuesta/solucionPropuesta"/></div>
          </div>

          <div class="footer-nota">
            <span>Remitente: <strong><xsl:value-of select="buzonEstudiantil/remitente/nombre"/></strong> (<xsl:value-of select="buzonEstudiantil/remitente/programa"/>)</span>
            <span>Fecha: <xsl:value-of select="buzonEstudiantil/fechaRegistro"/></span>
          </div>

          <a href="index.html" class="btn">← Volver al formulario principal</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
