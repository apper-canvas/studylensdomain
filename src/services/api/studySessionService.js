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
}

export default new StudySessionService();