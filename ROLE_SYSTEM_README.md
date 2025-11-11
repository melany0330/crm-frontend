# 🔐 Sistema de Gestión de Roles - Documentación Completa

## 📋 Resumen

Se ha implementado un sistema completo de gestión de roles y autenticación que incluye:

- ✅ Decodificación automática de tokens JWT
- ✅ Gestión de usuarios y roles
- ✅ Protección de componentes y rutas
- ✅ Hook personalizado para fácil uso
- ✅ Componentes UI para mostrar información de roles
- ✅ Documentación interactiva

## 🏗️ Arquitectura Implementada

### 📁 Estructura de Archivos

```
src/
├── core/system/
│   ├── JWTUtil.js              # Utilidad para decodificar JWT
│   ├── APIUtil.js              # Funciones de API y validación de roles
│   └── RoleMapping.js          # Mapeo de roles del sistema
├── model/auth/
│   └── Token.js                # Modelo de token ampliado con roles
├── service/auth/
│   └── AuthService.js          # Servicio de autenticación mejorado
├── hooks/
│   └── useAuth.js              # Hook personalizado para autenticación
├── components/
│   ├── auth/
│   │   └── RoleProtectedComponent.jsx  # Protección de componentes
│   ├── user/
│   │   └── UserRoleDisplay.jsx         # Mostrar información del usuario
│   ├── admin/
│   │   └── AdminDashboard.jsx          # Panel de administración
│   └── docs/
│       └── RoleSystemDocs.jsx          # Documentación interactiva
└── pages/
    ├── admin/
    │   └── RoleDemo.jsx                # Página de demostración
    └── docs/
        └── RoleDocumentation.jsx       # Página de documentación
```

## 🎯 Roles Definidos

| Rol | ID | Permisos |
|-----|----| ---------|
| **ADMINISTRADOR** | 1 | Acceso completo al sistema |
| **VENDEDOR** | 2 | Gestión de ventas y clientes |
| **GERENTE_MERCADEO** | 3 | Marketing y análisis |

## 🚀 Implementación del Backend

### Token JWT Esperado

El sistema espera que el backend envíe un JWT con la siguiente estructura:

```javascript
{
  "jti": "1010", // ID del usuario en binario
  "sub": "username", // Nombre de usuario
  "ri": "1", // ID del rol en binario
  "exp": 1699123456, // Timestamp de expiración
  "iat": 1699120000  // Timestamp de emisión
}
```

### Decodificación Automática

```javascript
import JWTUtil from '../core/system/JWTUtil';

const token = localStorage.getItem('authToken');
const userInfo = JWTUtil.decodeJWT(token);
// Resultado:
// {
//   userId: 10, // Convertido de binario a decimal
//   username: "username",
//   roleId: 1, // Convertido de binario a decimal
//   exp: 1699123456,
//   iat: 1699120000
// }
```

## 💻 Uso en Componentes

### 1. Hook useAuth

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
    const { 
        user, 
        isAuthenticated, 
        hasRole, 
        hasAnyRole, 
        isAdmin,
        loading 
    } = useAuth();

    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) return <div>No autenticado</div>;

    return (
        <div>
            <h1>Bienvenido {user.username}!</h1>
            <p>Tu rol: {user.roleDisplayName}</p>
            
            {isAdmin() && <AdminPanel />}
            {hasRole('VENDEDOR') && <SalesPanel />}
            {hasAnyRole(['ADMINISTRADOR', 'GERENTE_MERCADEO']) && <ReportsPanel />}
        </div>
    );
};
```

### 2. Protección de Componentes

```javascript
import RoleProtectedComponent from '../components/auth/RoleProtectedComponent';

const AdminPage = () => {
    return (
        <div>
            {/* Solo para Administradores */}
            <RoleProtectedComponent 
                roles={['ADMINISTRADOR']}
                fallback={<div>Acceso denegado</div>}
            >
                <AdminSettings />
            </RoleProtectedComponent>
            
            {/* Para múltiples roles */}
            <RoleProtectedComponent 
                roles={['VENDEDOR', 'ADMINISTRADOR']}
            >
                <SalesModule />
            </RoleProtectedComponent>
        </div>
    );
};
```

### 3. Protección de Rutas

```javascript
import RequireRoles from '../routes/RequireRoles';

// En App.jsx
<Routes>
    <Route 
        path="/admin" 
        element={
            <RequireRoles roles={['ADMINISTRADOR']}>
                <AdminPanel />
            </RequireRoles>
        } 
    />
    
    <Route 
        path="/crm" 
        element={
            <RequireRoles roles={['ADMINISTRADOR', 'VENDEDOR', 'GERENTE_MERCADEO']}>
                <CRMLayout />
            </RequireRoles>
        } 
    />
</Routes>
```

### 4. Mostrar Información del Usuario

```javascript
import UserRoleDisplay from '../components/user/UserRoleDisplay';

const Header = () => {
    return (
        <header>
            <h1>Mi Aplicación</h1>
            <UserRoleDisplay showFullInfo={true} />
        </header>
    );
};
```

## ⚙️ API Utils

```javascript
import APIUtil from '../core/system/APIUtil';

// Verificaciones de autenticación
const isLoggedIn = APIUtil.validateSession();
const currentUser = APIUtil.getCurrentUser();

// Información del usuario
const userName = APIUtil.getUserName();
const userId = APIUtil.getUserId();
const roleId = APIUtil.getUserRoleId();
const roleName = APIUtil.getUserRoleName();

// Verificaciones de roles
const isAdmin = APIUtil.isAdmin();
const hasRole = APIUtil.hasRole('VENDEDOR');
const hasAnyRole = APIUtil.hasAnyRole(['ADMIN', 'SUPERVISOR']);
const hasAllRoles = APIUtil.hasAllRoles(['ADMIN', 'SUPERVISOR']);

// Estado del token
const isExpiring = APIUtil.isTokenExpiringSoon(5); // 5 minutos
```

## 🔍 Características Avanzadas

### Verificación Automática de Expiración

El sistema verifica automáticamente si el token está próximo a expirar y puede implementar renovación automática.

### Mapeo de Roles Flexible

Los roles están definidos en `RoleMapping.js` y pueden ser fácilmente extendidos:

```javascript
export const ROLES = {
    ADMINISTRADOR: { id: 1, name: 'ADMINISTRADOR', displayName: 'Administrador' },
    VENDEDOR: { id: 2, name: 'VENDEDOR', displayName: 'Vendedor' },
    // Agregar nuevos roles aquí
    SUPERVISOR: { id: 4, name: 'SUPERVISOR', displayName: 'Supervisor' },
};
```

### Componentes UI Incluidos

- **UserRoleDisplay**: Muestra información del usuario y su rol
- **RoleProtectedComponent**: Protege contenido basado en roles
- **AdminDashboard**: Panel de administración con diferentes secciones por rol

## 🌐 Rutas Disponibles

| Ruta | Descripción | Protección |
|------|-------------|-----------|
| `/role-demo` | Demostración del sistema de roles | Login requerido |
| `/role-docs` | Documentación interactiva | Login requerido |
| `/role` | Gestión de roles (existente) | Login requerido |
| `/user` | Gestión de usuarios (existente) | Login requerido |

## 🎨 Características de UI

### Indicadores Visuales por Rol

- **Administrador**: 🔥 Icono de corona, color naranja (#ff6b35)
- **Vendedor**: 💰 Icono de traje, color turquesa (#4ecdc4)  
- **Gerente Mercadeo**: 📊 Icono de gráfico, color azul (#45b7d1)

### Responsive Design

Todos los componentes están optimizados para dispositivos móviles y escritorio.

## 🔧 Configuración Requerida

### Variables de Entorno

Asegúrate de tener configuradas las variables de entorno para la API:

```
VITE_WMS_API_AUTH=/api/auth
VITE_WMS_PROTOCOL=http
VITE_WMS_NAME=localhost
VITE_WMS_PORT=8080
```

### Dependencias

El sistema usa las siguientes dependencias existentes:
- React Router DOM (navegación)
- React Icons (iconos)
- React Toastify (notificaciones)

## 📚 Documentación Adicional

Visita `/role-docs` en la aplicación para ver la documentación interactiva completa con ejemplos de código y guías de uso.

## 🚀 Próximos Pasos

1. **Renovación Automática de Tokens**: Implementar renovación automática cuando el token esté próximo a expirar
2. **Permisos Granulares**: Extender el sistema para incluir permisos específicos además de roles
3. **Auditoría**: Implementar logging de acciones por rol
4. **Cache de Roles**: Optimizar las verificaciones de roles con cache

## 🎉 ¡Sistema Completado!

El sistema de roles está completamente implementado y listo para usar. Incluye:

- ✅ Decodificación automática de JWT
- ✅ Gestión completa de roles
- ✅ Protección de componentes y rutas  
- ✅ UI components para mostrar información
- ✅ Hook personalizado fácil de usar
- ✅ Documentación interactiva
- ✅ Ejemplos de uso
- ✅ Sistema extensible y mantenible

¡El apartado de roles de usuario está completo y funcionando! 🎊