# Finance Dashboard

A personal finance tracking dashboard built with React and Vite. This project demonstrates clean UI design, interactive data visualization, and role-based access control on the frontend.

## Features

**Dashboard Overview**
- Summary cards for Balance, Income, Expenses, and Savings Rate with animated number transitions
- Monthly Income vs Expenses area chart  
- Spending by category donut chart with emoji-labeled progress bars  
- Dynamic insights computed from the data (top spending category, savings %, month-over-month trend)
- Recent activity feed showing the last 5 transactions
- Time-aware greeting

**Transactions**
- Sortable, searchable, and filterable transaction table  
- Pagination (10 per page)  
- Category badges with color coding and emoji icons  
- Inline summary stat cards (total count, income, expenses for current filter)
- Add / Edit / Delete transactions (Admin only)
- CSV export

**Insights Page**
- Monthly Net Savings bar chart  
- Savings Rate gauge with target indicator  
- Spending by Day of Week chart  
- Category breakdown with animated progress bars  
- Notable records (largest transaction, total count)
- Stat cards for avg expense, month-over-month change, and longest no-spend streak

**RBAC Simulation**
- Toggle between Admin and Viewer from the header  
- Admin: full CRUD access on transactions  
- Viewer: read-only mode, action buttons are removed  

**Other**
- Dark / Light theme toggle with local storage persistence  
- All data persisted in local storage  
- Responsive layout with collapsible sidebar  
- Custom design system using CSS variables (no utility frameworks)

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Vanilla CSS (custom properties) |
| State | React Context + useReducer pattern |

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/
│   ├── dashboard/Overview.jsx    # Main dashboard with charts and cards
│   ├── insights/Insights.jsx     # Analytics and observations page
│   ├── layout/
│   │   ├── Header.jsx            # Top bar with role toggle, search, theme
│   │   └── Sidebar.jsx           # Navigation sidebar
│   └── transactions/
│       ├── Transactions.jsx      # Transaction management page
│       └── TransactionModal.jsx  # Add/edit modal form
├── context/FinanceContext.jsx    # Global state, mock data, derived insights
├── index.css                     # Design system and global styles
├── App.jsx                       # Root layout and routing
└── main.jsx                      # Entry point
```

## Design Decisions

- Chose **vanilla CSS** with custom properties to keep full control over the design and demonstrate that I can build a polished UI without relying on utility-first frameworks.
- Used **React Context** for state since the app is small enough that Redux or Zustand would be overkill. State is cleanly separated from UI components.
- Mock data spans 3 months with 30 transactions across 9 categories. This gives the charts and insights enough variety to show realistic patterns.
- The insights are all **dynamically computed** from the actual transaction data — not hardcoded — so they update when you add or delete records.
