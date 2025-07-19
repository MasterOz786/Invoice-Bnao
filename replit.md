# Invoice Generator Application

## Overview

This is a full-stack invoice generator application built with React, Express, and TypeScript. The application allows users to create, customize, and preview professional invoices with multiple templates, currency support, and real-time preview functionality. Currently operating in preview mode with database integration planned for future releases.

## User Preferences

Preferred communication style: Simple, everyday language.
Authentication removed: Operating in preview mode without user authentication or session management.
Save functionality: Disabled until database integration is implemented.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: REST API with JSON responses
- **Validation**: Zod schemas shared between frontend and backend

### Development Setup
- **Monorepo Structure**: Client and server code in same repository
- **Shared Types**: Common schemas and types in `/shared` directory
- **Hot Reloading**: Vite HMR for frontend, tsx for backend development

## Key Components

### Database Schema (PostgreSQL)
- **companies**: Store company information (name, address, contact details, logo)
- **clients**: Store client/customer information
- **invoices**: Main invoice data (number, dates, currency, totals, status, template)
- **line_items**: Individual invoice line items (description, quantity, rate, amount)

### Invoice Templates
- **Minimalist**: Clean, simple design with monospace font
- **Gradient**: Modern design with blue-to-purple gradient header
- **Grid**: Structured layout with grid-based information display
- **Classic**: Traditional serif font with formal business styling
- **Freelance**: Creative template with green color scheme

### Currency System
- Multi-currency support with real-time conversion rates
- Supported currencies: USD, EUR, GBP, CAD, AUD, JPY
- Currency API integration for live exchange rates

### Storage System
- **Interface-based Design**: IStorage interface for data operations
- **In-Memory Implementation**: MemStorage class for preview/demo mode
- **Database Implementation**: PostgreSQL integration via Drizzle ORM planned for future release
- **Current State**: Save functionality disabled, operating as preview/demo application

## Data Flow

### Invoice Creation Flow
1. User fills out invoice form (company, client, line items)
2. Frontend validates data using shared Zod schemas
3. Real-time preview updates as user types
4. Data sent to backend API for persistence
5. Backend validates and stores in PostgreSQL database

### Template Rendering
1. User selects template from gallery
2. Invoice data combined with template component
3. Real-time preview rendered in browser
4. PDF generation available via browser print functionality

### Currency Conversion
1. Fetch exchange rates from currency API endpoint
2. Convert amounts based on selected currency
3. Display formatted currency values using Intl.NumberFormat

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack React Query for API state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with class-variance-authority

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for request/response validation
- **Database Connection**: Neon Database serverless driver
- **Session Management**: connect-pg-simple for PostgreSQL sessions

### Development Dependencies
- **Build Tools**: Vite, esbuild for bundling
- **Type Checking**: TypeScript with strict configuration
- **Development Server**: tsx for Node.js TypeScript execution

## Deployment Strategy

### Production Build Process
1. **Frontend**: Vite builds optimized React bundle to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment setting (development/production)

### Hosting Considerations
- Static assets served from Express in production
- Database migrations managed through Drizzle Kit
- CORS and security headers configured for production

### File Structure
```
├── client/          # React frontend application
├── server/          # Express backend application  
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

The application follows a clean separation of concerns with shared type safety between frontend and backend, enabling rapid development while maintaining code quality and consistency.

## Recent Changes (January 2025)

- Removed authentication system for simplified preview mode
- Disabled save functionality with clear user indicators
- Added "Preview Mode" badges throughout the interface
- Modified UI to indicate database persistence is coming soon
- Maintained full template preview and PDF generation capabilities