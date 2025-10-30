import slugify from 'slugify'

const builtProductQuery = (query: any, deleted: boolean) => {
  const { sortKey, sortValue, status, maxPrice, minPrice, keyword } = query
  const find: Record<string, any> = { deleted }

  // lọc trạng thái
  if (status) find.status = status

  // lọc giá
  if (minPrice || maxPrice) {
    find.price = {}
    if (minPrice) find.price.$gte = +minPrice
    if (maxPrice) find.price.$lte = +maxPrice
  }

  // tìm kiếm
  if (keyword) {
    const formatKeyword = slugify(keyword, { replacement: '-', lower: false, locale: 'vi', trim: true })
    const regexSlug = new RegExp(formatKeyword, 'i')
    const regexKeyword = new RegExp(keyword, 'i')
    find.$or = [{ slug: regexSlug }, { title: regexKeyword }, { authors: regexKeyword }, { publisher: regexKeyword }]
  }

  // sort
  const sort: Record<string, any> = {}
  if (sortKey && sortValue) sort[sortKey] = sortValue
  sort.createdAt = -1

  return { find, sort }
}

export default {
  builtProductQuery
}
