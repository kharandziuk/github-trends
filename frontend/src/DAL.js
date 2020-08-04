const axios = require('axios')

const dataFuntion = (data) => {
  return data
}

const kapa = axios.get('https://api.github.com/search/repositories', { params: { 'sort': 'stars', 'order': 'desc', q: "created:>2020-07-28"}})
  .then(response => dataFuntion(response.data.items))

const getData = () => kapa
  .catch(function (error) {
    return []
  })

export default getData
