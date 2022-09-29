import { makeAutoObservable } from "mobx"
import { notesService } from "App/services"
import { Note, WriteNote, iTag } from 'App/services/NotesService'

interface SessionNotes {
  [sessionId: string]: Note[]
}

export default class NotesStore {
  notes: Note[] = []
  sessionNotes: SessionNotes = {}
  loading: boolean
  page = 1
  pageSize = 15
  activeTags: iTag[] = []

  constructor() {
    makeAutoObservable(this)
  }

  async fetchNotes() {
    this.loading = true
    try {
      const notes = await notesService.getNotes()
      this.notes = notes;
      return notes;
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  async fetchSessionNotes(sessionId: string) {
    this.loading = true
    try {
      const notes = await notesService.getNotesBySessionId(sessionId)
      this.sessionNotes[sessionId] = notes
      return notes;
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  async addNote(sessionId: string, note: WriteNote) {
    this.loading = true
    try {
      const addedNote = await notesService.addNote(sessionId, note)
      return addedNote
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  async deleteNote(noteId: number) {
    this.loading = true
    try {
      const deleted = await notesService.deleteNote(noteId)
      return deleted
    } catch (e) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  changePage(page: number) {
    this.page = page
  }

  toggleTag(tag: iTag) {
    if (this.activeTags.includes(tag)) {
      this.activeTags = this.activeTags.filter(exTag => tag !== exTag)
    } else {
      this.activeTags = [...this.activeTags, tag]
    }
  }
}
