import noteData from '@/services/mockData/notes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NoteService {
  constructor() {
    this.notes = [...noteData];
  }

  async getAll() {
    await delay(300);
    return [...this.notes];
  }

  async getById(id) {
    await delay(200);
    const note = this.notes.find(n => n.id === id);
    return note ? { ...note } : null;
  }

  async create(noteData) {
    await delay(400);
    const newNote = {
      id: Date.now().toString(),
      content: noteData.content,
      createdAt: new Date().toISOString(),
      summary: this.generateSummary(noteData.content),
      keyPoints: this.extractKeyPoints(noteData.content)
    };
    this.notes.push(newNote);
    return { ...newNote };
  }

  async update(id, data) {
    await delay(300);
    const index = this.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      const updatedNote = {
        ...this.notes[index],
        ...data,
        summary: data.content ? this.generateSummary(data.content) : this.notes[index].summary,
        keyPoints: data.content ? this.extractKeyPoints(data.content) : this.notes[index].keyPoints
      };
      this.notes[index] = updatedNote;
      return { ...updatedNote };
    }
    throw new Error('Note not found');
  }

  async delete(id) {
    await delay(200);
    const index = this.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notes.splice(index, 1);
      return true;
    }
    throw new Error('Note not found');
  }

  generateSummary(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyTopics = [];
    
    // Extract key topics from the content
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 20) {
        keyTopics.push(line.substring(0, 80) + (line.length > 80 ? '...' : ''));
      }
    }
    
    return keyTopics.join('\n• ');
  }

  extractKeyPoints(content) {
    const keyPoints = [];
    const lines = content.split('\n');
    
    // Look for important patterns
    const importantPatterns = [
      /^[\d\w\s]*:[\s\S]*$/,  // Definitions
      /\b(important|key|main|primary|essential|critical|fundamental)\b/i,
      /\b(definition|concept|theory|principle|rule|law)\b/i,
      /\b(remember|note|attention|warning|caution)\b/i
    ];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 15) {
        let importance = 'low';
        
        // Check for importance indicators
        if (importantPatterns.some(pattern => pattern.test(trimmed))) {
          importance = 'high';
        } else if (trimmed.includes('*') || trimmed.includes('**') || trimmed.toUpperCase() === trimmed) {
          importance = 'medium';
        }
        
        keyPoints.push({
          id: Date.now() + Math.random(),
          text: trimmed,
          importance: importance,
          highlighted: importance === 'high'
        });
      }
    });
    
    return keyPoints.slice(0, 8); // Limit to 8 key points
  }
}

export default new NoteService();