describe('Status Metrics', () => {

  // report uptime as counter: var js_UptimeSinceReboot = '62,05,43';
  // "62,05,43" => Time since last reboot	62 Days, 05 Hours and 43 Minutes
  test('should parse uptime', () => {
    const expected = { Days: 62, Hours: 5, Minutes: 43 }

    const given = "62,05,43"
    let uptime = /^(?<Days>\d+),(?<Hours>\d+),(?<Minutes>\d+)$/.exec(given)
    expect({ Days: Number.parseInt(uptime?.groups?.Days!), Hours: Number.parseInt(uptime?.groups?.Hours!), Minutes: Number.parseInt(uptime?.groups?.Minutes!) }).toEqual(expected)
  })
})