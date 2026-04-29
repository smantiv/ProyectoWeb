# 📚 Guía de Referencia: Vue 3 vs React 18

Esta guía te ayudará a entender los cambios al migrar de Vue 3 a React 18.

## 1. Estructura Básica de Componentes

### Vue 3 (.vue)
```vue
<template>
  <div class="page">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('Hello Vue')
const message = ref('Welcome')

const handleClick = () => {
  message.value = 'Button clicked!'
}
</script>

<style scoped>
.page {
  padding: 20px;
}
</style>
```

### React (.jsx)
```jsx
import { useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('Welcome')
  const title = 'Hello React'

  const handleClick = () => {
    setMessage('Button clicked!')
  }

  return (
    <div className="page">
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

## 2. Data Binding

### Vue 3
```vue
<template>
  <!-- Interpolación -->
  <p>{{ user.name }}</p>
  
  <!-- v-model para inputs -->
  <input v-model="inputValue" />
  
  <!-- Propiedades computadas -->
  <p>{{ computedValue }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref('')
const user = ref({ name: 'Juan' })
const computedValue = computed(() => inputValue.value.toUpperCase())
</script>
```

### React
```jsx
import { useState, useMemo } from 'react'

export default function Component() {
  const [inputValue, setInputValue] = useState('')
  const [user] = useState({ name: 'Juan' })
  
  // Computed value con useMemo
  const computedValue = useMemo(
    () => inputValue.toUpperCase(),
    [inputValue]
  )

  return (
    <>
      <p>{user.name}</p>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <p>{computedValue}</p>
    </>
  )
}
```

## 3. Ciclo de Vida

### Vue 3
```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Componente montado')
})

onUnmounted(() => {
  console.log('Componente desmontado')
})
</script>
```

### React
```jsx
import { useEffect } from 'react'

export default function Component() {
  useEffect(() => {
    console.log('Componente montado')
    
    return () => {
      console.log('Componente desmontado')
    }
  }, [])
}
```

## 4. Renderizado Condicional

### Vue 3
```vue
<template>
  <!-- v-if / v-else -->
  <div v-if="isLoggedIn">
    <p>Bienvenido {{ user.name }}</p>
  </div>
  <div v-else>
    <p>Por favor inicia sesión</p>
  </div>

  <!-- v-show (mantiene en DOM pero oculto) -->
  <div v-show="isVisible">Contenido visible</div>
</template>

<script setup>
const isLoggedIn = ref(true)
const isVisible = ref(false)
</script>
```

### React
```jsx
export default function Component() {
  const isLoggedIn = true
  const isVisible = false

  return (
    <>
      {/* Operador ternario */}
      {isLoggedIn ? (
        <div>
          <p>Bienvenido {user.name}</p>
        </div>
      ) : (
        <div>
          <p>Por favor inicia sesión</p>
        </div>
      )}

      {/* Display none con CSS */}
      <div style={{ display: isVisible ? 'block' : 'none' }}>
        Contenido visible
      </div>
    </>
  )
}
```

## 5. Listas (v-for vs .map())

### Vue 3
```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }}: {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
])
</script>
```

### React
```jsx
export default function Component() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]

  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id}>
          {index}: {item.name}
        </li>
      ))}
    </ul>
  )
}
```

## 6. Props

### Vue 3
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: {
    type: String,
    default: 'Default message',
  },
})
</script>

<!-- Uso -->
<MyComponent title="Hello" message="World" />
```

### React
```jsx
export default function Component({ title, message = 'Default message' }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}

// Uso
<Component title="Hello" message="World" />
```

## 7. Emitir Eventos

### Vue 3
```vue
<template>
  <button @click="$emit('custom-event', data)">
    Emitir evento
  </button>
</template>

<script setup>
defineProps(['data'])
defineEmits(['custom-event'])

<!-- Uso del padre -->
<Child 
  :data="myData"
  @custom-event="handleEvent"
/>
</script>
```

### React
```jsx
export default function Child({ data, onCustomEvent }) {
  return (
    <button onClick={() => onCustomEvent(data)}>
      Emitir evento
    </button>
  )
}

// Uso del padre
<Child 
  data={myData}
  onCustomEvent={handleEvent}
/>
```

## 8. Gestión de Estado Global

### Vue 3 (Pinia)
```javascript
// store/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

// Usar en componente
import { useCounterStore } from '@/store/counter'

export default {
  setup() {
    const store = useCounterStore()
    return { store }
  },
}
```

### React (Context + Hooks)
```javascript
// context/CounterContext.jsx
import { createContext, useState } from 'react'

export const CounterContext = createContext()

export const CounterProvider = ({ children }) => {
  const [count, setCount] = useState(0)

  const increment = () => setCount(count + 1)
  const doubleCount = count * 2

  return (
    <CounterContext.Provider value={{ count, doubleCount, increment }}>
      {children}
    </CounterContext.Provider>
  )
}

// Usar en componente
import { useContext } from 'react'
import { CounterContext } from './context/CounterContext'

export default function Component() {
  const { count, doubleCount, increment } = useContext(CounterContext)

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubleCount}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## 9. Llamadas API con useEffect

### Vue 3
```vue
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const data = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get('/api/data')
    data.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading">Cargando...</div>
  <div v-else>{{ data }}</div>
</template>
```

### React
```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Component() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data')
        setData(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      {loading ? <div>Cargando...</div> : <div>{data}</div>}
    </div>
  )
}
```

## 10. Enrutamiento

### Vue Router 4
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// En componente
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const goHome = () => router.push('/')
  },
}
```

### React Router 6
```jsx
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

// En componente
export default function Component() {
  const navigate = useNavigate()
  const goHome = () => navigate('/')
}
```

## 11. Estilos

### Vue 3 (Scoped)
```vue
<template>
  <div class="container">
    <h1>Título</h1>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  background: blue;
}

h1 {
  color: white;
}
</style>
```

### React
```jsx
export default function Component() {
  const styles = {
    container: {
      padding: '20px',
      background: 'blue',
    },
    h1: {
      color: 'white',
    },
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Título</h1>
    </div>
  )
}

// O usar clases CSS
export default function Component() {
  return (
    <div className="container">
      <h1>Título</h1>
    </div>
  )
}

/* En archivo CSS */
.container {
  padding: 20px;
  background: blue;
}

.container h1 {
  color: white;
}
```

## 12. Watchers vs useEffect

### Vue 3
```vue
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const message = ref('')

// Watch simple
watch(count, (newVal, oldVal) => {
  console.log(`Count cambió de ${oldVal} a ${newVal}`)
})

// Watch con opciones
watch(
  count,
  (newVal) => {
    message.value = `Nuevo valor: ${newVal}`
  },
  { deep: true }
)
</script>
```

### React
```jsx
import { useState, useEffect } from 'react'

export default function Component() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  // useEffect similar a watch
  useEffect(() => {
    console.log(`Count cambió a ${count}`)
    setMessage(`Nuevo valor: ${count}`)
  }, [count])
}
```

## 13. Formularios

### Vue 3
```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" />
    <input v-model="form.email" type="email" />
    <button type="submit">Enviar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
})

const handleSubmit = () => {
  console.log(form.value)
}
</script>
```

### React
```jsx
import { useState } from 'react'

export default function Form() {
  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <button type="submit">Enviar</button>
    </form>
  )
}
```

---

## Resumen de Cambios Principales

| Concepto | Vue 3 | React |
|----------|-------|-------|
| **Sintaxis** | SFC (.vue) | JSX (.jsx) |
| **Estado** | ref / reactive | useState |
| **Efectos** | onMounted / watch | useEffect |
| **Props** | defineProps | Function parameters |
| **Eventos** | @click / $emit | onClick / callbacks |
| **Condicionales** | v-if / v-show | && / ternary |
| **Listas** | v-for | .map() |
| **Estado global** | Pinia | Context API |
| **Routing** | Vue Router | React Router |
| **Estilos** | style scoped | CSS / inline styles |

**¡Bienvenido a React! 🎉**
