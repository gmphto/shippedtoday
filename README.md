# ShippedToday - MVP

A community platform to discover and share daily product launches.

## 🚀 Features

### MVP v0.1
- **Launch Feed**: Browse recent launches with title, link, description, and time ago
- **Submit Form**: Share your launch with the community
- **Stack Tags**: Optional technology tags for launches
- **Responsive Design**: Modern UI built with Tailwind CSS

### Upcoming v0.2
- **Daily Email**: Automated daily digest of launches

## 🏗️ Architecture

The project follows a domain-driven architecture with lens-based component organization:

```
app/
├── launches/                    # Domain
│   ├── types.ts                # Zod schemas and types
│   ├── api/                    # Data access layer
│   └── components/             # UI components
│       ├── feed/               # Feed lens
│       │   ├── Feed.tsx
│       │   ├── hooks/
│       │   └── components/
│       └── submit/             # Submit lens
│           ├── Submit.tsx
│           ├── hooks/
│           └── components/
```

### Key Principles
- **Zod-first**: All data types derived from Zod schemas
- **Pure functions**: Data transformations are pure and typed
- **Lens isolation**: No cross-lens imports in components
- **Component composition**: Large components split into smaller, focused pieces

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript + Zod
- **Data**: Flat JSON file (`/public/launches.json`)
- **Deployment**: Vercel-ready

## 🚦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Data Model

```typescript
type Launch = {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  submittedAt: string // ISO date
}
```

## 🎯 Usage

### Viewing Launches
- Visit the homepage to see all launches
- Launches are sorted by newest first
- Click titles to visit the actual product

### Submitting a Launch
- Navigate to `/submit`
- Fill in the required fields (title, URL, description)
- Optionally add technology stack tags
- Submit to add to the feed

## 🔧 Development

### Project Structure
- `app/launches/` - Main domain logic
- `app/launches/types.ts` - All Zod schemas
- `app/launches/api/` - Data access functions
- `app/launches/components/` - UI components organized by lens

### Adding Features
1. Update schemas in `types.ts`
2. Add pure functions in `api/`
3. Create focused components following lens naming
4. Use custom hooks for state management

## 📦 Deployment

The project is configured for Vercel deployment:

```bash
npm run build
```

Deploy to Vercel by connecting your Git repository.

## 🛣️ Roadmap

- [ ] v0.2: Daily email digest
- [ ] Backend API integration
- [ ] User authentication
- [ ] Launch voting system
- [ ] Search and filtering
- [ ] RSS feed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the architectural conventions
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a starting point for your own community platform! 