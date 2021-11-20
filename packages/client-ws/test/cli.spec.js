const path = require('path')
const { exec } = require('child_process')

/**
 * @param args
 * @param cwd
 */
function cli(args, cwd) {
  return new Promise((resolve) => {
    exec(
      `node ${path.resolve('./src/index.js')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      }
    )
  })
}

test(
  'Code should be 0',
  async () => {
    const QUERY = 'Luke Skywalker'

    const { code: exitCode, stdout: results } = await cli(
      ['search', QUERY],
      '.'
    )
    expect(results).toBe(
      'Luke Skywalker - A New Hope, The Empire Strikes Back, Return of the Jedi, Revenge of the Sith'
    )
    expect(results).toEqual(expect.stringContaining(QUERY))
    expect(exitCode).toBe(0)
  },
  12 * 1000
)
