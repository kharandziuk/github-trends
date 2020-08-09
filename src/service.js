import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

export const getRepos = ({ page = 1, language }) => {
  //FIXME: hardcode for simplicity
  const date = moment().subtract(7, 'days').format('YYYY-MM-DD')
  let q = `created:>${date}`
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
    .then((response) =>
      response.data.items.map((x) =>
        _.pick(
          x,
          'full_name',
          'html_url',
          'stargazers_count',
          'owner',
          'name',
          'description',
        ),
      ),
    )
}

export const getLanguages = () =>
  axios
    .get('https://api.github.com/languages')
    .then((response) => response.data)

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
    .then((response) => response.data)

export const starRepo = (repo, token) =>
  axios
    .put(
      `https://api.github.com/user/starred/${repo}`,
      {},
      {
        headers: {
          Authorization: `token ${token}`,
        },
      },
    )
    .then((response) => {
      return response.data
    })

export const unstarRepo = (repo, token) =>
  axios
    .delete(`https://api.github.com/user/starred/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })

export const getStarredRepos = (token, page = 0) =>
  axios
    .get(`https://api.github.com/user/starred`, {
      headers: {
        Authorization: `token ${token}`,
      },
      params: {
        per_page: 100,
        page,
      },
    })
    .then((response) => {
      return response.data.map((x) => x.full_name)
    })
