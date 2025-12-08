import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para CPF brasileiro
 */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Deixa o required cuidar de valores vazios
    }

    const cpf = control.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11) {
      return { cpfInvalid: true };
    }

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalid: true };
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;

    // Valida primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return { cpfInvalid: true };
    }

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return { cpfInvalid: true };
    }

    return null; // CPF válido
  };
}

/**
 * Validador personalizado para telefone brasileiro
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phone = control.value.replace(/[^\d]/g, '');
    
    // Aceita telefone com 10 dígitos (fixo) ou 11 dígitos (celular)
    if (phone.length !== 10 && phone.length !== 11) {
      return { phoneInvalid: true };
    }

    return null;
  };
}

/**
 * Validador para confirmar se as senhas são iguais
 */
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    if (!password || !passwordConfirm) {
      return null;
    }

    if (password.value !== passwordConfirm.value) {
      passwordConfirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Remove o erro se as senhas coincidirem
      const errors = passwordConfirm.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        passwordConfirm.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  };
}

/**
 * Máscara para CPF (XXX.XXX.XXX-XX)
 */
export function maskCpf(value: string): string {
  if (!value) return '';
  
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
  return value;
}

/**
 * Máscara para telefone brasileiro
 * (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function maskPhone(value: string): string {
  if (!value) return '';
  
  value = value.replace(/\D/g, '');
  
  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  return value;
}
