# Ad Tech Quiz - Interactive Learning Platform

## Abstract

**Ad Tech Quiz** is a modern, interactive web-based quiz application designed to test and enhance knowledge of the advertising technology ecosystem. Built with cutting-edge technologies, the application provides an engaging learning experience through gamified quizzing, real-time leaderboards, and intelligent adaptive learning modes.

The platform extracts questions from "The AdTech Book" and presents them through an intuitive, visually stunning interface with dark mode support, smooth animations, and responsive design. Users can test their knowledge across different chapters (Basics, Programmatic, Data & Privacy, etc.) or take a comprehensive assessment covering all topics.

## Project Overview

### Purpose
- **Educational**: Help marketing professionals, students, and enthusiasts master advertising technology concepts
- **Competitive**: Provide a global leaderboard system to encourage learning through friendly competition
- **Adaptive**: Offer multiple quiz modes including standard quizzes and the innovative "InsightLoop" reasoning-based learning

### Key Features

#### 🎯 Multi-Chapter Quiz System
- **Chapter-Specific Quizzes**: Focused assessments on individual topics (10 questions each)
- **Comprehensive Quiz**: Overall assessment covering all chapters (50 questions)
- **Smart Randomization**: Questions and answer options are shuffled for each session
- **Time Management**: 90 seconds per question with countdown timer

#### 🏆 Global Leaderboard
- **Chapter-Based Rankings**: Separate leaderboards for each topic
- **Overall Leaderboard**: Global rankings across all users
- **Real-Time Updates**: Scores sync instantly to cloud database
- **Filtering**: Dropdown menu to switch between chapter and overall leaderboards
- **Performance Metrics**: Displays score, percentage, time taken, and submission date

#### 🧠 InsightLoop Mode (Advanced)
- **Reasoning-Centric Learning**: Interactive adaptive training system
- **Progressive Difficulty**: Questions adapt based on user performance
- **Detailed Explanations**: In-depth reasoning for each answer

#### 🎨 Premium UI/UX
- **Dark/Light Mode**: Seamless theme switching with system preferences
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Glassmorphism Design**: Modern, elegant interface with backdrop blur effects
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Keyboard shortcuts (Arrow keys, 1-4 for answers)

#### ⚡ Performance Features
- **Question Navigator**: Side panel for quick navigation between questions
- **Review Before Submit**: Pre-submission review screen to check all answers
- **Progress Tracking**: Visual indicators for answered/unanswered questions
- **Streak Counter**: Displays consecutive correct answers
- **Confetti Celebrations**: Animated rewards for high scores

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion 12.x
- **Icons**: Lucide React
- **UI Utilities**: clsx, tailwind-merge

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma 5.x
- **CORS**: Full cross-origin support

### Deployment
- **Frontend Hosting**: Vercel (recommended)
- **Backend Hosting**: Render
- **Database**: Render PostgreSQL (free tier available)
- **CI/CD**: Automated via `render.yaml` blueprint

## Architecture

### Database Schema
```prisma
model Score {
  id             Int      @id @default(autoincrement())
  name           String
  score          Int
  totalQuestions Int
  timeUsed       Int      // in seconds
  percentage     Int
  chapterId      String   @default("overall")
  createdAt      DateTime @default(now())
  
  @@index([percentage, timeUsed])
  @@index([createdAt])
  @@index([chapterId])
}
```

### API Endpoints

#### POST `/api/scores`
Submit a new quiz score
```json
{
  "name": "John Doe",
  "score": 8,
  "totalQuestions": 10,
  "timeUsed": 450,
  "percentage": 80,
  "chapterId": "basics"
}
```

#### GET `/api/scores?limit=10&chapterId=basics`
Retrieve leaderboard entries
- **Query Parameters**:
  - `limit`: Number of entries (default: 10)
  - `chapterId`: Filter by chapter (optional, default: all)

### Frontend Architecture
- **Component-Based**: Modular React components for reusability
- **State Management**: React hooks (useState, useEffect)
- **Type Safety**: Strict TypeScript throughout
- **API Service Layer**: Centralized API calls in `services/api.ts`

## Project Structure

```
ad-tech-quiz/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── scores.ts        # API endpoints
│   │   └── index.ts              # Express server
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # DB migrations
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── ChapterSelection.tsx
│   │   ├── QuizCard.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── ResultScreen.tsx
│   │   └── InsightEngine.tsx
│   ├── services/
│   │   └── api.ts                # API client
│   ├── data/
│   │   ├── questions.json        # Quiz questions
│   │   └── insight-loops.json
│   ├── App.tsx                   # Main app component
│   └── main.tsx
├── render.yaml                   # Deployment config
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or use cloud database)
- npm or yarn

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/Swaroop772/quizapp.git
cd ad-tech-quiz
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Database**
Create `.env` file in `backend/`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/adtechquiz"
```

4. **Run Migrations**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Start Backend**
```bash
npm run dev
# Runs on http://localhost:3001
```

6. **Frontend Setup**
```bash
cd ..
npm install
```

7. **Configure API URL** (Optional for local dev)
Create `.env` file in root:
```env
VITE_API_URL=http://localhost:3001/api/scores
```

8. **Start Frontend**
```bash
npm run dev
# Runs on http://localhost:5173
```

## Deployment

### Quick Deploy (Render + Vercel)

The project includes a `render.yaml` Blueprint for one-click backend deployment.

**Step 1: Deploy Backend (Render)**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → Blueprint
3. Connect `quizapp` repository
4. Apply (creates database + API automatically)
5. Copy the API URL

**Step 2: Deploy Frontend (Vercel)**
1. Go to [Vercel](https://vercel.com)
2. New Project → Import `quizapp`
3. Add Environment Variable:
   - `VITE_API_URL`: Your Render API URL + `/api/scores`
4. Deploy

See [DEPLOYMENT.md](file:///C:/Users/swaro/.gemini/antigravity/brain/31990344-0891-4b9a-844f-a4bec8ffae70/DEPLOYMENT.md) for detailed instructions.

## Features in Detail

### Question Management
- **Source**: Extracted from "The AdTech Book" PDF
- **Coverage**: 1000+ questions across 6 chapters
- **Types**: Multiple Choice Questions (MCQ)
- **Explanations**: Each question includes detailed reasoning

### Scoring System
- **Calculation**: (Correct Answers / Total Questions) × 100
- **Tiebreaker**: Time taken (faster = better)
- **Storage**: Persistent in PostgreSQL
- **Display**: Real-time leaderboard updates

### User Experience
- **No Authentication Required**: Quick start with just a name
- **Name Persistence**: Saved in local state
- **Quick Edit**: Click to change name on home screen
- **Keyboard Support**: Full keyboard navigation

## Future Enhancements

- [ ] User authentication & profiles
- [ ] Achievement badges & certificates
- [ ] Social sharing of scores
- [ ] Question difficulty ratings
- [ ] Custom quiz creation
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Multiplayer real-time battles

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

- **Repository**: https://github.com/Swaroop772/quizapp
- **Issues**: https://github.com/Swaroop772/quizapp/issues

## Acknowledgments

- Question content sourced from "The AdTech Book"
- UI inspiration from modern web design trends
- Built with ❤️ for the AdTech community

---

**Built by Swaroop** | Last Updated: January 2026
