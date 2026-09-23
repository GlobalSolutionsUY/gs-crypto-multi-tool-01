# Customizaciones del Proyecto: Crypto Multi-Tool

Este repositorio tiene configurados los kits de skills y reglas de **Ponytail** y **Anti-Slop** en el directorio `.agents/`.

---

<!-- ponytail:start -->
## Ponytail
Para cualquier tarea de diseño de código, refactorización, elección de dependencias o implementación:
- **Skill principal**: `.agents/skills/ponytail/SKILL.md`
- **Regla activa**: `.agents/rules/ponytail.md`
- Aplica el principio YAGNI (The Ladder): solución más simple y directa primero, stdlib antes de dependencias innecesarias, código conciso y sin over-engineering.
<!-- ponytail:end -->

---

<!-- antislop:start -->
## Anti-Slop
Para trabajo de UI, copywriting, maquetación o comentarios de código:
- **Core / Filtro**: `.agents/rules/antislop.md` y `.agents/skills/antislop/SKILL.md`
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & texto: `.agents/skills/antislop-copywriting/SKILL.md`
- Accesibilidad: `.agents/skills/antislop-human/SKILL.md`
- Responsive / Mobile: `.agents/skills/antislop-layoutmobile/SKILL.md`
<!-- antislop:end -->

---

<!-- workflow:start -->
## Flujo de Trabajo y Gestión de Tareas (GitHub Workflow)
Para cualquier tarea, desarrollo, refactorización o documentación:
- **Regla activa**: `.agents/rules/workflow.md`
- **Jerarquía obligatoria**: Todo trabajo debe pertenecer a una **Epic** existente en el proyecto de GitHub.
- **Creación de Issue / Sub-issue**: Crear un sub-issue específico para el goal/tarea dentro de la Epic.
- **Estado In-Progress**: Pasar el issue inmediatamente a estado `In Progress` en el tablero del proyecto al comenzar.
- **Branch Asociada**: Todo issue debe tener una rama Git dedicada vinculada (`feat/...`, `docs/...`, `fix/...`) y enlazada en GitHub.
<!-- workflow:end -->
