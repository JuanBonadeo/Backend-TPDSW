export interface CreateMovieDto {
  title: string
  duration?: number
  description?: string
  release_date?: number //year
  rating?: number
  id_category: number
  id_director: number
}
