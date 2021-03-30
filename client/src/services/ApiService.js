import {fetchApi, fetchAuthApi} from "../utils"
import {vars, urls} from "../config"

/**
 * Menu
 */
const getMenuBySlug = async (slug, lang) => {
  return await fetchApi(`/menus/${slug}?lang=${lang}`)
}

/**
 * Search
 */
const getSearchedArticles = async (slug, offset, lang) => {
  return await fetchApi(
    `/search?q=${encodeURI(slug)}&lang=${lang}&offset=${offset}&posts_per_page=${
    vars.search.results
    }`
  )
}

/**
 * Content
 */
const getPageContentBySlug = async (slug, lang, preview = false, useId = false) => {
  let path = `/pages/${slug}?lang=${lang}`
  if(preview) {
    path = `${path}&preview`
  }
  if(useId) {
    path = `${path}&use_id`
  }
  return await fetchApi(path)
}

/**
 * Knowledge
 */
const getKnowledgeCategories = async (lang) => {
  return await fetchApi(`/knowledge/categories?lang=${lang}`)
}

const getKnowledgeSubcategoriesByCategory = async (id, lang) => {
  return await fetchApi(`/knowledge/category/${id}?lang=${lang}`)
}

const getKnowledgeArticlesBySubcategory = async (id, lang) => {
  return await fetchApi(`/knowledge/articles/${id}?lang=${lang}`)
}

const getLatestKnowledgeArticles = async (lang) => {
  return await fetchApi(
    `/knowledge/latest?lang=${lang}&posts_per_page=${vars.knowledge.latest}`
  )
}

const getAllKnowledgeArticles = async (sortby, orderby, lang) => {
  return await fetchApi(`/knowledge/articles?lang=${lang}&sortby=${sortby}&orderby=${orderby}`)
}

const getKnowledgeArticlesBySubcategoryWithContent = async (id, lang) => {
  return await fetchApi(`/knowledge/articles/${id}?include_content&lang=${lang}`)
}

const getKnowledgeArticleByID = async (id, lang, preview = false, useId = false) => {
  let path = `/knowledge/article/${id}?lang=${lang}`
  if(preview) {
    path = `${path}&preview`
  }
  if(useId) {
    path = `${path}&use_id`
  }
  return await fetchApi(path)
}

/**
 * Knowledge Tags
 */
const getKnowledgeTags = async (lang) => {
  return await fetchApi(`/knowledge/tags?lang=${lang}`)
}
const getKnowledgeArticlesByTag = async (id, tag, lang) => {
  return await fetchApi(`/knowledge/articles/${id}?${lang}?&tag=${tag}`)
}

/**
* Knowledge Sort
*/
const getKnowledgeArticlesBySort = async (id, tag, sortby, orderby, lang) => {
  return await fetchApi(`/knowledge/articles/${id}?lang=${lang}&tag=${tag}&sortby=${sortby}&orderby=${orderby}`)
}

/**
 * Knowledge Comments
 */
const getCommentsByKnowledgeArticleID = async (id, comments_per_page = 5, offset = 0, lang) => {
  return await fetchApi(`/knowledge/comments/${id}?comments_per_page=${comments_per_page}&offset=${offset}&lang=${lang}`)
}

const addCommentToKnowledgeArticle = async (slug, message) => {
  return await fetchApi(`/knowledge/add_comment/${slug}`, "POST", {
    body: JSON.stringify({ comment_content: message })
  })
}

/**
 * Knowledge Sidebar
 */
const getSidebar = async (lang) => {
  return await fetchApi(`/knowledge/categories_and_subcategories?lang=${lang}`)
}

/**
 * FAQ
 */
const getFAQArticlesByCategory = async (id, lang, preview) => {
  let path = `/faq/articles/${id}?lang=${lang}`
  if(preview) {
    path = `${path}&preview`
  }
  return await fetchApi(path)
}

/**
 * FAQ Sidebar
 */
const getFAQSidebar = async (lang) => {
  return await fetchApi(`/faq/categories?lang=${lang}`)
}

/**
 * Learning
 */
const getLearningThemes = async (lang) => {
  return await fetchApi(`/learning/topics?lang=${lang}`)
}

const getLearningModulesByTheme = async (id, lang) => {
  return await fetchApi(`/learning/topic/${id}?lang=${lang}`)
}

const getLearningArticlesByModule = async id => {
  return await fetchApi(`/learning/articles/${id}`)
}

const getLearningArticlesByModuleWithContent = async (id, lang) => {
  return await fetchApi(`/learning/articles/${id}?include_content&lang=${lang}`)
}

const getLatestLearningArticles = async () => {
  return await fetchApi(
    `/learning/latest?posts_per_page=${vars.learning.latest}`
  )
}

const getLearningArticleByID = async (id, lang, preview = false, useId = false) => {
  let path = `/learning/article/${id}?lang=${lang}`
  if(preview) {
    path = `${path}&preview`
  }
  if(useId) {
    path = `${path}&use_id`
  }
  return await fetchApi(path)
}

const markLearningArticleAsRead = async (id, lang) => {
  return await fetchApi(`/learning/mark_as_read/${id}?lang=${lang}`)
}

/**
 * Learning Tags
 */
const getLearningTags = async () => {
  return await fetchApi("/learning/tags")
}
const getLearningArticlesByTag = async (id, tag) => {
  return await fetchApi(`/learning/articles/${id}?tag=${tag}`)
}

/**
* Learning Sort
*/
const getLearningArticlesBySort = async (id, tag, sortby, orderby) => {
  return await fetchApi(`/learning/articles/${id}?tag=${tag}&sortby=${sortby}&orderby=${orderby}`)
}

/**
 * Learning Comments
 */
const getCommentsByLearningArticleSlug = async (slug, comments_per_page = 5, offset = 0) => {
  return await fetchApi(`/learning/comments/${slug}?comments_per_page=${comments_per_page}&offset=${offset}`)
}

const addCommentToLearningArticle = async (slug, message) => {
  return await fetchApi(`/learning/add_comment/${slug}`, "POST", {
    body: JSON.stringify({ comment_content: message })
  })
}

/**
 * Learning Sidebar
 */
const getLearningSidebar = async (lang) => {
  return await fetchApi(`/learning/topics_and_modules?lang=${lang}`)
}

/**
 * Auth
 */
const getAuthToken = async (username, password) => {
  return await fetchAuthApi("/token", "POST", {
    body: JSON.stringify({username: username, password: password}),
  });
}
const logout = async () => {
  const url = new URL(urls.api);

  return await fetch(`${url.protocol}//${url.hostname}/?logout`, {
    credentials: "include",
    mode: document.location.hostname === "localhost" ? "no-cors" : "cors",
  });
}
const backendLogin = async (token) => {
  const url = new URL(urls.api);

  return await fetch(`${url.protocol}//${url.hostname}:${url.port}/?backend_login&token=${token}`, {
    credentials: "include",
    mode: document.location.hostname === "localhost" ? "no-cors" : "cors",
  });
}

/**
 * User Profile
 */
const getUserProfile = async () => {
  return await fetchApi(`/user`)
}
const getUserProgress = async () => {
  return await fetchApi(`/learning/user-progress`)
}
const getUserCertificates = async (lang) => {
  return await fetchApi(`/user/certificates?lang=${lang}`)
}
const postUserAvatar = async (file, token) => {
  const formData = new FormData()

  formData.append("avatar", file)

  return await fetchApi("/user/upload-avatar", "POST", { body: formData, headers: { "Authorization": `Bearer ${ token }`}})
}
const addBookmark = async (id) => {
  return await fetchApi("/bookmarks/add", "POST", { body: JSON.stringify({ article_id: id }) })
}
const removeBookmark = async (id, lang) => {
  return await fetchApi(`/bookmarks/remove?lang=${lang}`, "POST", { body: JSON.stringify({ article_id: id }) })
}
const removeAllBookmarks = async (lang) => {
  return await fetchApi(`/bookmarks/remove?lang=${lang}`, "POST", { body: JSON.stringify({ remove_all: true }) })
}
const getBookmarks = async (lang) => {
  return await fetchApi(`/bookmarks?lang=${lang}`)
}
const getBookmarksNumber = async (lang) => {
  return await fetchApi(`/bookmarks/number?lang=${lang}`)
}

const addLike = async (id) => {
  return await fetchApi("/likes/add", "POST", { body: JSON.stringify({ article_id: id }) })
}
const removeLike = async (id) => {
  return await fetchApi(`/likes/remove`, "POST", { body: JSON.stringify({ article_id: id }) })
}

/**
 * OAuth
 */
const getUserDataByToken = async (token) => {
  return await fetchApi("/sso/get_user_data", "GET", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    }
  })
}


const api = {
  getMenuBySlug: (slug, lang) => getMenuBySlug(slug, lang),

  getSearchedArticles: (slug, offset, lang) => getSearchedArticles(slug, offset, lang),

  getKnowledgeCategories: (lang) => getKnowledgeCategories(lang),
  getKnowledgeSubcategoriesByCategory: (id, lang) => getKnowledgeSubcategoriesByCategory(id, lang),
  getKnowledgeArticlesBySubcategory: (id, lang) => getKnowledgeArticlesBySubcategory(id, lang),
  getLatestKnowledgeArticles: (lang) => getLatestKnowledgeArticles(lang),
  getKnowledgeArticlesBySubcategoryWithContent: (id, lang) => getKnowledgeArticlesBySubcategoryWithContent(id, lang),
  getKnowledgeArticleByID: (id, lang, preview, useId) => getKnowledgeArticleByID(id, lang, preview, useId),
  getAllKnowledgeArticles: (sortby, orderby, lang) => getAllKnowledgeArticles(sortby, orderby, lang),
  getKnowledgeTags: (lang) => getKnowledgeTags(lang),
  getKnowledgeArticlesByTag: (id, tag, lang) => getKnowledgeArticlesByTag(id, tag, lang),
  getKnowledgeArticlesBySort: (id, tag, sortby, orderby, lang) => getKnowledgeArticlesBySort(id, tag, sortby, orderby, lang),
  getCommentsByKnowledgeArticleID: (id, comments_per_page, offset, lang) => getCommentsByKnowledgeArticleID(id, comments_per_page, offset, lang),
  addCommentToKnowledgeArticle: (slug, message) => addCommentToKnowledgeArticle(slug, message),
  getSidebar: (lang) => getSidebar(lang),

  getFAQArticlesByCategory: (id, lang, preview) => getFAQArticlesByCategory(id, lang, preview),
  getFAQSidebar: (lang) => getFAQSidebar(lang),

  getLearningThemes: (lang) => getLearningThemes(lang),
  getLearningModulesByTheme: (id, lang) => getLearningModulesByTheme(id, lang),
  getLearningArticlesByModule: id => getLearningArticlesByModule(id),
  getLearningArticlesByModuleWithContent: (id, lang) => getLearningArticlesByModuleWithContent(id, lang),
  getLatestLearningArticles: () => getLatestLearningArticles(),
  getLearningArticleByID: (id, lang, preview, useId) => getLearningArticleByID(id, lang, preview, useId),
  getLearningTags: () => getLearningTags(),
  getLearningArticlesByTag: (slug, tag) => getLearningArticlesByTag(slug, tag),
  getLearningArticlesBySort: (slug, tag, sortby, orderby) => getLearningArticlesBySort(slug, tag, sortby, orderby),
  getCommentsByLearningArticleSlug: (slug, comments_per_page, offset) => getCommentsByLearningArticleSlug(slug, comments_per_page, offset),
  addCommentToLearningArticle: (slug, message) => addCommentToLearningArticle(slug, message),
  getLearningSidebar: (lang) => getLearningSidebar(lang),
  markLearningArticleAsRead: (id, lang) => markLearningArticleAsRead(id, lang),

  getPageContentBySlug: (slug, lang, preview, useId) => getPageContentBySlug(slug, lang, preview, useId),

  getAuthToken: (username, password) => getAuthToken(username, password),
  logout: () => logout(),
  backendLogin: (token) => backendLogin(token),

  getUserProfile: () => getUserProfile(),
  getUserProgress: () => getUserProgress(),
  getUserCertificates: (lang) => getUserCertificates(lang),
  postUserAvatar: (file, token) => postUserAvatar(file, token),
  addBookmark: (id) => addBookmark(id),
  removeBookmark: (id, lang) => removeBookmark(id, lang),
  removeAllBookmarks: (lang) => removeAllBookmarks(lang),
  getBookmarks: (lang) => getBookmarks(lang),
  getBookmarksNumber: (lang) => getBookmarksNumber(lang),

  addLike: (id) => addLike(id),
  removeLike: (id) => removeLike(id),

  getUserDataByToken: (token) => getUserDataByToken(token),
}

export default api
