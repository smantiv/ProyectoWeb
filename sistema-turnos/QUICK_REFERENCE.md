# ⚡ Quick Reference: Vue → React

## 1. Estado

### Vue 3
```javascript
const count = ref(0)
count.value++
```

### React
```javascript
const [count, setCount] = useState(0)
setCount(count + 1)
```

---

## 2. Propiedades Computadas

### Vue 3
```javascript
const doubled = computed(() => count.value * 2)
```

### React
```javascript
const doubled = useMemo(() => count * 2, [count])
```

---

## 3. Ciclo de Vida

### Vue 3
```javascript
onMounted(() => {
  console.log('Mounted')
})
```

### React
```javascript
useEffect(() => {
  console.log('Mounted')
}, [])
```

---

## 4. Props

### Vue 3
```javascript
defineProps({ title: String })
```

### React
```javascript
function Component({ title }) { ... }
```

---

## 5. Eventos

### Vue 3
```vue
<button @click="handleClick">Click</button>
```

### React
```jsx
<button onClick={handleClick}>Click</button>
```

---

## 6. Renderizado Condicional

### Vue 3
```vue
<div v-if="show">Visible</div>
<div v-else>Hidden</div>
```

### React
```jsx
{show ? <div>Visible</div> : <div>Hidden</div>}
```

---

## 7. Listas

### Vue 3
```vue
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

### React
```jsx
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

---

## 8. Two-Way Binding

### Vue 3
```vue
<input v-model="message" />
```

### React
```jsx
<input value={message} onChange={(e) => setMessage(e.target.value)} />
```

---

## 9. Watchers

### Vue 3
```javascript
watch(count, (newVal) => {
  console.log(newVal)
})
```

### React
```javascript
useEffect(() => {
  console.log(count)
}, [count])
```

---

## 10. State Global

### Vue 3
```javascript
// Pinia
import { useStore } from '@/store'
const store = useStore()
```

### React
```javascript
// Context API
const { state } = useContext(MyContext)
```

---

## 11. API Calls

### Vue 3
```javascript
onMounted(async () => {
  const res = await fetch('/api/data')
  data.value = res.json()
})
```

### React
```javascript
useEffect(async () => {
  const res = await fetch('/api/data')
  setData(res.json())
}, [])
```

---

## 12. Routing

### Vue 3
```javascript
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/about')
```

### React
```javascript
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/about')
```

---

## 13. Emit Events

### Vue 3
```vue
<script setup>
defineEmits(['custom-event'])
</script>
<button @click="$emit('custom-event', data)">Emit</button>
```

### React
```jsx
function Component({ onCustomEvent }) {
  return <button onClick={() => onCustomEvent(data)}>Emit</button>
}
```

---

## 14. Slots

### Vue 3
```vue
<template>
  <div>
    <slot />
  </div>
</template>
```

### React
```jsx
function Component({ children }) {
  return <div>{children}</div>
}
```

---

## 15. Error Handling

### Vue 3
```vue
<script setup>
try {
  const res = await fetch('/api')
} catch (err) {
  error.value = err
}
</script>
```

### React
```jsx
useEffect(() => {
  fetch('/api')
    .catch(err => setError(err))
}, [])
```

---

## 📊 Tabla Comparativa Rápida

| Vue 3 | React | Uso |
|-------|-------|-----|
| `ref()` | `useState()` | Crear estado |
| `computed()` | `useMemo()` | Valores derivados |
| `onMounted()` | `useEffect()` | Ejecutar código |
| `watch()` | `useEffect()` | Reaccionar a cambios |
| `defineProps()` | parámetros | Pasar datos |
| `$emit()` | callbacks | Enviar eventos |
| `v-if` | `&&` / ternario | Condicionales |
| `v-for` | `.map()` | Iterar listas |
| `v-model` | `onChange` + state | Editar inputs |
| `<slot />` | `children` | Composición |
| `Pinia` | `Context API` | Estado global |
| `Vue Router` | `React Router` | Rutas |

---

## 🎯 Regla de Oro

### Vue: "Reactividad automática"
```javascript
const count = ref(0)
count.value++  // Automáticamente reactivo
```

### React: "Explícito y funcional"
```javascript
const [count, setCount] = useState(0)
setCount(count + 1)  // Debes decir que cambió
```

---

## 💡 Tips de Transición

1. **React requiere ser más explícito**
2. **useEffect reemplaza varios hooks de Vue**
3. **Props son parámetros, no propiedades**
4. **Children son React patterns, no slots**
5. **Context es más simple que Pinia**
6. **React Router vs Vue Router son similares**

---

**Imprime esta página o guárdala para referencia rápida** 📋
