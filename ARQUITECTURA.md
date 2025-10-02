## 📌 Resumen de Arquitectura

El proyecto está construido sobre **Next.js** con un enfoque modular y organizado en capas, siguiendo una clara separación de responsabilidades entre páginas, componentes, lógica de negocio y servicios.

### 1. **Estructura principal**

* **`app/`**: Núcleo de la aplicación con el modelo de rutas de Next.js 13 (App Router).

  * **(auth)**: Manejo de autenticación, incluye layout y componentes para el login.
  * **(dashboard)**: Panel de usuario (`[userId]`), con subsecciones como gráficos, historial, mediciones, notificaciones y perfil.
  * **(root)**: Página principal de acceso público.
  * **api/**: Endpoints tipo REST internos de Next.js para usuarios, notificaciones, condiciones relevantes y medicamentos.
  * **layout.tsx y providers.tsx**: Configuración global de layouts, estilos y providers.

### 2. **Componentes**

* **`components/shared`**: Bloques reutilizables (alertas, tablas, modales, encabezados, sidebar).
* **`components/ui`**: Librería de componentes UI inspirada en patrones de diseño modernos (inputs, botones, tablas, formularios, tooltips, etc.), actuando como Design System interno.

### 3. **Lógica de negocio y configuración**

* **`config/`**: Parámetros de configuración centralizados.
* **`lib/`**: Integraciones externas (Firebase, Prisma, utilidades generales).
* **`services/`**: Capa de consumo de APIs externas/internas.
* **`stores/`**: Manejo de estado con stores (alertas, autenticación).
* **`interfaces/`**: Definición de contratos tipados (TypeScript interfaces).

### 4. **Persistencia y backend**

* **`prisma/`**: Modelo de datos con **Prisma ORM** (`schema.prisma`).
* **`pages/api/`**: API tradicional de Next.js (en paralelo con `app/api/`), usada principalmente para autenticación con NextAuth.

### 5. **Infraestructura y configuración técnica**

* **`middleware.ts`**: Middleware global para seguridad, rutas o redirecciones.
* **Configuración y tooling**: ESLint, Jest, PostCSS, tsconfig y configuración de Next.js.
* **`public/`**: Recursos estáticos (iconos, imágenes, service workers).

### 6. **Testing**

* **`test/`**: Pruebas unitarias y de integración.

  * Tests de componentes compartidos y UI.
  * Tests de utilidades (`utils`).
  * Uso de Jest con setup personalizado.

### 7. **Utilidades**

* **`utils/`**: Funciones de apoyo, ej. cálculo de presión sanguínea y formateo de valores.

---

## 🏗️ Patrón general

* **Frontend + Backend unificado**: Uso de Next.js App Router para vistas y API Routes para endpoints.
* **Arquitectura modular**: Separación clara por dominios (`auth`, `dashboard`, `notifications`, `profile`).
* **Reutilización y consistencia**: Design System propio en `components/ui` + hooks y stores para estado global.
* **Persistencia y servicios**: Prisma ORM para BD, Firebase como integración clave, APIs encapsuladas en `services`.
* **Calidad y mantenibilidad**: Testing unitario amplio y ESLint configurado.

