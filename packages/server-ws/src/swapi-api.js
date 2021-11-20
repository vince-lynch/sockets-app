const axios = require('axios')
const random = require('lodash.random')

const API_BASE_URL = 'https://swapi.dev/api/'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
})

/**
 * Save an API call by using a static list of results
 */
const filmIdMap = new Map([
  ['https://swapi.dev/api/films/1/', 'A New Hope'],
  ['https://swapi.dev/api/films/2/', 'The Empire Strikes Back'],
  ['https://swapi.dev/api/films/3/', 'Return of the Jedi'],
  ['https://swapi.dev/api/films/4/', 'The Phantom Menace'],
  ['https://swapi.dev/api/films/5/', 'Attack of the Clones'],
  ['https://swapi.dev/api/films/6/', 'Revenge of the Sith']
])

/**
 * Get a random message emit delay of 250-1000ms
 *
 * @returns number of milliseconds to delay
 */
const getDelayMs = () => {
  return random(250, 1000, false)
}

/**
 * Create an error response object
 *
 * @param {string} errorText error text to display
 */
const makeErrorResponse = (errorText) => {
  return [
    {
      page: -1,
      resultCount: -1,
      error: errorText
    }
  ]
}

/**
 * Create a valid data response object
 *
 * @param {object} resData
 */
const makeValidResponse = (resData) => {
  return resData.results.map((x, idx) => {
    const films = x.films
      .map((y) => {
        return filmIdMap.get(y.trim())
      })
      .filter((y) => {
        return y && y !== undefined && y !== null
      })
      .join(', ')
    return {
      page: idx + 1,
      resultCount: resData.count,
      name: x.name,
      films,
      delay: getDelayMs()
    }
  })
}

/**
 * Check whether a SWAPI result object is valid + has data
 *
 * @param {object} res result object to check
 * @returns {boolean} true if valid + has results, else false
 */
const swapiResponseHasData = (res) => {
  return res && res.data && res.data.count
}

/**
 * If pagination is in effect- iterate through
 *
 * @param {string} nextUrl Next page to fetch
 * @param {Array} resultArr array of accumulated results
 */
async function fetchMore(nextUrl, resultArr) {
  try {
    const cleanNextUrl = nextUrl.replace(API_BASE_URL, '')
    console.log(`Pagination: Next Url: ${cleanNextUrl}`)
    const pageResults = await axiosInstance.get(cleanNextUrl)
    // Console.log(`-- pageResults got : ${JSON.stringify(pageResults.data.results[0], null, 2)}`);
    if (swapiResponseHasData(pageResults)) {
      if (pageResults.data.next) {
        // Console.log(`---> onto the next one: ${pageResults.data.next}`);
        return await fetchMore(pageResults.data.next, [
          ...resultArr,
          ...pageResults.data.results
        ])
      }

      // Console.log(`---> returning combined arrays`);
      return [...resultArr, ...pageResults.data.results]
    }

    // Console.log(`---> returning resultArr`);
    return resultArr
  } catch (e) {
    console.error('Error fetching subsequent pages: ', e)
    return resultArr
  }
}

/**
 * Search the SWAPI with the provided query string
 *
 * @param {string} searchText case-insensitive query text
 */
async function doSearch(searchText) {
  return new Promise((resolve) => {
    if (searchText && typeof searchText === 'string' && searchText.length) {
      if (searchText.toLowerCase() === 'fail') {
        const FAIL_TEST_CASE = 'Failure test case reached!'
        console.log(`${FAIL_TEST_CASE}`)
        resolve(makeErrorResponse(FAIL_TEST_CASE))
      } else {
        const queryPath = `people/?search=${searchText}`

        axiosInstance
          .get(queryPath)
          .then(async (res) => {
            // eslint-disable-next-line promise/always-return
            if (swapiResponseHasData(res)) {
              // Console.log(`res.data.next: ${res.data.next}`);
              console.log(
                `Got ${res.data.count} match${
                  res.data.count !== 1 ? 'es' : ''
                }, query: '${searchText}'`
              )
              if (res.data.next) {
                const consolidated = await fetchMore(
                  res.data.next,
                  res.data.results
                )
                // Console.log(`consolidated results : ${JSON.stringify(consolidated, null, 2)}`);
                const combinedDataset = {
                  count: res.data.count,
                  results: [...consolidated]
                }
                // Console.log(`-- combined dset : ${JSON.stringify(combinedDataset, null, 2)}`);
                resolve(makeValidResponse(combinedDataset))
              } else {
                resolve(makeValidResponse(res.data))
              }
            } else {
              const noMatches = `No valid matches retrieved for query '${searchText}'`
              console.log(noMatches)
              resolve(makeErrorResponse(noMatches))
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            resolve(makeErrorResponse(e))
          })
      }
    } else {
      const INVALID_ARGS = 'Invalid search text provided'
      console.error(`${INVALID_ARGS}`)
      resolve(makeErrorResponse(INVALID_ARGS))
    }
  })
}

module.exports = {
  doSearch
}
