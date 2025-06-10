# 🚀 Configuração do Heroku

## 1. Configurar Variáveis de Ambiente

```bash
# MongoDB Atlas
heroku config:set MONGODB_URI="mongodb+srv://ninvit:6a9p91SE6aO7RN8E@cluster0.bezll.mongodb.net/ninfinances"

# JWT Secret (256+ bits)
heroku config:set JWT_SECRET="minhaChaveSecretaMuitoSeguraComMaisDe256Bits12345678901234567890123456789012345678901234567890"

# CORS Origins
heroku config:set ALLOWED_ORIGINS="https://ninfinances-415b08c409ff.herokuapp.com"

# Verificar configurações
heroku config
```

## 2. Deploy

```bash
# Fazer deploy
./deploy.sh

# Ou manualmente:
git add .
git commit -m "Deploy to production"
git push heroku main
```

## 3. Verificar Logs

```bash
# Ver logs em tempo real
heroku logs --tail

# Ver logs específicos
heroku logs --source app
```

## 4. Comandos Úteis

```bash
# Abrir app no browser
heroku open

# Reiniciar app
heroku restart

# Ver status
heroku ps

# Executar comando no container
heroku run bash
```

## 5. URLs

- **App**: https://ninfinances-415b08c409ff.herokuapp.com
- **API**: https://ninfinances-415b08c409ff.herokuapp.com/api/transactions
- **Login**: https://ninfinances-415b08c409ff.herokuapp.com/login.html 