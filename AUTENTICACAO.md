# Sistema de Autenticação - LibTech

## 📋 Arquivos Criados

### 1. **AuthService** (`src/app/services/auth.service.ts`)
Gerencia toda a lógica de autenticação:
- Login/logout
- Armazenamento de token JWT
- Verificação de autenticação
- Controle de tipos de usuário (ALUNO/ADMIN)

### 2. **AuthInterceptor** (`src/app/interceptors/auth.interceptor.ts`)
Adiciona automaticamente o token JWT em todas as requisições HTTP.

### 3. **AuthGuards** (`src/app/guards/auth.guard.ts`)
Protege rotas específicas:
- `authGuard`: Requer autenticação
- `adminGuard`: Requer ser ADMIN
- `alunoGuard`: Requer ser ALUNO

## 🔧 Configuração do Backend (Spring Boot)

### Endpoint de Login Esperado

O frontend espera que seu backend tenha um endpoint:

```http
POST http://localhost:8080/api/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta esperada (sucesso - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "ALUNO",
  "email": "usuario@example.com",
  "nome": "Nome do Usuário"
}
```

**Resposta de erro (401):**
```json
{
  "message": "Email ou senha inválidos"
}
```

### Exemplo de Controller Kotlin (Spring Boot)

```kotlin
@RestController
@RequestMapping("/api")
class AuthController(
    private val authService: AuthenticationService,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        return try {
            val usuario = authService.authenticate(request.email, request.password)
            val token = jwtTokenProvider.generateToken(usuario)
            
            ResponseEntity.ok(LoginResponse(
                token = token,
                tipo = usuario.tipo,
                email = usuario.email,
                nome = usuario.nome
            ))
        } catch (e: BadCredentialsException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
    }
}

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val tipo: TipoUsuario,
    val email: String,
    val nome: String?
)

enum class TipoUsuario {
    ALUNO, ADMIN
}
```

### Configuração CORS (já corrigida)

```kotlin
@Configuration
class WebConfig: WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
    }
}
```

## 🚀 Como Usar

### 1. Iniciar Backend Spring Boot
```bash
# No IntelliJ IDEA, clique em Run
# Ou via terminal na pasta do backend:
./mvnw spring-boot:run
```

### 2. Iniciar Frontend Angular
```powershell
# Na pasta do projeto frontend
npm install
ng serve
```

### 3. Acessar a Aplicação
- Frontend: http://localhost:4200
- Backend: http://localhost:8080

## 🔐 Fluxo de Autenticação

1. **Login**: Usuário insere email/senha e escolhe tipo (Aluno ou Admin)
2. **Validação**: Backend valida credenciais e tipo de usuário
3. **Token JWT**: Backend retorna token que é armazenado no localStorage
4. **Interceptor**: Todas requisições subsequentes incluem `Authorization: Bearer <token>`
5. **Guards**: Protegem rotas e redirecionam usuários não autorizados
6. **Logout**: Remove token e dados do localStorage

## 📝 Exemplos de Uso no Código

### Usar AuthService em um Componente

```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export class MeuComponente {
  constructor(private authService: AuthService) {}

  verificarUsuario() {
    // Verifica se está autenticado
    if (this.authService.isAuthenticated()) {
      console.log('Usuário autenticado');
    }

    // Pega dados do usuário atual
    const usuario = this.authService.currentUserValue;
    console.log('Email:', usuario?.email);

    // Verifica tipo
    if (this.authService.isAdmin()) {
      console.log('É administrador');
    }
  }

  fazerLogout() {
    this.authService.logout();
  }
}
```

### Chamar API Protegida

```typescript
import { HttpClient } from '@angular/common/http';

export class LivrosService {
  constructor(private http: HttpClient) {}

  getLivros() {
    // O token JWT é adicionado automaticamente pelo interceptor
    return this.http.get('http://localhost:8080/api/livros');
  }
}
```

## 🛡️ Segurança

- Token JWT armazenado no `localStorage`
- Interceptor adiciona token automaticamente
- Guards impedem acesso não autorizado
- Validação de tipo de usuário (ALUNO/ADMIN)
- Verificação de expiração de token

## 🔍 Solução de Problemas

### Erro de CORS
- Verifique se o backend está rodando em `localhost:8080`
- Confirme que a configuração CORS está correta (use `allowedMethods` em vez de `allowedOrigins` duplicado)

### Token não enviado
- Verifique se o `authInterceptor` está registrado no `app.config.ts`
- Confirme que o token está no localStorage: abra DevTools → Application → Local Storage

### Redirecionamento não funciona
- Verifique se os guards estão aplicados corretamente nas rotas
- Confirme que o backend retorna o campo `tipo` corretamente

### Login retorna 404
- Verifique se o endpoint `/api/login` existe no backend
- Confirme que o backend está rodando

## 📦 Dependências Necessárias

```json
{
  "@angular/common": "^18.x",
  "@angular/core": "^18.x",
  "@angular/router": "^18.x",
  "@angular/forms": "^18.x",
  "rxjs": "^7.x"
}
```

## 🎯 Próximos Passos

1. Implementar "Lembrar-me" (checkbox do formulário)
2. Adicionar recuperação de senha
3. Implementar refresh token
4. Adicionar loading spinner global
5. Melhorar tratamento de erros
6. Adicionar testes unitários

---

**Desenvolvido para LibTech - Sistema de Biblioteca**
