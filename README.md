# Sistema de Información para Tutorías

Sistema de gestión de tutorías construido con Next.js 14, React, TypeScript y Tailwind CSS.

## Requisitos Previos

- Node.js 18+ instalado
- Backend API corriendo en `http://localhost:8080/api/v1`
- CORS habilitado en el backend para permitir solicitudes desde el frontend

## Configuración

1. Clone el repositorio e instale las dependencias:

```bash
npm install
```

2. Configure las variables de entorno:

Copie `.env.example` a `.env.local` y ajuste la URL base de la API si es necesario:

```bash
cp .env.example .env.local
```

3. Asegúrese de que el backend esté configurado con CORS habilitado para permitir solicitudes desde `http://localhost:3000`

## Desarrollo

Ejecute el servidor de desarrollo:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador.

## Flujo de Autenticación

1. El usuario inicia sesión con su ID y contraseña en `/login`
2. El sistema recibe un token JWT (válido por 1 hora) y los datos del usuario
3. El token se almacena en localStorage y se adjunta a todas las solicitudes protegidas
4. Si el usuario requiere cambiar la contraseña, se redirige a `/change-password`
5. Después de cambiar la contraseña, el usuario debe iniciar sesión nuevamente
6. El token expira después de 1 hora y el usuario debe iniciar sesión nuevamente

## Estructura del Proyecto

```
├── app/                    # Rutas de Next.js (App Router)
│   ├── login/             # Página de inicio de sesión
│   ├── dashboard/         # Panel principal
│   ├── change-password/   # Cambio de contraseña
│   └── ...               # Otras páginas
├── components/            # Componentes React reutilizables

│   ├── ui/               # Componentes de shadcn/ui
│   └── auth-guard.tsx    # Componente de protección de rutas
├── lib/                   # Utilidades y lógica de negocio
│   ├── api.ts            # Cliente API centralizado
│   ├── auth-context.tsx  # Contexto de autenticación
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Funciones auxiliares
└── public/               # Archivos estáticos
```

## Roles del Sistema

- **ADMIN**: Gestión completa de usuarios, cronogramas, asignaciones y reportes
- **TUTOR**: Crear y actualizar sesiones de tutoría, imprimir certificados
- **CHECKER**: Consultar reportes y listas por fecha
- **STUDENT**: Ver sesiones propias e historial

## Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **shadcn/ui**: Componentes de UI
- **Fetch API**: Comunicación con el backend

## Notas de Seguridad

- Los tokens JWT se almacenan en localStorage (considere usar httpOnly cookies en producción)
- Todas las rutas protegidas requieren autenticación
- El middleware verifica permisos basados en roles
- Las contraseñas se manejan de forma segura en el backend
