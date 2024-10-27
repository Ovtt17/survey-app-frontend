export const newUserValidationRules = {
  username: {
    required: 'El nombre de usuario es obligatorio.',
    minLength: {
      value: 5,
      message: 'El nombre de usuario debe tener al menos 3 caracteres.'
    }
  },
  firstName: {
    required: 'El nombre es obligatorio.'
  },
  lastName: {
    required: 'El apellido es obligatorio.'
  },
  dateOfBirth: {
    required: 'La fecha de nacimiento es obligatoria.',
    validate: (date: Date | null) => {
      if (!date) return 'La fecha de nacimiento no puede ser nula.';
      const today = new Date();
      if (date >= today) return 'La fecha de nacimiento debe ser anterior a hoy.';
      return true;
    }
  },
  phone: {
    required: 'El teléfono es obligatorio.',
    minLength: {
      value: 8,
      message: 'El teléfono debe tener 8 caracteres.'
    },
    maxLength: {
      value: 8,
      message: 'El teléfono debe tener 8 caracteres.'
    },
    validate: (phone: string) => {
      const phoneRegex = /^[0-9]{8}$/;
      return phoneRegex.test(phone) ? true : 'El teléfono debe contener solo números y tener 8 caracteres.';
    }
  },
  email: {
    required: 'El correo electrónico es obligatorio.',
    validate: (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) ? true : 'El correo electrónico no es válido.';
    }
  },
  password: {
    required: 'La contraseña es obligatoria.',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres.'
    }
  },
  confirmPassword: {
    required: 'La confirmación de la contraseña es obligatoria.',
    validate: (confirmPassword: string, context: { password: string }) => {
      return confirmPassword === context.password ? true : 'Las contraseñas no coinciden.';
    }
  }
};