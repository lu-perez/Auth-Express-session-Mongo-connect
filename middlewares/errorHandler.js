export const errorHandler = (err, req, res, next) => {
  if (err) {
    res.send('<h1>There was an error, please try again</h1>')
  }
}
