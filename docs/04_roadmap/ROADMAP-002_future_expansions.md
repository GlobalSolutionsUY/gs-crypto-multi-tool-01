# ROADMAP-002: Expansiones Futuras y Módulos Avanzados (Post-MVP)

**Documento:** Plan de Expansión del Ecosistema  
**Código:** ROADMAP-002  
**Versión:** 1.0.0  
**Estado:** Planificado  
**Última Actualización:** 2026-09-23  

---

## 1. Visión Evolutiva del Sistema

Una vez validada la Fase 1 (Spot Opportunity Radar) y establecida la tubería desacoplada, el sistema incorporará de manera incremental radares especializados, conectores multi-exchange y el módulo de ejecución asistida.

```text
FASE 1 (Actual)         FASE 2                   FASE 3                   FASE 4
[ Spot Opportunity ] ──► [ Liquidity & Futures ] ──► [ Listings & Tokens ] ──► [ Execution Engine ]
[ Binance Read-Only]     [ Meme Early Mover    ]     [ On-Chain Whales   ]     [ Operación Asistida]
                         [ Bitunix / Bitget    ]     [ Eventos / DEX     ]     [ Autorización Manual]
```

---

## 2. Fase 2: Derivados, Memecoins y Multi-Exchange

### 2.1 Módulo RF-02: Liquidity & Futures Radar
- **Propósito:** Detectar zonas de acumulación de órdenes de stop y estimar barridas en contratos perpetuos.
- **Integraciones:** Conexión con datos de liquidaciones (ej. Trading Different / API de Open Interest y Funding Rates).
- **Lógica:** Detección de *sweep & reclaim* en extremos de rangos intradía con confirmación de delta de volumen.

### 2.2 Módulo RF-03: Meme Radar (Early Mover Filter)
- **Propósito:** Escanear tokens emergentes en Solana y EVM vía DEXScreener / GeckoTerminal.
- **Filtros Mandatorios:**
  - Descarte inmediato de contratos no verificados o con funciones de modificación de impuestos (*honeypot*).
  - Verificación de liquidez bloqueada (LP burn / lock).
  - Concentración de billeteras primarias $< 25\%$.

### 2.3 Adaptadores Multi-Exchange
- Implementación de adaptadores para **Bitunix** y **Bitget** implementando la interfaz [`ExchangeAdapter`](file:///E:/projects/gsolut/mvp-crypto-multi-tool/docs/02_architecture/SAD-001_system_architecture.md), permitiendo comparar discrepancias de precio o spreads entre plataformas.

---

## 3. Fase 3: Eventos, Listings y Telemetría On-Chain

### 3.1 Módulo RF-04: New Listings & Catalizadores
- Monitoreo automático de canales oficiales de anuncios (Binance New Listings, Launchpool, Upbit, Bithumb).
- Motor de scoring de tokenomics: cronograma de desbloqueos (*cliff & vesting*), dilución FDV vs Market Cap y tracción social inicial.
- Regla de oro: **Prohibición de compra ciega al segundo 0 del listing**.

### 3.2 Módulo RF-05: On-Chain & Whale Telemetry
- Telemetría de flujos netos hacia y desde exchanges centralizados (CEX Net Inflow / Outflow).
- Alertas de acumulación en billeteras de grandes tenedores (*whales*) como factor de confluencia positivo en la matriz de riesgo.

---

## 4. Fase 4: Execution Engine Desacoplado (Opt-in)

Implementación de un microservicio completamente aislado para operadores que deseen ejecutar las alertas con un solo clic:

```text
[Alerta en Telegram con Botón "Aprobar Orden"]
                    │
                    ▼
[Operador Presiona "Aprobar" + Token OTP / Firma]
                    │
                    ▼
[Execution Engine (Contenedor Aislado con API Keys)]
                    │
                    ▼
[Envío de Orden Limit / Stop-Market al Exchange]
```

- **Requisitos de Seguridad:**
  - Almacenamiento de secretos en vault cifrado.
  - Firma obligatoria de dos factores o confirmación criptográfica del operador.
  - Límites estrictos de tamaño máximo por orden (*max allocation per trade*).
