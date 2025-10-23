type ResponseData = unknown | null

const response = (statusCode: number, message: string, data: ResponseData = null) => {
  return {
    statusCode,
    message,
    ...(data !== null ? { data } : {})
  }
}

export default response
