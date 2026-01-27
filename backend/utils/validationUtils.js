// Input validation utilities
const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} is required`, statusCode: 400 };
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw { code: 'VALIDATION_ERROR', message: 'Invalid email format', statusCode: 400 };
  }
};

const validateNumeric = (value, fieldName, min = null, max = null) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} must be a number`, statusCode: 400 };
  }
  if (min !== null && num < min) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} must be at least ${min}`, statusCode: 400 };
  }
  if (max !== null && num > max) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} must be at most ${max}`, statusCode: 400 };
  }
};

const validateEnum = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} must be one of: ${allowedValues.join(', ')}`, statusCode: 400 };
  }
};

const validateDate = (dateString, fieldName) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw { code: 'VALIDATION_ERROR', message: `${fieldName} must be a valid date`, statusCode: 400 };
  }
};

const validateUserId = (userId) => {
  if (!userId || !userId.startsWith('AGT-') && !userId.startsWith('MGR-')) {
    throw { code: 'VALIDATION_ERROR', message: 'Invalid user ID format', statusCode: 400 };
  }
};

const validateRole = (role) => {
  const allowedRoles = ['agent', 'manager', 'leadership', 'admin'];
  validateEnum(role, allowedRoles, 'role');
};

module.exports = {
  validateRequired,
  validateEmail,
  validateNumeric,
  validateEnum,
  validateDate,
  validateUserId,
  validateRole
};