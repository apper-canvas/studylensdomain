import studySessionData from '@/services/mockData/studySessions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudySessionService {
  constructor() {
    this.studySessions = [...studySessionData];
  }

  async getAll() {
    await delay(200);
    return [...this.studySessions];
  }

  async getById(id) {
    await delay(150);
    const session = this.studySessions.find(s => s.id === id);
    return session ? { ...session } : null;
  }

  async create(sessionData) {
    await delay(250);
    const newSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      cardsReviewed: 0,
      correctAnswers: 0,
      endTime: null,
      ...sessionData
    };
    this.studySessions.push(newSession);
    return { ...newSession };
  }

  async update(id, data) {
    await delay(200);
    const index = this.studySessions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSession = {
        ...this.studySessions[index],
        ...data
      };
      this.studySessions[index] = updatedSession;
      return { ...updatedSession };
    }
    throw new Error('Study session not found');
  }

  async delete(id) {
    await delay(150);
    const index = this.studySessions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.studySessions.splice(index, 1);
      return true;
    }
    throw new Error('Study session not found');
  }

  async endSession(id) {
    await delay(200);
    const index = this.studySessions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSession = {
        ...this.studySessions[index],
        endTime: new Date().toISOString()
      };
      this.studySessions[index] = updatedSession;
      return { ...updatedSession };
    }
throw new Error('Study session not found');
  }

  async getStreak() {
    await delay(150);
    const sessions = [...this.studySessions]
      .filter(s => s.endTime)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    if (sessions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sessions) {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  }

  async getReviewDates() {
    await delay(200);
    const today = new Date();
    const reviewDates = [];
    
    // Generate review dates for next 30 days based on spaced repetition
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      // Schedule reviews on certain intervals (1, 3, 7, 14, 30 days)
      if ([1, 3, 7, 14, 30].includes(i)) {
        reviewDates.push({
          Id: i,
          date: date.toISOString().split('T')[0],
          cardCount: Math.floor(Math.random() * 10) + 5,
          priority: i <= 3 ? 'high' : i <= 7 ? 'medium' : 'low'
        });
      }
    }
    
    return reviewDates;
  }

  async scheduleReview(date, cardIds) {
    await delay(200);
    // In a real app, this would schedule specific cards for review
    return {
      Id: Date.now(),
      date,
      cardIds,
      scheduled: true,
      createdAt: new Date().toISOString()
    };
  }
}

export default new StudySessionService();