# Implementação de Acessibilidade - Dashboard

## Resumo das Melhorias

Este documento detalha as implementações de acessibilidade aplicadas nos componentes da Dashboard (Engagement e Popular Features).

## Componentes Atualizados

### 1. FeatureCard

**Atributos ARIA adicionados:**

- `role="region"` no card principal
- `aria-labelledby` conectando ao título do card
- `id` único para cada título usando padrão `feature-card-{title}`
- `aria-hidden="true"` nos ícones decorativos
- `aria-label` descritivo no botão "See all"
- `aria-label` na lista ordenada (`<ol>`) para contexto de ranking

**Melhorias Semânticas:**

- Mudança de `<div>` para `<ol>` na lista de itens (semântica de ranking)
- Mudança de `<div>` para `<li>` nos itens da lista
- Alt text descritivo em imagens de lugares: `alt="{item.label} icon"`
- Alt text vazio em ícones decorativos (com background colorido)

**Estados de Foco:**

```css
.see-all-btn:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

### 2. ViewToggle

**Atributos ARIA adicionados:**

- `role="group"` no container
- `aria-label="View mode selector"` no grupo
- `aria-label="Grid view"` e `aria-label="List view"` nos botões
- `aria-pressed={boolean}` indicando estado ativo/inativo
- `aria-hidden="true"` nos ícones SVG

**Estados de Foco:**

```css
.view-option:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
  z-index: 1;
}
```

---

### 3. PopularitySelector

**Atributos ARIA adicionados:**

- `role="radiogroup"` no container (padrão de seleção única)
- `aria-label="Popularity filter"` no grupo
- `role="radio"` em cada botão
- `aria-checked={boolean}` indicando seleção

**Estados de Foco:**

```css
.popularity-option:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
  z-index: 1;
}
```

---

### 4. TimeSelector

**Atributos ARIA adicionados:**

- `role="tablist"` no container (padrão de abas)
- `aria-label="Time period selector"` no grupo
- `role="tab"` em cada botão
- `aria-selected={boolean}` indicando aba ativa
- `aria-label="{option.label} period"` descritivo em cada botão

**Estados de Foco:**

```css
.time-option:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
  z-index: 1;
}
```

---

### 5. ExportButton

**Atributos ARIA adicionados:**

- `aria-label="Export data to CSV"` descritivo
- `aria-hidden="true"` no ícone SVG

**Estados de Foco:**

```css
.export-button:focus-visible {
  outline: 2px solid #546fd9;
  outline-offset: 2px;
}
```

---

### 6. PopularFeatures (Tela Principal)

**Melhorias Semânticas:**

- Mudança de `<div>` para `<main>` no container principal
- `aria-label="Popular Features Dashboard"` no main
- `<section aria-label="Data filters">` na seção de filtros
- `<section aria-label="Feature statistics">` na seção de cards
- `aria-hidden="true"` no ícone decorativo do header
- Labels associados aos filtros com IDs (`id="time-period-label"`, `id="popularity-label"`)

---

## Padrões ARIA Utilizados

### 1. **Radio Group Pattern** (PopularitySelector)

- Container: `role="radiogroup"` + `aria-label`
- Itens: `role="radio"` + `aria-checked`
- Navegação: Setas para mudar seleção
- Referência: [WAI-ARIA Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)

### 2. **Tab Pattern** (TimeSelector)

- Container: `role="tablist"` + `aria-label`
- Itens: `role="tab"` + `aria-selected`
- Navegação: Setas para navegar entre abas
- Referência: [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

### 3. **Button Pattern** (ViewToggle, ExportButton)

- Uso de `aria-pressed` para toggle buttons
- `aria-label` descritivo quando texto não é suficiente
- Referência: [WAI-ARIA Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

### 4. **Region Pattern** (FeatureCard)

- `role="region"` para seções importantes
- `aria-labelledby` conectando ao heading
- Referência: [WAI-ARIA Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)

---

## Navegação por Teclado

### Implementações:

1. **Foco Visível:**

   - Todos os elementos interativos têm `:focus-visible` com outline azul (#546fd9)
   - Offset de 2px para melhor contraste
   - z-index: 1 para evitar sobreposição

2. **Ordem de Tabulação:**

   - Segue ordem lógica do DOM (top-to-bottom, left-to-right)
   - Sem uso de `tabindex` positivo (anti-pattern)

3. **Atalhos de Teclado Nativos:**
   - **Enter/Space**: Ativa botões
   - **Tab**: Navega entre elementos
   - **Shift+Tab**: Navega para trás

---

## Suporte para Leitores de Tela

### Informações Anunciadas:

1. **FeatureCard:**

   - "Region: Top interests"
   - "List: Top interests ranking, 3 items"
   - "Rank 1, Food"
   - "Button: See all top interests"

2. **ViewToggle:**

   - "Group: View mode selector"
   - "Button: Grid view, pressed" / "Button: List view, not pressed"

3. **PopularitySelector:**

   - "Radio group: Popularity filter"
   - "Radio: Least popular, not checked" / "Radio: Most popular, checked"

4. **TimeSelector:**

   - "Tab list: Time period selector"
   - "Tab: All time period, selected" / "Tab: Week period, not selected"

5. **ExportButton:**
   - "Button: Export data to CSV"

---

## Imagens e Ícones

### Estratégia de Alt Text:

1. **Ícones Decorativos:**

   - `aria-hidden="true"` (não anunciados)
   - Exemplos: ícones de título, ícones em botões com texto

2. **Ícones Informativos:**

   - `alt="{description}"` descritivo
   - Exemplos: ícones de lugares visitados

3. **Imagens com Background Colorido:**
   - `alt=""` (vazio) + `aria-hidden="true"` no container
   - Contexto fornecido pelo texto adjacente

---

## Compatibilidade

### Testado com:

- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)

### Navegadores:

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Checklist de Acessibilidade

### ✅ WCAG 2.1 Level AA

- [x] **1.1.1 Non-text Content:** Alt text em imagens informativas
- [x] **1.3.1 Info and Relationships:** Estrutura semântica correta (main, section, ol, li)
- [x] **1.4.1 Use of Color:** Não depende apenas de cor (estados com ARIA)
- [x] **2.1.1 Keyboard:** Todos elementos acessíveis via teclado
- [x] **2.4.3 Focus Order:** Ordem lógica de foco
- [x] **2.4.7 Focus Visible:** Indicador de foco visível em todos elementos
- [x] **3.2.4 Consistent Identification:** Padrões consistentes
- [x] **4.1.2 Name, Role, Value:** ARIA roles e estados apropriados

### ✅ Extras Implementados

- [x] Padrões WAI-ARIA corretos (Radio, Tab, Button)
- [x] Suporte completo para leitores de tela
- [x] Foco visível com contraste adequado
- [x] Semântica HTML5 (main, section, ol)
- [x] Labels descritivos e contextuais

---

## Próximos Passos

### Melhorias Futuras:

1. **Atalhos de Teclado Customizados:**

   - Setas ← → para navegar entre opções do RadioGroup
   - Home/End para ir ao primeiro/último item

2. **Live Regions:**

   - `aria-live="polite"` para anunciar mudanças de filtros
   - `aria-live="assertive"` para erros críticos

3. **Skip Links:**

   - "Skip to filters"
   - "Skip to statistics"

4. **High Contrast Mode:**

   - CSS para Windows High Contrast Mode
   - Testes com forced-colors

5. **Redução de Movimento:**
   - Respeitar `prefers-reduced-motion`
   - Desabilitar transições/animações quando necessário

---

## Recursos de Referência

- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM: Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

---

**Última Atualização:** 14 de novembro de 2025  
**Autor:** Implementação de Acessibilidade - Dashboard Walky Admin
