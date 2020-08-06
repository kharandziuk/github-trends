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

export const getToken = (code) =>
  axios
    .post(
      'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
      {
        code,
        client_id: 'Iv1.091542392bd81a08',
        client_secret: '150410448c78a07495755025fe409c4b95c2930b',
        redirect_uri: 'http://localhost:3000',
      },
    )
    .then((response) => dataFuntion(response.data))
