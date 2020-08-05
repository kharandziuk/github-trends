const axios = require('axios')

const dataFuntion = (data) => {
  return data
}

const getData = (page = 0) =>
  axios
    .get('https://api.github.com/search/repositories', {
      params: {
        page,
        sort: 'stars',
        order: 'desc',
        q: 'created:>2020-07-28',
      },
    })
    .then((response) => dataFuntion(response.data.items))
    .catch(function (error) {
      return []
    })

export default getData
