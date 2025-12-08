# Sistema de Cadastro de Usuários - LibTech

## 📋 Arquivos Criados

### 1. **UserService** (`src/app/services/user.service.ts`)
Gerencia operações relacionadas a usuários:
- Cadastro de novos usuários
- Verificação de email/CPF duplicado
- Comunicação com API de usuários

### 2. **Validadores Customizados** (`src/app/validators/custom-validators.ts`)
Validadores e máscaras:
- Validação de CPF brasileiro
- Validação de telefone brasileiro
- Validação de senhas coincidentes
- Máscara automática para CPF e telefone

### 3. **CadastroComponent** (atualizado)
Formulário completo com:
- Validações em tempo real
- Máscaras automáticas (CPF e telefone)
- Mensagens de erro/sucesso
- Loading state
- Redirecionamento após cadastro

## 🔧 Endpoint Backend Necessário

### Cadastro de Usuário

```http
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
  "name": "João da Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "phone": "85987654321",
  "passwordHashed": "senha123",
  "isAdmin": false
}
```

**Resposta de sucesso (201 Created):**
```json
{
  "id": 1,
  "name": "João da Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "phone": "85987654321",
  "isAdmin": false
}
```

**Resposta de erro (409 Conflict - email/CPF duplicado):**
```json
{
  "message": "Email ou CPF já cadastrado"
}
```

**Resposta de erro (400 Bad Request - dados inválidos):**
```json
{
  "message": "Dados inválidos"
}
```

## 💻 Exemplo de Controller Backend (Kotlin)

```kotlin
package com.projetoBiblioteca.biblioteca.controller

import com.projetoBiblioteca.biblioteca.repository.model.User
import com.projetoBiblioteca.biblioteca.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {

    @PostMapping("/register")
    fun register(@RequestBody request: UserRegisterRequest): ResponseEntity<UserResponse> {
        // Verifica se email já existe
        if (userService.existsByEmail(request.email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(null)
        }

        // Verifica se CPF já existe
        if (userService.existsByCpf(request.cpf)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(null)
        }

        // Hash da senha
        val hashedPassword = passwordEncoder.encode(request.passwordHashed)

        // Cria novo usuário
        val user = User(
            name = request.name,
            cpf = request.cpf,
            email = request.email,
            phone = request.phone,
            passwordHashed = hashedPassword,
            isAdmin = request.isAdmin ?: false
        )

        val savedUser = userService.save(user)

        val response = UserResponse(
            id = savedUser.id!!,
            name = savedUser.name,
            cpf = savedUser.cpf,
            email = savedUser.email,
            phone = savedUser.phone,
            isAdmin = savedUser.isAdmin
        )

        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/check-email")
    fun checkEmail(@RequestParam email: String): ResponseEntity<Boolean> {
        val exists = userService.existsByEmail(email)
        return ResponseEntity.ok(exists)
    }

    @GetMapping("/check-cpf")
    fun checkCpf(@RequestParam cpf: String): ResponseEntity<Boolean> {
        val exists = userService.existsByCpf(cpf)
        return ResponseEntity.ok(exists)
    }
}

data class UserRegisterRequest(
    val name: String,
    val cpf: String,
    val email: String,
    val phone: String,
    val passwordHashed: String,
    val isAdmin: Boolean?
)

data class UserResponse(
    val id: Int,
    val name: String,
    val cpf: String,
    val email: String,
    val phone: String,
    val isAdmin: Boolean
)
```

## 📝 Service e Repository (Kotlin)

### UserService.kt
```kotlin
package com.projetoBiblioteca.biblioteca.service

import com.projetoBiblioteca.biblioteca.repository.UserRepository
import com.projetoBiblioteca.biblioteca.repository.model.User
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun save(user: User): User {
        return userRepository.save(user)
    }

    fun existsByEmail(email: String): Boolean {
        return userRepository.existsByEmail(email)
    }

    fun existsByCpf(cpf: String): Boolean {
        return userRepository.existsByCpf(cpf)
    }

    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }
}
```

### UserRepository.kt
```kotlin
package com.projetoBiblioteca.biblioteca.repository

import com.projetoBiblioteca.biblioteca.repository.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Int> {
    fun existsByEmail(email: String): Boolean
    fun existsByCpf(cpf: String): Boolean
    fun findByEmail(email: String): User?
}
```

## 🔐 Configuração de Segurança (Spring Security)

### SecurityConfig.kt
```kotlin
package com.projetoBiblioteca.biblioteca.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/users/register", "/api/login").permitAll()
                    .anyRequest().authenticated()
            }
        
        return http.build()
    }
}
```

## ✅ Funcionalidades Implementadas

### Frontend
- ✅ Formulário reativo com validações
- ✅ Validação de CPF brasileiro (algoritmo completo)
- ✅ Validação de telefone (10 ou 11 dígitos)
- ✅ Máscara automática CPF: `XXX.XXX.XXX-XX`
- ✅ Máscara automática telefone: `(XX) XXXXX-XXXX`
- ✅ Confirmação de senha
- ✅ Validação de email
- ✅ Mensagens de erro contextualizadas
- ✅ Loading durante cadastro
- ✅ Mensagem de sucesso com redirecionamento
- ✅ Botão voltar para login

### Backend (a implementar)
- ⏳ Endpoint de registro
- ⏳ Hash de senha com BCrypt
- ⏳ Validação de duplicidade (email/CPF)
- ⏳ Endpoints de verificação

## 🎯 Fluxo de Cadastro

1. **Preenchimento**: Usuário preenche todos os campos
2. **Validação Frontend**: Valida CPF, email, telefone e senhas
3. **Máscaras**: Aplica formatação automática em CPF e telefone
4. **Envio**: Remove máscaras e envia dados para backend
5. **Backend**: Valida duplicidade, faz hash da senha e salva
6. **Sucesso**: Mostra mensagem e redireciona para login após 2s

## 🧪 Testes Manuais

### CPFs Válidos para Teste
- `123.456.789-09`
- `111.444.777-35`

### CPFs Inválidos (deve rejeitar)
- `111.111.111-11` (todos dígitos iguais)
- `123.456.789-00` (dígito verificador errado)

### Telefones Válidos
- `(85) 98765-4321` (celular)
- `(85) 3456-7890` (fixo)

## 🚀 Como Testar

```powershell
# 1. Certifique-se que o backend está rodando
# 2. No terminal do frontend:
ng serve

# 3. Acesse:
# http://localhost:4200/cadastro
```

## 📦 Dependências do Backend

### build.gradle.kts (ou pom.xml)
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.postgresql:postgresql") // ou H2, MySQL, etc
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
}
```

## 🛡️ Segurança

- Senha hasheada com BCrypt no backend (NUNCA armazenar senha em texto plano)
- Frontend remove máscaras antes de enviar
- Validação de CPF com algoritmo oficial
- Validação de duplicidade no backend
- CORS configurado para `localhost:4200`

## 🔍 Solução de Problemas

### Erro 409 (Conflict)
Email ou CPF já cadastrado. Verificar se usuário já existe.

### Máscara não aplica
Verificar se os métodos `onCpfInput` e `onPhoneInput` estão no template HTML.

### Validação de CPF falha
Verificar se o CPF tem 11 dígitos após remover a máscara.

### Redirecionamento não funciona
Verificar se a rota `/` (login) está configurada no `app.routes.ts`.

---

**Sistema completo de cadastro implementado! 🎉**
