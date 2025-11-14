# Guia do Script de Verificação de Acessibilidade

## Visão Geral

O script `scripts/check-accessibility.js` é uma ferramenta de validação automatizada que garante conformidade com **WCAG 2.1 Level AA** em componentes React/TSX.

## Como Usar

### Execução Manual

```bash
node scripts/check-accessibility.js
```

### Integração com Git (Pre-commit)

O script roda automaticamente antes de cada commit via Husky hooks.

## Regras de Validação

### ✅ Verificações Obrigatórias (Erros)

#### 1. **Imagens** - `images`

```tsx
// ❌ ERRO
<img src="logo.png">

// ✅ CORRETO
<img src="logo.png" alt="Company logo">
<img src="decorative.png" aria-hidden="true" alt="">
```

**Regra:** Todas as imagens devem ter `alt` OU `aria-hidden="true"` se decorativas.

---

#### 2. **Botões** - `buttons`

```tsx
// ❌ ERRO - Botão sem conteúdo acessível
<button onClick={handler}>
  <svg>...</svg>
</button>

// ✅ CORRETO - Com aria-label
<button onClick={handler} aria-label="Close dialog">
  <svg>...</svg>
</button>

// ✅ CORRETO - Com texto visível
<button onClick={handler}>
  <svg>...</svg>
  Close
</button>
```

**Regra:** Botões devem ter `aria-label`, `aria-labelledby` OU texto visível.

---

#### 3. **Inputs** - `inputs`

```tsx
// ❌ ERRO
<input type="text" placeholder="Name">

// ✅ CORRETO - Com aria-label
<input type="text" aria-label="Full name">

// ✅ CORRETO - Com label associado
<label htmlFor="name">Name</label>
<input type="text" id="name">
```

**Regra:** Inputs devem ter `aria-label`, `aria-labelledby` OU `id` para associação com `<label>`.

---

#### 4. **Selects** - `selects`

```tsx
// ❌ ERRO
<select>
  <option>Option 1</option>
</select>

// ✅ CORRETO
<select aria-label="Choose option">
  <option>Option 1</option>
</select>
```

**Regra:** Mesma lógica dos inputs.

---

#### 5. **Elementos com Roles ARIA** - `regions`

```tsx
// ❌ ERRO
<div role="region">
  Content
</div>

// ✅ CORRETO
<div role="region" aria-label="User statistics">
  Content
</div>

// ✅ MELHOR - Usar heading
<section aria-labelledby="stats-heading">
  <h2 id="stats-heading">User Statistics</h2>
</section>
```

**Regra:** Roles como `region`, `group`, `radiogroup`, `tablist`, `navigation`, `complementary`, `form` devem ter `aria-label` ou `aria-labelledby`.

---

#### 6. **Radio Buttons** - `radioGroups`

```tsx
// ❌ ERRO
<button role="radio" onClick={handler}>
  Option A
</button>

// ✅ CORRETO
<button role="radio" aria-checked={selected === 'a'} onClick={handler}>
  Option A
</button>
```

**Regra:** Elementos com `role="radio"` devem ter `aria-checked`.

---

#### 7. **Tabs** - `tabs`

```tsx
// ❌ ERRO
<button role="tab" onClick={handler}>
  Profile
</button>

// ✅ CORRETO
<button role="tab" aria-selected={activeTab === 'profile'} onClick={handler}>
  Profile
</button>
```

**Regra:** Elementos com `role="tab"` devem ter `aria-selected`.

---

#### 8. **Botões com Ícones** - `iconButtons`

```tsx
// ❌ ERRO - Ícone sem contexto
<button>
  <AssetIcon name="trash" />
</button>

// ✅ CORRETO
<button aria-label="Delete item">
  <AssetIcon name="trash" />
</button>
```

**Regra:** Botões que contêm apenas ícones (SVG/AssetIcon/CIcon) devem ter `aria-label`.

---

### ⚠️ Warnings (Recomendações)

#### 1. **Uso de Semantic HTML**

```tsx
// ⚠️ WARNING
<div role="main">Content</div>

// ✅ MELHOR
<main>Content</main>
```

#### 2. **Main Landmark em Páginas**

```tsx
// ⚠️ WARNING - Arquivo em /pages-v2/
export default function Dashboard() {
  return <div>...</div>;
}

// ✅ MELHOR
export default function Dashboard() {
  return <main aria-label="Dashboard">...</main>;
}
```

#### 3. **Estilos de Foco**

```css
/* ⚠️ WARNING - Componente tem onClick mas CSS sem :focus-visible */

/* ✅ MELHOR - Adicionar no CSS */
button:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
}
```

---

## Diretórios Verificados

- ✅ `src/pages-v2/`
- ✅ `src/components-v2/`
- ✅ `src/layout-v2/`

**Excluídos:** `node_modules`, `dist`, `build`, `.git`, `coverage`, `test`, `tests`, `__tests__`

---

## Saída do Script

### ✅ Sucesso

```
♿ Checking accessibility compliance (WCAG 2.1 Level AA)...

📂 Scanning src/pages-v2...
📂 Scanning src/components-v2...
📂 Scanning src/layout-v2...

✅ All components pass accessibility checks!
🎉 Zero violations, zero warnings!
```

### ❌ Erro

```
❌ Accessibility violations found:

  📄 src/pages-v2/Dashboard/PopularFeatures/PopularFeatures.tsx
    Line 15 [buttons]: Buttons must have aria-label or visible text content
      Code: <button onClick={() => console.log('clicked')}>

🚫 Total violations: 1

💡 How to fix:
   1. Images: Add alt='description' or aria-hidden='true' for decorative images
   ...
```

---

## Integração no Workflow

### package.json

```json
{
  "scripts": {
    "check:a11y": "node scripts/check-accessibility.js"
  }
}
```

### Pre-commit Hook (.husky/pre-commit)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn type-check
yarn build
node scripts/check-accessibility.js
```

---

## Padrões ARIA Suportados

| Padrão          | Elementos           | Atributos Obrigatórios                              |
| --------------- | ------------------- | --------------------------------------------------- |
| **Radio Group** | `role="radiogroup"` | `aria-label` no grupo<br>`aria-checked` nos radios  |
| **Tab**         | `role="tablist"`    | `aria-label` no tablist<br>`aria-selected` nas tabs |
| **Button**      | `<button>`          | `aria-label` OU texto visível                       |
| **Region**      | `role="region"`     | `aria-label` OU `aria-labelledby`                   |
| **Input**       | `<input>`           | `aria-label` OU `id` + `<label>`                    |

---

## Referências WCAG 2.1

O script valida conformidade com:

- ✅ [1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- ✅ [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html)
- ✅ [2.1.1 Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- ✅ [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- ✅ [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

---

## Exemplos de Correção

### Caso 1: FeatureCard

```tsx
// ANTES (❌)
<CCard className="feature-card">
  <div className="items-list">
    {items.map(item => <div>{item.label}</div>)}
  </div>
</CCard>

// DEPOIS (✅)
<CCard className="feature-card" role="region" aria-labelledby="card-title">
  <h3 id="card-title">Top Features</h3>
  <ol className="items-list" aria-label="Feature ranking">
    {items.map(item => <li>{item.label}</li>)}
  </ol>
</CCard>
```

### Caso 2: ViewToggle

```tsx
// ANTES (❌)
<div>
  <button onClick={() => setView('grid')}>
    <GridIcon />
  </button>
</div>

// DEPOIS (✅)
<div role="group" aria-label="View mode selector">
  <button
    onClick={() => setView('grid')}
    aria-label="Grid view"
    aria-pressed={view === 'grid'}
  >
    <GridIcon aria-hidden="true" />
  </button>
</div>
```

### Caso 3: TimeSelector

```tsx
// ANTES (❌)
<div>
  <button onClick={() => setPeriod('week')}>
    Week
  </button>
</div>

// DEPOIS (✅)
<div role="tablist" aria-label="Time period selector">
  <button
    role="tab"
    aria-selected={period === 'week'}
    onClick={() => setPeriod('week')}
  >
    Week
  </button>
</div>
```

---

## Troubleshooting

### Falso Positivo: "Button must have aria-label"

**Problema:** Botão tem texto mas script reclama.

**Solução:** Verifique se o texto está dentro de tags `<span>`, `<div>` ou outros elementos. O script procura por texto direto.

```tsx
// ❌ Pode gerar falso positivo
<button>
  <div>Click me</div>
</button>

// ✅ Melhor
<button>Click me</button>
```

### Ícones Decorativos

**Sempre** adicione `aria-hidden="true"` em ícones que são puramente decorativos:

```tsx
<AssetIcon name="arrow" aria-hidden="true" />
```

### Imagens de Background

Para imagens inseridas via CSS (`background-image`), não há verificação. Use `alt` apenas em tags `<img>`.

---

## Atualizações Futuras

Planejado para próximas versões:

1. ✨ Verificação de contraste de cores
2. ✨ Detecção de heading hierarchy (h1 → h2 → h3)
3. ✨ Validação de formulários completos
4. ✨ Checagem de live regions (`aria-live`)
5. ✨ Suporte para `prefers-reduced-motion`

---

**Última Atualização:** 14 de novembro de 2025  
**Autor:** Walky Admin Team  
**Versão:** 2.0 (Enhanced)
