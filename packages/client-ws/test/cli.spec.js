const path = require('path')
const { spawn } = require('child_process')

const defaultTimeout = 14 * 1000
const PAGINATION_REGEX = /\(([^)]+)\)/

const parseResult = (output, resolve) => (page) => {
  const p = page.match(PAGINATION_REGEX)
  const [_i, _totalPages] = p ? p[1].split('/') : [-1, -1]
  const i = Number(_i)
  const totalPages = Number(_totalPages)

  if (i >= 0) {
    let [_, films] = page.match(/\[(.*?)\]/)
    films = films.split(',')

    output.results.characters.push({ page: i, desc: page, films })

    if (i === totalPages) {
      const allData = Object.assign(output, {
        results: { characters: output.results.characters, totalPages }
      })
      resolve(allData)
    }
  }
}

const parseResults = (resolve, output) => (data) => {
  const s = data.toString()
  const pages = s.split('\n')

  pages.forEach(parseResult(output, resolve))
}

const parseError = (resolve, output) => (data) => {
  const err = data.toString().split('\n')
  const error = err[0] ? err[0] : null
  resolve({ ...output, error })
}

const writeQuery = (c, query = 'Luke Skywalker') =>
  new Promise((resolve) => {
    const output = { error: null, results: { characters: [], totalPages: 0 } }

    const parseStdOut = parseResults(resolve, output)
    const parseStdErr = parseError(resolve, output)

    c.stdin.write(`${query}\r`)

    c.stdout.on('data', parseStdOut)

    c.stderr.on('data', parseStdErr)
  })

beforeEach(() => {
  this.c = spawn('node', [path.resolve('./src/index.js')])
  return this.c.stdin.setEncoding('utf-8')
})

test(
  'Luke Skywalker query should return 1 result with 4 films',
  async () => {
    const QUERY = 'Luke Skywalker'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(error).toBe(null)

    const { characters, totalPages } = results

    expect(totalPages).toBe(1)

    const [lukeSkywalker] = characters

    expect(lukeSkywalker.desc).toBe(
      '(1/1) Luke Skywalker - [A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith]'
    )

    expect(lukeSkywalker.films.length).toBe(4)
  },
  defaultTimeout
)

test(
  'Darth Vader query should return 1 result with 4 films',
  async () => {
    const QUERY = 'Darth Vader'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(error).toBe(null)

    const { totalPages, characters } = results

    expect(totalPages).toBe(1)

    const [darthVader] = characters

    expect(darthVader.desc).toBe(
      '(1/1) Darth Vader - [A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith]'
    )

    expect(darthVader.films.length).toBe(4)
  },
  defaultTimeout
)

test(
  'Roger Moore should fail',
  async () => {
    const QUERY = 'Roger Moore'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(results.characters.length).toBe(0)

    expect(error).toBe(`No valid matches retrieved for query '${QUERY}'`)
  },
  defaultTimeout
)

test(
  'Character with "Darth" prefix should return a few different results',
  async () => {
    const QUERY = 'Darth'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(error).toBe(null)

    const { totalPages, characters } = results

    expect(totalPages).toBe(2)

    const [_, darthMaul] = characters

    expect(darthMaul.desc).toBe(`(2/2) Darth Maul - [The Phantom Menace]`)

    expect(darthMaul.films.length).toBe(1)
  },
  defaultTimeout
)

test(
  'Make two sequential queries',
  async () => {
    const { results, error } = await writeQuery(this.c, 'Lando')

    expect(error).toBe(null)

    const { totalPages, characters } = results

    expect(totalPages).toBe(1)

    const [landoCalrissian] = characters

    expect(landoCalrissian.desc).toBe(
      `(1/1) Lando Calrissian - [The Empire Strikes Back, Return of the Jedi]`
    )

    expect(landoCalrissian.films.length).toBe(2)

    const { results: r, error: e } = await writeQuery(
      this.c,
      'Biggs Darklighter'
    )

    expect(e).toBe(null)

    const { totalPages: tp, characters: chs } = r

    expect(tp).toBe(1)

    const [biggsDarklighter] = chs

    expect(biggsDarklighter.desc).toBe(`(1/1) Biggs Darklighter - [A New Hope]`)

    expect(biggsDarklighter.films.length).toBe(1)
  },
  defaultTimeout
)

afterEach(() => {
  return this.c.kill('SIGINT')
})
