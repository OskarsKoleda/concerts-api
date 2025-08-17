export enum EventCategory {
  MusicConcert = "Music Concert",
  MusicFestival = "Music Festival",
  Theater = "Theater",
  CreativeEvening = "Creative Evening",
}

export const MUSIC_CATEGORIES = [
  EventCategory.MusicConcert,
  EventCategory.MusicFestival,
] as const;
