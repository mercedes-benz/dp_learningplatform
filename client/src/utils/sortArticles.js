export default (articles, sortBy) => {
  switch (sortBy) {

    case "publication_ascending":
      return articles.sort((a, b) => {
        const date_a = new Date(a.post_date.replace(" ", "T"))
        const date_b = new Date(b.post_date.replace(" ", "T"))

        return date_a - date_b
      })
    
    case "last_updated":
      return articles.sort((a, b) => {
        const date_a = new Date(a.post_modified.replace(" ", "T"))
        const date_b = new Date(b.post_modified.replace(" ", "T"))

        return date_b - date_a
      })

    case "readingtime_descending":
      return articles.sort((a, b) => {
        return parseInt(b.fields.reading_time, 10) - parseInt(a.fields.reading_time, 10)
      })

    case "readingtime_ascending":
      return articles.sort((a, b) => {
        return parseInt(a.fields.reading_time, 10) - parseInt(b.fields.reading_time, 10)
      })

    case "most_comments":
      return articles.sort((a, b) => {
        return b.comment_count - a.comment_count
      })

    case "most_likes":
      return articles.sort((a, b) => {
        return b.num_likes - a.num_likes
      })

    default:
      return articles.sort((a, b) => {
        const date_a = new Date(a.post_date.replace(" ", "T"))
        const date_b = new Date(b.post_date.replace(" ", "T"))

        return date_b - date_a
      })
  }
}
