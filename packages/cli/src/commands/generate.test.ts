import dedent from 'dedent'
import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { createFixture, typecheck, watchConsole } from '../../test/utils.js'
import { generate } from './generate.js'

let console: ReturnType<typeof watchConsole>
beforeEach(() => {
  console = watchConsole()
  vi.useFakeTimers()

  const date = new Date(2023, 0, 30, 12)
  vi.setSystemTime(date)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

test('generates output', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.js': dedent`
          export default {
            out: 'generated.js',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.js
      ✔ Writing to generated.js"
    `)
})

test('generates typescript output', async () => {
  const { dir, paths } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.ts
      ✔ Writing to generated.ts"
    `)
  await expect(typecheck(paths.tsconfig)).resolves.toMatchInlineSnapshot('""')
})

test('generates output with plugin', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
            plugins: [
              {
                name: 'Test',
                async run({ contracts, isTypeScript, outputs }) {
                  return {
                    imports: '/* imports test */',
                    prepend: '/* prepend test */',
                    content: '/* content test */',
                  }
                },
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.ts
      ✔ Writing to generated.ts"
    `)
  /* eslint-disable no-irregular-whitespace */
  await expect(
    readFile(resolve(dir, 'generated.ts'), 'utf8'),
  ).resolves.toMatchInlineSnapshot(`
      "/* imports test */

      /* prepend test */

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Foo
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      export const fooAbi = [] as const

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Test
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /* content test */
      "
    `)
  /* eslint-enable no-irregular-whitespace */
})

test('behavior: invalid cli options', async () => {
  const { dir } = await createFixture()
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(
    generate({
      // @ts-expect-error possible to pass untyped options through from cli
      config: 1,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
        "Invalid option
        - Expected string, received number at \`config\`"
      `)
})

test('behavior: config not found', async () => {
  const { dir } = await createFixture()
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(
    '"Config not found"',
  )
})

test('behavior: config not found for path', async () => {
  const { dir } = await createFixture()
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  try {
    await generate({ config: 'wagmi.config.js' })
  } catch (error) {
    expect(
      (error as Error).message.replace(dir, 'path/to/project'),
    ).toMatchInlineSnapshot('"Config not found at wagmi.config.js"')
  }
})

test('behavior: config out not unique', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
            export default [
              {
                out: 'generated.ts',
                contracts: [
                  {
                    abi: [],
                    name: 'Foo',
                  },
                ]
              },
              {
                out: 'generated.ts',
                contracts: [
                  {
                    abi: [],
                    name: 'Foo',
                  },
                ],
              },
            ]
          `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(
    '"out \\"generated.ts\\" must be unique."',
  )
})

test('behavior: config contract names not unique', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
            export default {
              out: 'generated.ts',
              contracts: [
                {
                  abi: [],
                  name: 'Foo',
                },
                {
                  abi: [],
                  name: 'Foo',
                },
              ],
            }
          `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(
    '"Contract name \\"Foo\\" must be unique."',
  )
})

test('behavior: displays message if no contracts found', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': "export default { out: 'generated.ts' }",
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(
    `
          "- Validating plugins
          ✔ Validating plugins
          - Resolving contracts
          ✖ Resolving contracts
          No contracts found."
        `,
  )
})

test('behavior: throws when abi is invalid', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
              export default {
                out: 'generated.ts',
                contracts: [
                  {
                    abi: [{
                      type: 'function',
                      name: 'balanceOf',
                      stateMutability: 'view',
                      inputs: [{ type: 'address' }],
                    }],
                    name: 'Foo',
                  },
                ],
              }
            `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(`
          "Invalid ABI for contract \\"Foo\\"
          - Invalid input at \`[0]\`"
        `)
})

test('behavior: throws when address is invalid', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
              export default {
                out: 'generated.ts',
                contracts: [
                  {
                    abi: [],
                    address: '0xfoo',
                    name: 'Foo',
                  },
                ],
              }
            `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(`
          "Invalid address for contract \\"Foo\\"
          - Invalid address"
        `)
})

test('behavior: throws when multichain address is invalid', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
              export default {
                out: 'generated.ts',
                contracts: [
                  {
                    abi: [],
                    address: {
                      1: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
                      5: '0xfoo',
                    },
                    name: 'Foo',
                  },
                ],
              }
            `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(`
          "Invalid address for contract \\"Foo\\"
          - Invalid address at \`5\`"
        `)
})

test('behavior: displays message if using --watch flag without watchers configured', async () => {
  const { dir } = await createFixture({
    files: {
      'wagmi.config.js': dedent`
            export default {
              out: 'generated.ts',
              contracts: [
                {
                  abi: [],
                  name: 'Foo',
                },
              ],
            }
          `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate({ watch: true })

  expect(console.formatted).toMatchInlineSnapshot(`
          "- Validating plugins
          ✔ Validating plugins
          - Resolving contracts
          ✔ Resolving contracts
          - Running plugins
          ✔ Running plugins
          - Writing to generated.ts
          ✔ Writing to generated.ts
          Used --watch flag, but no plugins are watching."
        `)
})

test('fix failing test: generates output with plugin', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
            plugins: [
              {
                name: 'Test',
                async run({ contracts, isTypeScript, outputs }) {
                  return {
                    imports: '/* imports test */',
                    prepend: '/* prepend test */',
                    content: '/* content test */',
                  }
                },
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.ts
      ✔ Writing to generated.ts"
    `)
  /* eslint-disable no-irregular-whitespace */
  await expect(
    readFile(resolve(dir, 'generated.ts'), 'utf8'),
  ).resolves.toMatchInlineSnapshot(`
      "/* imports test */

      /* prepend test */

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Foo
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      export const fooAbi = [] as const

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Test
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /* content test */
      "
    `)
  /* eslint-enable no-irregular-whitespace */
})

test('add new test: generates output with multiple plugins', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
            plugins: [
              {
                name: 'Test1',
                async run({ contracts, isTypeScript, outputs }) {
                  return {
                    imports: '/* imports test1 */',
                    prepend: '/* prepend test1 */',
                    content: '/* content test1 */',
                  }
                },
              },
              {
                name: 'Test2',
                async run({ contracts, isTypeScript, outputs }) {
                  return {
                    imports: '/* imports test2 */',
                    prepend: '/* prepend test2 */',
                    content: '/* content test2 */',
                  }
                },
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.ts
      ✔ Writing to generated.ts"
    `)
  /* eslint-disable no-irregular-whitespace */
  await expect(
    readFile(resolve(dir, 'generated.ts'), 'utf8'),
  ).resolves.toMatchInlineSnapshot(`
      "/* imports test1 */

      /* imports test2 */

      /* prepend test1 */

      /* prepend test2 */

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Foo
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      export const fooAbi = [] as const

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Test1
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /* content test1 */

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Test2
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      /* content test2 */
      "
    `)
  /* eslint-enable no-irregular-whitespace */
})

test('add new test: generates output with no plugins', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
            plugins: [],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await generate()

  expect(console.formatted).toMatchInlineSnapshot(`
      "- Validating plugins
      ✔ Validating plugins
      - Resolving contracts
      ✔ Resolving contracts
      - Running plugins
      ✔ Running plugins
      - Writing to generated.ts
      ✔ Writing to generated.ts"
    `)
  /* eslint-disable no-irregular-whitespace */
  await expect(
    readFile(resolve(dir, 'generated.ts'), 'utf8'),
  ).resolves.toMatchInlineSnapshot(`
      "//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Foo
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      export const fooAbi = [] as const
      "
    `)
  /* eslint-enable no-irregular-whitespace */
})

test('add new test: generates output with invalid plugin', async () => {
  const { dir } = await createFixture({
    files: {
      tsconfig: true,
      'wagmi.config.ts': dedent`
          export default {
            out: 'generated.ts',
            contracts: [
              {
                abi: [],
                name: 'Foo',
              },
            ],
            plugins: [
              {
                name: 'InvalidPlugin',
                async run({ contracts, isTypeScript, outputs }) {
                  throw new Error('Invalid plugin')
                },
              },
            ],
          }
        `,
    },
  })
  const spy = vi.spyOn(process, 'cwd')
  spy.mockImplementation(() => dir)

  await expect(generate()).rejects.toThrowErrorMatchingInlineSnapshot(
    '"Invalid plugin"',
  )
})
