# Reglas de Flujo de Trabajo y Gestión de Tareas (Workflow & Project Management)

Este documento establece las directivas obligatorias de gestión de tareas, control de versiones y seguimiento en GitHub para el proyecto **Crypto Multi-Tool**.

---

## 1. Principio Fundamental: Jerarquía Epic $\rightarrow$ Sub-Issue

Todo trabajo de desarrollo, documentación o refactorización debe estar estrictamente enmarcado dentro de una **Epic** del proyecto:

1. **Pertenencia a una Epic:**
   - Nunca trabajar en tareas aisladas sin un Epic padre en GitHub Projects ([Board #1](https://github.com/orgs/GlobalSolutionsUY/projects/1)).
   - Si no existe un Epic adecuado, se debe definir o coordinar con el operador.

2. **Creación de Sub-Issue para el Objetivo (Goal):**
   - Para cada objetivo específico o sesión de trabajo, se debe crear un Issue en el repositorio ([gs-crypto-multi-tool-01](https://github.com/GlobalSolutionsUY/gs-crypto-multi-tool-01)).
   - El Issue debe enlazarse inmediatamente como `sub-issue` de la Epic correspondiente vía GraphQL o CLI.

---

## 2. Ciclo de Vida y Estados del Issue

1. **Estado `In Progress` Inmediato:**
   - Tan pronto como se inicie la ejecución de la tarea, el estado del Issue debe actualizarse a **`In Progress`** en el tablero del proyecto.
   - No mantener tareas en `Todo` si ya se está analizando, codificando o documentando.

2. **Cierre y Transición:**
   - Una vez finalizada la tarea y verificado el código/documentación, el sub-issue y/o Pull Request transiciona a revisión o estado `Done`.

---

## 3. Vinculación Obligatoria de Ramas (Branch Association)

1. **Rama Dedicada por Issue:**
   - Todo Issue debe tener asociada una rama Git específica con nomenclatura descriptiva:
     - `feat/<nombre-tarea>`
     - `docs/<nombre-tarea>`
     - `fix/<nombre-tarea>`
     - `refactor/<nombre-tarea>`

2. **Enlace Formal en GitHub:**
   - La rama debe vincularse al Issue mediante:
     - Apertura de un Pull Request descriptivo (`Closes #<id>` o `Refs #<id>`).
     - Referencias en los mensajes de commit (`refs #<id>`).
     - Visualización confirmada en el panel *Development* del Issue en GitHub.

3. **Push Continuo:**
   - Los commits deben subirse a la rama remota (`origin/<branch>`) para mantener trazabilidad y respaldar el progreso en cada hito relevante.
