# Dhaka Tesla Pool (ঢাকা টেসলা পুল) — Client Web App

> **Next.js 16 (Turbopack) Web Application for Electric Autonomous Corridor Ridesharing in Dhaka City**  
> *Developed for RobanDevs Engineering Internship Evaluation · P0 Submission*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel&logoColor=white)](https://dhaka-tesla-pool-client.vercel.app)

---

## 🌐 Live Deployment & Demo Links

- **🚀 Live Frontend Web App (Vercel):** [https://dhaka-tesla-pool-client.vercel.app](https://dhaka-tesla-pool-client.vercel.app)
- **📹 6-Minute Demonstration Video:**  
  > 🎥 **[Watch 6-Minute Project Walkthrough Video](https://drive.google.com/file/d/1ZXjkyd79Nad3e8RiXJkZr1K2dZENKWdG/view?usp=sharing)**  
  > *Demonstrates passenger booking, live corridor quoting, captain dispatch console, manual ride acceptance, and poysha wallet deduction.*

---

## 📸 System Showcase & Visuals

### 1. Home & Corridor Overview
Interactive corridor map, origin/destination selector, and instant role switcher between Passenger and Captain.

![Home Page](assets/home-page.png)

---

### 2. Live Ride Booking & TeslaPay Wallet
Corridor ride booking with real-time pricing quote, 25% pooled discount, seat capacity selector, payment method toggle (TeslaPay vs Cash), and instant top-up.

![Book Ride](assets/book-ride.png)

---

### 3. Completed Trips, Audit Logs & Receipts
Historical ride archive showing completed trips, designated captain details, Poysha-accurate receipts, and immutable FSM audit status logs.

![Ride History](assets/ride-history.png)

---

## 📌 Executive Summary & Problem Statement

Dhaka faces acute urban transit congestion. Traffic bottlenecks along key business corridors—such as **Banani, Gulshan, Mohakhali, Farmgate, and Uttara**—waste millions of commuter hours daily in single-occupant combustion vehicles.

**Dhaka Tesla Pool** is a modern electric ride-pooling platform designed specifically for Dhaka's transit corridors:
1. **Dynamic Corridor Pooling:** Commuters sharing identical origin-destination corridors pool into electric Tesla Model Y vehicles ("Bullet").
2. **Strict Physical Capacity (Max 3 Seats):** Bullet accommodates at most 3 passengers per trip.
3. **Pessimistic Concurrency Row-Locking:** Eliminates race conditions so overbooking is physically impossible at the database level.
4. **Poysha-Accurate FinTech Billing:** Currency math is computed in integer Poysha (1 BDT = 100 Poysha), preventing floating-point drift and supporting exact micro-discounts.
5. **Captain Manual Acceptance Workflow:** Drivers explicitly accept or decline incoming corridor ride requests before dispatch.

---

## ⚙️ Environment Variables & Project Setup

### Client `.env.local` Configuration
Create a `.env.local` file in the `client` root directory (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Configure the following environment variable:

| Variable | Description | Value / Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base API URL pointing to the NestJS backend | `http://localhost:4000/api/v1` (for local development) |

---

## 👥 Pre-Seeded Demo Credentials (PRD Section 4)

All accounts are pre-seeded in the database with password: `Tesla2026!`

| Role | Name | Email | Password | Initial State / Preloaded Balance |
|---|---|---|---|---|
| **Driver Captain** | Jashim Uddin | `jashim@tesla.dhaka` | `Tesla2026!` | Vehicle: Bullet (Tesla Model Y) · Banani Zone · Online |
| **Passenger 1** | Nusrat Jahan | `nusrat@tesla.dhaka` | `Tesla2026!` | ৳500.00 (`50,000` Poysha) |
| **Passenger 2** | Rafiqul Islam | `rafiq@tesla.dhaka` | `Tesla2026!` | ৳350.00 (`35,000` Poysha) |
| **Passenger 3** | Shirin Akter | `shirin@tesla.dhaka` | `Tesla2026!` | ৳500.00 (`50,000` Poysha) |

---

## 📱 Frontend Features & User Experience

### 1. Passenger Dashboard (`/passenger`)
- **Interactive Corridor Booking:** Select pickup and destination zones across Dhaka's predefined corridors (e.g. Banani ➔ Mohakhali).
- **Seat Selector:** Choose 1, 2, or 3 seats with dynamic capacity awareness.
- **Poysha-Accurate Fare Engine:** Real-time fare estimate card showing base fare, distance charge, and **25% pooling discount** in BDT (`৳58.12`).
- **Simulated TeslaPay Wallet:** Live balance badge pill in the navigation bar (`⚡ ৳500.00`), toggle between **TeslaPay Wallet** and **Cash to Captain**, low-balance alerts, and instant `+ Top Up ৳500` action.
- **Live Ride Status Tracker:** Finite State Machine progression (`REQUESTED` ➔ `MATCHED` ➔ `DRIVER_ARRIVED` ➔ `STARTED` ➔ `COMPLETED`).
- **Past Trips History Modal:** Audit logs of past completed and cancelled trips with exact timestamps and driver details.

### 2. Driver Captain Console (`/driver`)
- **Status Toggle:** One-click toggle between `ONLINE & ACCEPTING` and `OFFLINE`.
- **Bullet Capacity Visualizer:** Real-time seat occupancy badge (`0/3`, `1/3`, `2/3`, `3/3 Occupied`).
- **Incoming Ride Requests Card:** Pulsing alert banner for incoming bookings with pickup, destination, passenger name, seats requested, fare quote, and instant `[✓ Accept Ride]` / `[✕ Decline]` actions.
- **Passenger Manifest Table:** Real-time list of confirmed passengers in the vehicle with fare collected.
- **Trip Progression Action Buttons:** Strict forward-only state progression (`Arrived at Pickup` ➔ `Start Trip` ➔ `Complete Trip`).
- **Trip Archive Modal:** Historical log of all completed pools and total earnings collected.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["1. Frontend Client Layer (Next.js 16 + Turbopack)"]
        PassengerView["Passenger Booking & Live Tracker"]
        DriverConsole["Driver Captain Console & Alert Modal"]
    end

    subgraph Backend ["2. NestJS API Controllers & Routing Layer"]
        RidesCtrl["Rides Controller (POST /rides/request)"]
        DriverCtrl["Driver Controller (POST /driver/rides/:id/accept)"]
    end

    subgraph CoreServices ["3. Business Logic & Concurrency Engine"]
        PricingSvc["Pricing Module (Dhaka Corridors & Poysha Fare Engine)"]
        RidesSvc["Rides Service (FSM Lifecycle & Audit Logs)"]
        PoolsSvc["Pools Service (Pessimistic Row Locking 'SELECT FOR UPDATE')"]
    end

    subgraph Database ["4. Persistence Layer (Neon Cloud PostgreSQL)"]
        PoolTable[("pools Table (occupied_seats, vehicle capacity: 3)")]
        UserTable[("users Table (wallet_balance_poysha)")]
        RideTable[("ride_requests Table (status, passenger_id, poysha)")]
        AuditTable[("ride_status_logs Table (immutable audit trail)")]
    end

    %% Vertical Cross-Layer Data Flow
    PassengerView -->|"1. Submit Booking Request"| RidesCtrl
    DriverConsole -->|"1. Accept / Advance Trip"| DriverCtrl

    RidesCtrl -->|"2. Compute Fare & Validate"| PricingSvc
    PricingSvc -->|"3. Forward Booking Payload"| RidesSvc
    DriverCtrl -->|"2. Advance FSM State"| RidesSvc

    RidesSvc -->|"4. Atomic Lock & Seat Allocation"| PoolsSvc

    PoolsSvc -->|"5. SELECT FOR UPDATE Row Lock"| PoolTable
    PoolsSvc -->|"6. Atomic Wallet Deduction"| UserTable
    RidesSvc -->|"7. Persist Ride Record"| RideTable
    RidesSvc -->|"8. Append State Transition Log"| AuditTable
```

---

## 🔒 The Concurrency Problem & Pessimistic Row-Level Locking

### The Race Condition Scenario
In high-demand Dhaka corridors, two passengers (e.g. Nusrat and Rafiq) may click **"Request Bullet"** at the exact same millisecond when only **1 seat** remains in the vehicle.

In standard ORM queries:
1. Thread A reads: `occupiedSeats = 2` (Capacity is 3 ➔ OK to book).
2. Thread B reads: `occupiedSeats = 2` (Capacity is 3 ➔ OK to book).
3. Thread A saves: `occupiedSeats = 3`.
4. Thread B saves: `occupiedSeats = 4` 💥 **OVERBOOKING DISASTER (Illegal physical state in a 3-seat car).**

### How We Solved It: PostgreSQL Pessimistic Row Lock (`SELECT FOR UPDATE`)
We bypassed standard non-blocking ORM reads by executing an atomic pessimistic row lock inside a Prisma `$transaction`:

```typescript
// server/src/modules/pools/pools.service.ts
const pools = await tx.$queryRaw<Array<{ id: string; occupied_seats: number }>>`
  SELECT id, vehicle_id, status, occupied_seats, pickup_zone, corridor
  FROM "pools"
  WHERE id = ${poolId}
  FOR UPDATE
`;

if (pools[0].occupied_seats + seatsRequested > 3) {
  throw new ConflictException("Pool capacity exceeded. Only available seats can be booked.");
}
```
- The first transaction obtains an exclusive row lock at the PostgreSQL kernel level.
- The second transaction waits until the first commits, then immediately reads `occupiedSeats = 3` and is cleanly rejected with HTTP 409 Conflict.

---

## 💰 Poysha-Accurate Integer Pricing Engine & FinTech Architecture

### Why IEEE 754 Floating-Point Math Fails
In JavaScript, floating-point arithmetic introduces precision drift:
```javascript
0.1 + 0.2 === 0.30000000000000004 // True!
```
Over thousands of micro-transactions, floating-point rounding causes ledger imbalances and fractional Taka loss.

### Architectural Decision: AI Recommendation vs. Developer Refinement
- **AI's Initial Suggestion:** The AI assistant suggested using integer math for monetary values to eliminate float drift.
- **My Engineering Decision:** While AI recommended basic integer calculations (often rounding directly to whole Taka), I rejected rounding to whole Taka because ride fares have fractional rates and percentage discounts. Instead, **I engineered the entire database and math engine in sub-unit integer Poysha (1 BDT = 100 Poysha)**:
  - **Base Fare:** ৳25.00 ➔ `2500` Poysha
  - **Rate per km:** ৳15.00/km ➔ `1500` Poysha
  - **Pooling Discount:** 25% ➔ `poolDiscountPoysha = Math.round(subtotal * 0.25)`
  - **Formula:**  
    $$\text{Total Poysha} = \text{Base} + (\text{DistanceKm} \times 1500) - \text{Discount}$$
  - **Example (Banani ➔ Mohakhali, 3.5 km):**  
    `2500 + 5250 = 7750` Poysha. Discount (25%) = `1938` Poysha.  
    Total = `5812` Poysha = **৳58.12**.

### Atomic Balance Deduction on Trip Completion
When Captain Jashim marks the trip `COMPLETED`, if the passenger selected `TESLAPAY`, their wallet balance is atomically decremented:
```typescript
// server/src/modules/driver/driver.service.ts
if (targetStatus === RideStatus.COMPLETED) {
  for (const ride of activeRides) {
    if (ride.paymentMethod === PaymentMethod.TESLAPAY) {
      await tx.user.update({
        where: { id: ride.passengerId },
        data: {
          walletBalancePoysha: {
            decrement: ride.totalFarePoysha,
          },
        },
      });
    }
  }
}
```

---

## 🤖 AI Usage & Engineering Methodology (PRD Section 10)

In compliance with Section 10 of the PRD, this project transparently details all AI assistance and engineering workflows:

1. **Pre-Project Professional Dev Docs:**
   - Before writing any code, I created a comprehensive, professional **Dev Docs** suite (Epics, Stories, Architectural Decision Records, and PRD breakdown).
   - This dev documentation guided the entire project lifecycle, established clear acceptance criteria, and organized the sequential development of both backend and frontend.

2. **AI Tool Used:**
   - **Free Gemini / Antigravity CLI:** Used as the sole AI pair programming engine for proper AI-assisted development, architectural refinement, and automated test harness verification. No external third-party tools like Claude or Copilot were used.

3. **Where AI Helped:**
   - **Architecture & System Refinement:** Gemini assisted in designing the decoupled modular architecture, corridor state transitions, and concurrency protection models.
   - **UI & Frontend Layout:** Assisted in structuring the responsive Next.js 16 App Router interface and Tailwind CSS layouts with dark-mode support.
   - **Backend Vitest Unit Testing:** Gemini helped generate test fixtures, mock factories, and boundary edge cases, enabling a 100% test pass rate across all 65 Vitest unit tests.

4. **Accepted AI Suggestion:**
   - AI suggested moving away from JavaScript `Number` floats to integer storage to avoid floating-point drift in account balances.

5. **Rejected / Refined AI Suggestion:**
   - **Rejection of Whole Taka Rounding ➔ Moved to Poysha:** AI originally suggested keeping integer balances as rounded whole Taka (BDT). I rejected this because ride-hailing pricing requires fractional precision (e.g. ৳58.12) to handle 25% corridor pooling discounts without rounding distortion. Instead, **I engineered the system in sub-unit Integer Poysha (1 BDT = 100 Poysha)** across the database schema, pricing calculations, and wallet deductions for true FinTech accuracy.
   - **Rejection of WebSockets for MVP:** AI suggested using Socket.io for driver-passenger communication. I intentionally deferred WebSockets in favor of **stateless REST polling (2s-3s polling)**, ensuring zero connection dropping on serverless/free-tier edge architectures while keeping the system simple and highly reliable.

---

## 🚀 Bonus Section: "If Oi Tesla Goes Viral" (Scaling to 1M Passengers & 100k Drivers)

If Dhaka Tesla Pool explodes in popularity across Dhaka, the single-instance monolithic architecture will evolve into a distributed system:

1. **Spatial Hexagonal Indexing (Uber H3 & PostGIS):**
   - Replace static zone lookup with Uber H3 hexagonal spatial grids (Resolution 8/9).
   - Match passengers and drivers within adjacent H3 cells in $<10\text{ms}$ using spatial indexing.
2. **Distributed Locking (Redis Redlock):**
   - Replace single-database `SELECT FOR UPDATE` locks with distributed Redis locks across microservices.
3. **Event-Driven Dispatch via Apache Kafka / RabbitMQ:**
   - Queue incoming ride requests into corridor-partitioned Kafka topics (`rides.requests.southeast`).
   - Match vehicles asynchronously with event streams, buffering peak rush-hour traffic surges.
4. **Database Read Replicas & Connection Pooling:**
   - Deploy Neon/Aurora PostgreSQL read replicas for read-heavy operations (quotes, manifests, history).
   - Utilize PgBouncer connection pooling to handle 50,000+ concurrent database connections.
5. **Edge Caching for Static Route Topologies:**
   - Cache corridor distance matrices and fare rules on Cloudflare / Vercel Edge CDN nodes with sub-millisecond response times.

---

## 🛠️ Local Development & Setup Guide

### Prerequisites
- Node.js 20+
- npm

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/ranak8811/Dhaka-Tesla-Pool-Client.git
cd Dhaka-Tesla-Pool-Client

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1" for local backend

# 4. Start Next.js development server
npm run dev
# App will be active at http://localhost:3000
```

### Production Build Verification
```bash
npm run build
```
Builds with Turbopack in $<1.5\text{s}$ with 0 errors across all routes.
