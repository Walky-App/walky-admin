# 🛡️ Sistema de Qualidade de Código - Walky Admin

Sistema automatizado de verificação de qualidade que garante:

- ✅ Test IDs em todos os elementos interativos
- ♿ Acessibilidade (WCAG compliance)
- 🧪 Testes unitários passando
- 🔎 Código sem erros de lint

## 📋 Verificações Automáticas

### 1. Pre-commit Hook (Local)

Executa **antes de cada commit**:

```bash
git commit -m "feat: novo componente"

# Executa automaticamente:
# ✓ Verifica test IDs
# ✓ Verifica acessibilidade
# ✓ Roda testes
# ✓ Executa linter
```

Se alguma verificação falhar, o commit é **bloqueado** até corrigir.

### 2. GitHub Actions (CI/CD)

Executa em **Pull Requests** e **pushs** para main/develop:

- Mesmas verificações do pre-commit
- Gera relatório de cobertura de testes
- Mostra status checks na PR (como na imagem)

## 🚀 Scripts Disponíveis

```bash
# Verificar apenas test IDs
yarn check:testids

# Verificar apenas acessibilidade
yarn check:a11y

# Executar todas as verificações
yarn check:all

# Rodar testes
yarn test

# Testes com UI
yarn test:ui

# Cobertura de testes
yarn test:coverage
```

## 📝 Regras de Qualidade

### Test IDs

Todos os elementos interativos devem ter `data-testid`:

```tsx
// ✅ Correto
<button data-testid="submit-button">Enviar</button>
<input data-testid="email-input" type="email" />
<form data-testid="login-form">

// ❌ Incorreto
<button>Enviar</button>
<input type="email" />
```

### Acessibilidade

Elementos devem ter atributos de acessibilidade:

```tsx
// ✅ Correto
<img src="logo.png" alt="Logo Walky" />
<input aria-label="Email" aria-required="true" />
<button aria-label="Enviar formulário">

// ❌ Incorreto
<img src="logo.png" />
<input />
<button><svg>...</svg></button>
```

## 🔧 Configuração

### Pre-commit Hook

Localização: `.husky/pre-commit`

Para desabilitar temporariamente:

```bash
git commit --no-verify -m "message"
```

### GitHub Actions

Workflow: `.github/workflows/code-quality.yml`

Triggers:

- Pull requests para `main`, `develop`, `feat/*`
- Push para `main`, `develop`

## 📊 Estatísticas Atuais

- **48 testes** passando
- **4 arquivos de teste**
- **100% cobertura** de componentes V2

## 🐛 Troubleshooting

### "Componentes sem data-testid"

Adicione `data-testid` aos elementos listados no erro.

### "Problemas de acessibilidade"

- Imagens: adicione `alt="descrição"`
- Inputs: adicione `aria-label` ou associe com `<label>`
- Buttons: adicione `aria-label` ou texto visível

### "Testes falharam"

Execute `yarn test` localmente para ver detalhes.

### Husky deprecated warning

O warning é informativo. O hook funciona normalmente.

## 📚 Mais Informações

- [Documentação Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GitHub Actions](https://docs.github.com/en/actions)
