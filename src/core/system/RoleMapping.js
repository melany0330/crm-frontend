/**
 * Mapeo de roles del sistema
 * Define los roles disponibles y sus identificadores
 */
export const ROLES = {
    ADMINISTRADOR: { id: 1, name: 'ADMINISTRADOR', displayName: 'Administrador' },
    VENDEDOR: { id: 2, name: 'VENDEDOR', displayName: 'Vendedor' },
    GERENTE_MERCADEO: { id: 3, name: 'GERENTE_MERCADEO', displayName: 'Gerente de Mercadeo' },
    // Agregar más roles según sea necesario
};

/**
 * Mapeo inverso: ID del rol -> información del rol
 */
export const ROLE_BY_ID = Object.values(ROLES).reduce((acc, role) => {
    acc[role.id] = role;
    return acc;
}, {});

/**
 * Mapeo por nombre: nombre del rol -> información del rol
 */
export const ROLE_BY_NAME = Object.values(ROLES).reduce((acc, role) => {
    acc[role.name] = role;
    return acc;
}, {});

/**
 * Obtiene la información de un rol por su ID
 * @param {number} roleId - ID del rol
 * @returns {Object|null} Información del rol o null si no existe
 */
export const getRoleById = (roleId) => {
    return ROLE_BY_ID[roleId] || null;
};

/**
 * Obtiene la información de un rol por su nombre
 * @param {string} roleName - Nombre del rol
 * @returns {Object|null} Información del rol o null si no existe
 */
export const getRoleByName = (roleName) => {
    return ROLE_BY_NAME[roleName] || null;
};

/**
 * Verifica si un ID de rol es válido
 * @param {number} roleId - ID del rol a verificar
 * @returns {boolean} True si el rol existe
 */
export const isValidRoleId = (roleId) => {
    return roleId && ROLE_BY_ID.hasOwnProperty(roleId);
};

/**
 * Verifica si un nombre de rol es válido
 * @param {string} roleName - Nombre del rol a verificar
 * @returns {boolean} True si el rol existe
 */
export const isValidRoleName = (roleName) => {
    return roleName && ROLE_BY_NAME.hasOwnProperty(roleName);
};

/**
 * Obtiene todos los roles disponibles
 * @returns {Array} Array con todos los roles
 */
export const getAllRoles = () => {
    return Object.values(ROLES);
};