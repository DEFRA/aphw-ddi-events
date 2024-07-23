describe('Entry point test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  jest.mock('../../app/storage')
  const { initialiseTables } = require('../../app/storage')
  initialiseTables.mockResolvedValue()

  jest.mock('../../app/messaging')
  const { start, stop } = require('../../app/messaging')
  start.mockResolvedValue()
  stop.mockResolvedValue()

  const mockExit = jest.spyOn(process, 'exit')
    .mockImplementation((number) => { throw new Error('process.exit: ' + number) })
  const mockStart = jest.fn()
  const mockServer = {
    start: mockStart.mockReturnThis()
  }

  jest.mock('../../app/server', () => jest.fn(() => {
    return {
      then (callback) {
        callback(mockServer)
        return this
      },
      catch (callback) {
        try {
          callback(new Error('Error forcing an exit'))
        } catch (e) {
        }
      }
    }
  }))

  test('entry point starts server', async () => {
    require('../../app')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(initialiseTables).toHaveBeenCalledTimes(1)
    expect(start).toHaveBeenCalledTimes(1)
    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(mockExit).toHaveBeenCalledTimes(1)
  })
})
