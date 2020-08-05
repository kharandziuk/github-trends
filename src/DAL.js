const axios = require('axios')

const dataFuntion = (data) => {
  return data
}

export const getData = ({ page = 1, language }) => {
  // FIXME: Removing languae filter doesn't work
  let q = 'created:>2020-07-28'
  if (language) {
    q = q + ` language:${language}`
  }
  return axios
    .get('https://api.github.com/search/repositories', {
      params: {
        page,
        sort: 'stars',
        order: 'desc',
        q,
      },
    })
    .then((response) => response.data.items)
}

export const getLanguages = () =>
  axios
    .get('https://api.github.com/languages')
    .then((response) => dataFuntion(response.data))
