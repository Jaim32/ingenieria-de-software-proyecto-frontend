# 🌟 LifeSync Frontend Documentation

## 📘 Introducción

### 🖥️ Nombre del proyecto
**LifeSync – Frontend**

### 📌 Versión
*1.0*

### 🎯 Propósito del frontend
El frontend de **LifeSync** proporciona una interfaz moderna, intuitiva y responsiva que permite a los usuarios interactuar con todas las funcionalidades del ecosistema LifeSync, incluyendo:

- Registro e inicio de sesión  
- Gestión de hidratación  
- Manejo de recetas y platillos  
- Seguimiento de rachas  
- Visualización de su progreso diario  
- Publicación y visualización de posts  
- Comentarios sobre publicaciones  

El frontend está diseñado para ser rápido, modular, escalable y fácil de mantener.

---

## 🛠 Tecnologías utilizadas

### 🔧 Core
- **React (Vite o CRA según tu proyecto)**
- **JavaScript / TypeScript**
- **HTML5**
- **CSS3 / TailwindCSS**
- **Axios** para consumo de API
- **React Router DOM** para navegación
- **Context API** o **localStorage** para manejo de sesión
- **JWT** para autenticación

---

## 🔐 Autenticación y Sesión

### 🔑 Manejo de credenciales
- El token JWT retornado por el backend se almacena en:
  - `localStorage` → persistencia
  - `Authorization Header` → en cada petición protegida

### 🚪 Login
- Solicitud enviada a `/api/auth/login`
- Guarda token, idUsuario y rol en localStorage
- Redirige al dashboard según el rol

### 🚫 Logout
- Limpia el localStorage
- Redirige a `/login`

---


---

## 📁 Explicación de carpetas

### 📌 `assets/`
Contiene todos los recursos gráficos y estáticos:
- Imágenes (PNG, JPG)
- Íconos (SVG)
- Archivos de estilo globales
- Logos del proyecto LifeSync

---

### 📌 `components/`
Componentes reutilizables que se utilizan en diferentes páginas.
Ejemplos:
- Cards (PostCard, RecetaCard, HidratacionCard)
- Modales (ModalCreatePost, ModalConfirmación)
- Inputs personalizados
- Botones reutilizables

El objetivo es evitar duplicación de UI y mantener un diseño consistente.

---

### 📌 `hooks/`
Custom hooks con lógica reutilizable:
- `useAuth` → manejo de login/logout, token y usuario actual  
- `useFetch` → consumo estandarizado de API  
- `useLoading` → estados de carga  
- `useForm` (si aplica) → manejo de formularios

---

### 📌 `pages/`
Todas las vistas principales mostradas al usuario final.
Incluye pantallas como:
- Login
- Register
- Home
- Perfil
- Hidratación
- Platillos
- Recetas
- Racha
- Posts
- DetallePost
- Configuración

Cada página puede tener subcomponentes propios en su carpeta.

---

### 📌 `services/`
Aquí se centralizan todas las llamadas al backend, por ejemplo:
- `authService.js`
- `userService.js`
- `hidratacionService.js`
- `platilloService.js`
- `recetaService.js`
- `postService.js`
- `comentarioService.js`

Cada servicio expone funciones como:
- get  
- create  
- update  
- delete  

Esto permite mantener todo el acceso a API en un solo lugar.

---

### 📌 `utils/`
Funciones auxiliares del proyecto:
- Validadores (correo, contraseña, campos vacíos)
- Formateadores (fechas, números)
- Helpers (manejo de errores, parseadores)
- Constantes (API base URL, roles, mensajes)

---

### 📌 `context/`
Contiene contextos globales de React, por ejemplo:
- `AuthContext` → manejo global del usuario autenticado  
- `ThemeContext` (si existe)  
- `AppContext` para estados globales  

Permite acceso sin prop drilling.

---

### 📌 `router/`
Configuración de rutas usando **React Router DOM**:
- Rutas públicas (Login, Register)
- Rutas privadas (Home, Perfil, Posts, Hidratación)
- ProtectedRoute / PrivateRoute con validación de token
- Control por roles (AdminRoute, UserRoute)

---

### 📌 `App.jsx`
Punto central de la aplicación:
- Importa Router
- Define layout general
- Renderiza páginas según la ruta
- Puede incluir navegación global o wrappers

---

### 📌 `main.jsx`
Archivo raíz que renderiza la aplicación en el DOM:
- Importa `<App />`
- Envueltas como `<BrowserRouter>` o `<AuthProvider>`
- Renderizado a `#root`

----
### 🎯 Ventajas de esta estructura

-Separación clara de responsabilidades

-Fácil escalabilidad

-Reutilización de componentes

-Integración limpia con API

-Navegación estructurada

-Mantenimiento rápido y ordenado

