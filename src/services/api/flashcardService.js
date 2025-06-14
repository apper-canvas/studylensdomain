import flashcardData from '@/services/mockData/flashcards.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FlashcardService {
  constructor() {
    this.flashcards = [...flashcardData];
  }

  async getAll() {
    await delay(250);
    return [...this.flashcards];
  }

  async getById(id) {
    await delay(200);
    const flashcard = this.flashcards.find(f => f.id === id);
    return flashcard ? { ...flashcard } : null;
  }

  async getByNoteId(noteId) {
    await delay(200);
    return this.flashcards.filter(f => f.noteId === noteId).map(f => ({ ...f }));
  }

  async create(flashcardData) {
    await delay(300);
    const newFlashcard = {
      id: Date.now().toString(),
      noteId: flashcardData.noteId,
      question: flashcardData.question,
      answer: flashcardData.answer,
      mastery: 0,
      lastReviewed: null
    };
    this.flashcards.push(newFlashcard);
    return { ...newFlashcard };
  }

  async update(id, data) {
    await delay(250);
    const index = this.flashcards.findIndex(f => f.id === id);
    if (index !== -1) {
      const updatedFlashcard = {
        ...this.flashcards[index],
        ...data,
        lastReviewed: new Date().toISOString()
      };
      this.flashcards[index] = updatedFlashcard;
      return { ...updatedFlashcard };
    }
    throw new Error('Flashcard not found');
  }

  async delete(id) {
    await delay(200);
    const index = this.flashcards.findIndex(f => f.id === id);
    if (index !== -1) {
      this.flashcards.splice(index, 1);
      return true;
    }
    throw new Error('Flashcard not found');
  }

  async generateFromKeyPoints(noteId, keyPoints) {
    await delay(400);
    const flashcards = [];
    
    keyPoints.forEach((point, index) => {
      if (point.text.length > 20) {
        // Generate question from key point
        let question = '';
        let answer = point.text;
        
        // Simple question generation based on content patterns
        if (point.text.includes(':')) {
          const parts = point.text.split(':');
          question = `What is ${parts[0].trim()}?`;
          answer = parts[1].trim();
        } else if (point.text.toLowerCase().includes('define') || point.text.toLowerCase().includes('definition')) {
          question = `Define: ${point.text.split(' ').slice(0, 3).join(' ')}`;
        } else {
          question = `Explain: ${point.text.substring(0, 50)}...`;
        }
        
        const flashcard = {
          id: (Date.now() + index).toString(),
          noteId: noteId,
          question: question,
          answer: answer,
          mastery: 0,
          lastReviewed: null
        };
        
        this.flashcards.push(flashcard);
        flashcards.push({ ...flashcard });
      }
    });
    
    return flashcards;
  }
}

export default new FlashcardService();