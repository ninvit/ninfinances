# 💰 NinFinances

Sistema de gestão financeira pessoal com backend Java Spring Boot e frontend HTML/CSS/JavaScript.

## 🚀 Tecnologias

- **Backend**: Java 21 + Spring Boot 3.2.3
- **Banco de Dados**: MongoDB Atlas
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Autenticação**: JWT
- **Deploy**: Heroku

## 🏗️ Estrutura do Projeto

```
ninfinances/
├── src/                    # Código fonte Java
│   ├── main/
│   │   ├── java/          # Classes Java
│   │   └── resources/     # Configurações
│   └── test/              # Testes
├── target/                # Build Maven
├── *.html                 # Frontend (páginas)
├── *.css                  # Estilos
├── *.js                   # Scripts JavaScript
├── assets/                # Recursos estáticos
├── pom.xml               # Configuração Maven
├── Procfile              # Configuração Heroku
└── system.properties     # Versão Java para Heroku
```

## 🔧 Configuração Local

### Pré-requisitos
- Java 21
- Maven 3.6+
- MongoDB Atlas (ou local)

### Executar Backend
```bash
# Compilar e executar
./mvnw spring-boot:run

# Ou usando Maven diretamente
mvn spring-boot:run
```

### Executar Frontend
```bash
# Servidor simples Python
python3 -m http.server 8082

# Ou use qualquer servidor web estático
```

## 🌐 Deploy no Heroku

### Backend (Automático)
```bash
# Já configurado com Procfile e system.properties
git push heroku main
```

### Frontend
- Servido como recursos estáticos pelo Spring Boot
- Acessível em: `https://sua-app.herokuapp.com`

## 🔑 Variáveis de Ambiente

Configure no Heroku:
```
MONGODB_URI=sua_string_conexao_mongodb
JWT_SECRET=sua_chave_jwt_256bits
PORT=8080
```

## 📊 Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD de transações financeiras
- ✅ Dashboard com resumo financeiro
- ✅ Filtros por período
- ✅ Interface responsiva
- ✅ Deploy automatizado

## 🔧 Endpoints da API

- `POST /login` - Autenticação
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/{id}` - Atualizar transação
- `DELETE /api/transactions/{id}` - Excluir transação

## 🚀 URL de Produção

[https://ninfinances-415b08c409ff.herokuapp.com](https://ninfinances-415b08c409ff.herokuapp.com)
