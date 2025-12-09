import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login se não estiver autenticado
  router.navigate(['/'], { queryParams: { returnUrl: state.url } });
  return false;
};


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Redireciona para home do usuário se não for admin
  router.navigate(['/users/dashboard']);
  return false;
};


export const alunoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAluno()) {
    return true;
  }

  // Redireciona para dashboard admin se for admin
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboardadm']);
    return false;
  }

  // Redireciona para login se não estiver autenticado
  router.navigate(['/']);
  return false;
};
