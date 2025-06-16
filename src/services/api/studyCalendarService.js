import calendarEventsData from '@/services/mockData/calendarEvents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StudyCalendarService {
  constructor() {
    this.events = [...calendarEventsData];
    this.lastId = Math.max(...this.events.map(e => e.Id), 0);
  }

  async getAll() {
    await delay(200);
    return [...this.events];
  }

  async getById(id) {
    await delay(150);
    const event = this.events.find(e => e.Id === parseInt(id));
    return event ? { ...event } : null;
  }

  async getByDate(date) {
    await delay(150);
    return this.events.filter(e => e.date === date).map(e => ({ ...e }));
  }

  async getByDateRange(startDate, endDate) {
    await delay(200);
    return this.events.filter(e => 
      e.date >= startDate && e.date <= endDate
    ).map(e => ({ ...e }));
  }

  async create(eventData) {
    await delay(250);
    const newEvent = {
      Id: ++this.lastId,
      type: 'review',
      priority: 'medium',
      completed: false,
      ...eventData
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, data) {
    await delay(200);
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      const updatedEvent = {
        ...this.events[index],
        ...data
      };
      this.events[index] = updatedEvent;
      return { ...updatedEvent };
    }
    throw new Error('Calendar event not found');
  }

  async delete(id) {
    await delay(150);
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      this.events.splice(index, 1);
      return true;
    }
    throw new Error('Calendar event not found');
  }

  async markCompleted(id) {
    await delay(200);
    return this.update(id, { completed: true });
  }

  async reschedule(id, newDate) {
    await delay(200);
    return this.update(id, { date: newDate });
  }
}

export default new StudyCalendarService();