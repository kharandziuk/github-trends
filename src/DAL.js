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
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
        redirect_uri: process.env.REACT_APP_REDIRECT_URL,
      },
    )
    .then((response) => {
      return Object.fromEntries(new URLSearchParams(response.data))
    })

export const getProfile = (token) =>
  axios
    .get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((response) => dataFuntion(response.data))
