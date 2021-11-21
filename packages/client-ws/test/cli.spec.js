const path = require('path')
const { spawn } = require('child_process')

const defaultTimeout = 12 * 1000

const writeQuery = (c, query = 'Luke Skywalker') =>
  new Promise((resolve) => {
    const output = { results: [], error: null }

    c.stdin.write(`${query}\r`)

    c.stdout.on('data', (data) => {
      const s = data.toString()
      const pages = s.split('\n')

      pages.forEach((page) => {
        if (page[0] === '(') {
          output.results.push(page)
        }
      })
      if (
        output.results.length &&
        pages[pages.length - 1] ===
          'What character would you like to search for? '
      ) {
        resolve(output)
      }
    })

    c.stderr.on('data', (data) => {
      const p = data.toString().split('\n')
      // eslint-disable-next-line prefer-destructuring
      output.error = p[0]
      resolve(output)
    })
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

    expect(results.length).toBe(1)

    expect(results[0]).toBe(
      '(1/1) Luke Skywalker - A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith'
    )
  },
  defaultTimeout
)

test(
  'Darth Vader query should return 1 result with 4 films',
  async () => {
    const QUERY = 'Darth Vader'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(error).toBe(null)

    expect(results.length).toBe(1)

    expect(results[0]).toBe(
      '(1/1) Darth Vader - A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith'
    )
  },
  defaultTimeout
)

test(
  'Roger Moore should fail',
  async () => {
    const QUERY = 'Roger Moore'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(results.length).toBe(0)

    expect(error).toBe(`No valid matches retrieved for query '${QUERY}'`)
  },
  defaultTimeout
)

test(
  'Character "l" should return lots of results',
  async () => {
    const QUERY = 'l'
    const { results, error } = await writeQuery(this.c, QUERY)

    expect(error).toBe(null)

    expect(results.length).toBe(37)

    expect(results[26]).toBe(
      `(27/37) Plo Koon - The Phantom Menace, Attack of the Clones, Revenge of the Sith`
    )
  },
  defaultTimeout
)

test(
  'Make two sequential queries',
  async () => {
    const { results, error } = await writeQuery(this.c, 'Lando')

    expect(error).toBe(null)

    expect(results.length).toBe(1)

    expect(results[0]).toBe(
      `(1/1) Lando Calrissian - The Empire Strikes Back, Return of the Jedi`
    )

    const { results: r, error: e } = await writeQuery(
      this.c,
      'Biggs Darklighter'
    )

    expect(e).toBe(null)

    expect(r.length).toBe(1)

    expect(r[0]).toBe(`(1/1) Biggs Darklighter - A New Hope`)
  },
  defaultTimeout
)

afterEach(() => {
  return this.c.kill('SIGINT')
})
